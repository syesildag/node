import { diff } from 'jest-diff';
import * as os from 'os';
import * as prettyFormat from 'pretty-format';
import range from './utils/rangeIterator';
import squareWorker, { Task } from './worker/custom/squareWorker';
import WorkerPoolManager from './worker/workerPoolManager';
import throttle from './utils/throttle';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function echo<T = any>(value: T): T {
   console.log("echo: " + value);
   return value;
}

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

   let throttled = throttle(echo, 500);
   throttled(1);
   throttled(2);
   throttled(3);
   throttled(4);
   await delay(1000);
   throttled(5);
}
main();