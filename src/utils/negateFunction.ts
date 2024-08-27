export function negateFunction<This=any, A extends any[]=any[]>(this: This, predicate: (...args: A) => boolean) {
   return () => {
      return !predicate.apply<This, A, boolean>(this, arguments as A & IArguments);
   };
}