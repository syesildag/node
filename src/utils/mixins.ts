export interface Constructor<A extends any[] = any[], T = any> {
   new(...args: A): T;
}

export function Named<T extends Constructor>(Base: T) {
   return class extends Base {
      private _name: string | undefined;
      constructor(...args: any[]) {
         super(...args);
      }

      public getName() {
         return this._name;
      }

      public setName(_name: string) {
         this._name = _name;
      }
   }
}