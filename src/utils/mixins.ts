export interface Constructor<T> {
   new(...args: Array<any>): T;
}

export function Named<T extends Constructor<any>>(Base: T) {
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