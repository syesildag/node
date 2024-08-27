// Returns a function that can only be triggered every `delay` milliseconds.
// In other words, the function will not be called unless it has been more
// than `delay` milliseconds since the last call.
export function throttle<This = any, A extends any[] = any[]>(this: This, func: (...a: A) => any, delay: number) {
   let recent: number;
   return function throttled<This = any>(this: This) {
      let args = arguments;
      let n: number = Date.now();

      if (!recent || recent - n > delay) {
         func.apply<This, A, any>(this, args as A & IArguments);
         recent = n;
      }
   };
}