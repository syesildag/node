import { parentPort } from 'worker_threads';
import AbstractBaseWorker from '../abstractBaseWorker';

class JobWorker extends AbstractBaseWorker<Date, void> {

   getFilename(): string {
      return __filename;
   }

   protected run(fireDate: Date): void {
      console.log('jobWorker: ' + fireDate);
   }
}

export default new JobWorker(parentPort);