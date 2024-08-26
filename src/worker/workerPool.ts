import * as os from 'os';
import { AsyncResource } from 'async_hooks';
import { EventEmitter } from 'events';
import { Worker, WorkerOptions } from 'worker_threads';

const kError = Symbol('kError');
const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

export type Callback<Result, This = any> = (this: This, err: null | Error, result: null | Result) => void;

class WorkerPoolTaskInfo<Result, This = any> extends AsyncResource {

   private thisArg?: This;
   private callback: Callback<Result, This>;

   constructor(callback: Callback<Result, This>, thisArg?: This) {
      super('WorkerPoolTaskInfo');
      this.thisArg = thisArg;
      this.callback = callback;
   }

   done(err: null | Error, result: null | Result) {
      this.runInAsyncScope<This, void>(this.callback, this.thisArg, err, result);
      this.emitDestroy();  // `TaskInfo`s are used only once.
   }
}

export default class WorkerPool<Task, Result, This = any> extends EventEmitter {

   private numThreads: number;
   private workers: Worker[];
   private freeWorkers: Worker[];
   private filename: string;
   private options?: WorkerOptions;
   private closed: boolean;

   constructor(filename: string, options?: WorkerOptions, numThreads: number = os.cpus().length) {
      super();
      this.numThreads = numThreads;
      this.filename = filename;
      this.options = options;
      this.closed = false;
      this.workers = [];
      this.freeWorkers = [];

      for (let i = 0; i < numThreads; i++)
         this.addNewWorker();
   }

   public getNumThreads() {
      return this.numThreads;
   }

   onError(listener: (err: Error) => void): this {
      return this.on(kError, listener);
   }

   addNewWorker() {
      //const worker = new Worker(path.resolve(dirname(), 'worker.js'));
      const worker = new Worker(this.filename, this.options);
      worker.on('message', (result: Result) => {
         // In case of success: Call the callback that was passed to `runTask`,
         // remove the `TaskInfo` associated with the Worker, and mark it as free
         // again.
         ((worker as any)[kTaskInfo] as WorkerPoolTaskInfo<Result, This>).done(null, result);
         (worker as any)[kTaskInfo] = null;
         this.freeWorkers.push(worker);
         this.emit(kWorkerFreedEvent);
      });
      worker.on('error', (err: Error) => {
         // In case of an uncaught exception: Call the callback that was passed to
         // `runTask` with the error.
         if ((worker as any)[kTaskInfo])
            ((worker as any)[kTaskInfo] as WorkerPoolTaskInfo<Result, This>).done(err, null);
         else
            this.emit(kError, err);
      });
      worker.on('exit', (exitCode: number) => {
         // Remove the worker from the list and start a new Worker to replace the
         // current one.
         if (!this.closed) {
            this.workers.splice(this.workers.indexOf(worker), 1);
            this.addNewWorker();
         }
      });
      this.workers.push(worker);
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
   }

   runTask(task: Task, callback: Callback<Result, This>, thisArg?: This) {
      if (this.freeWorkers.length === 0) {
         // No free threads, wait until a worker thread becomes free.
         this.once(kWorkerFreedEvent, () => this.runTask(task, callback));
         return;
      }

      const worker = this.freeWorkers.pop();
      ((worker as any)[kTaskInfo] as WorkerPoolTaskInfo<Result, This>) = new WorkerPoolTaskInfo<Result, This>(callback, thisArg);
      worker!.postMessage(task);
   }

   close() {
      this.closed = true;
      for (const worker of this.workers) {
         //Stop all JavaScript execution in the worker thread as soon as possible.
         //Returns a Promise for the exit code that is fulfilled when the 'exit' event is emitted.
         worker.terminate();
         //Calling unref() on a worker will allow the thread to exit if this is the only active handle in the event system.
         //If the worker is already unref()ed calling unref() again will have no effect.
         worker.unref();
      }
   }
}
