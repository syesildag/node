import { parentPort } from 'worker_threads';
import AbstractBaseWorker from '../abstractBaseWorker.js';

export interface Task {
   a: number;
   b: number;
}

class SquareWorker extends AbstractBaseWorker<Task, number> {

   protected getImportMetaUrl(): string | URL {
      return import.meta.url;
   }

   protected run(task: Task): number {
      let { a, b } = task;
      return a * b;
   }
}

export default new SquareWorker(parentPort);