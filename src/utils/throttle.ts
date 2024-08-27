// Returns a function that can only be triggered every `delay` milliseconds.
// In other words, the function will not be called unless it has been more
// than `delay` milliseconds since the last call.
export default function throttle<This = any, A extends any[] = any[]>(func: (this: This, ...args: A) => any, delay: number) {
   let recent: number;
   return function throttled(this: This, ...args: A) {
      let n: number = Date.now();

      if (!recent || n - recent > delay) {
         func.apply(this, args);
         recent = n;
      }
   };
}