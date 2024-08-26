import { diff } from 'jest-diff';
import * as os from 'os';
import prettyFormat from 'pretty-format';
import range from './utils/rangeIterator.js';
import squareWorker, { Task } from './worker/custom/squareWorker.js';
import WorkerPoolManager from './worker/workerPoolManager.js';

async function main() {

   console.log("Platform: " + os.platform());
   console.log("Architecture: " + os.arch());
   console.log("Hostname: " + os.hostname());

   [...range(1, 10, 2)]
      .map(i => Math.pow(i, 2))
      .forEach((index) => console.log("Index: " + index));

   const a = [1, 2, 3, 4, 5];
   console.log("a: " + prettyFormat.format(a));
   const b = [5, 4, 3, 2, 1];
   console.log("b: " + prettyFormat.format(b));
   console.log("diff: " + diff(a, b));

   let manager = new WorkerPoolManager<Task, number>(squareWorker);
   const tasks =
      [...range(0, 100)]
         .map(i => {
            return { a: i, b: i };
         });
   await manager.run(tasks, (err, result, idx) => console.log(err, idx, result));
   console.log("end of pool");
}
main();