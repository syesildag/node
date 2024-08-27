import { MessagePort } from 'worker_threads';
import { fileURLToPath, URL } from 'url';

export default abstract class AbstractBaseWorker<T, R> {

   constructor(parentPort: null | MessagePort) {
      if (parentPort)
         parentPort.on('message', (task: T) => {
            parentPort!.postMessage(this.run(task));
         });
   }

   getModulePath() {
      return fileURLToPath(this.getImportMetaUrl());
   }

   protected abstract getImportMetaUrl(): string | URL;

   protected abstract run(task: T): R;
}