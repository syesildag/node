export type DebounceReturnType = { (...args: any[]): any; cancel?(): any };

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export default function debounce<This>(func: (this: This, ...a: any[]) => any, wait: number = 0, immediate?: boolean): DebounceReturnType {
   let timeout: null | NodeJS.Timeout;

   let debounced: DebounceReturnType = function (this: This, ...args: any[]) {
      if (timeout)
         clearTimeout(timeout);
      timeout = setTimeout(() => {
         timeout = null;
         if (!immediate) func.apply(this, args);
      }, wait);
      if (immediate && !timeout) func.apply(this, args);
   };

   debounced.cancel = function () {
      if (timeout)
         clearTimeout(timeout);
      timeout = null;
   };

   return debounced;
}