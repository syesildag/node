export default class Deferred<T> {

   #promise: Promise<T>;
   #resolve?: (value: T | PromiseLike<T>) => void;
   #reject?: (reason?: any) => void;

   constructor() {
      this.#promise = new Promise<T>((resolve, reject) => {
         this.#resolve = resolve;
         this.#reject = reject;
      });
   }

   promise() {
      return this.#promise;
   }

   resolve(value: T | PromiseLike<T>) {
      this.#resolve!(value);
   }

   reject(reason?: any) {
      this.#reject!(reason);
   }
}