import { parentPort } from 'worker_threads';
import AbstractBaseWorker from '../abstractBaseWorker';

export interface Task {
   a: number;
   b: number;
}

class SquareWorker extends AbstractBaseWorker<Task, number> {

   getFilename(): string {
      return __filename;
   }

   protected run(task: Task): number {
      let { a, b } = task;
      return a * b;
   }
}

export default new SquareWorker(parentPort);