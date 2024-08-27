import { WorkerOptions } from 'worker_threads';
import AbstractBaseWorker from './abstractBaseWorker.js';
import WorkerPool from './workerPool.js';

export type CallbackIndex<Result, This = any> = (this: This, err: null | Error, result: null | Result, index?: number) => void;

export default class WorkerPoolManager<T, R, This = any> {
   constructor(
      private instance: AbstractBaseWorker<T, R>,
      private options?: Omit<WorkerOptions, "eval">,
      private numThreads?: number) {
   }

   run(tasks: T[], callback: CallbackIndex<R, This>): Promise<void> {
      return new Promise((resolve, reject) => {
         const pool = new WorkerPool<T, R, This>(this.instance.getModulePath(), this.options, this.numThreads);
         pool.onError(error => reject(error));
         let finished = 0;
         for (let i = 0; i < tasks.length; i++) {
            pool.runTask(tasks[i], (err, result) => {
               callback.call(this as unknown as This, err, result, i);
               if (++finished === tasks.length) {
                  pool.close();
                  resolve();
               }
            });
         }
      });
   }
}