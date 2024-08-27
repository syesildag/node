export interface ToString<T> {
   (item: T): string;
}

export type GroupHash<T> = { [index: string]: T };

export default function groupBy<T>(list: T[], f1: ToString<T>): GroupHash<T[]>;
export default function groupBy<T>(list: T[], f1: ToString<T>, f2: ToString<T>): GroupHash<GroupHash<T[]>>;
export default function groupBy<T>(list: T[], f1: ToString<T>, f2: ToString<T>, f3: ToString<T>): GroupHash<GroupHash<GroupHash<T[]>>>;
export default function groupBy<T>(list: T[], f1: ToString<T>, f2: ToString<T>, f3: ToString<T>, f4: ToString<T>): GroupHash<GroupHash<GroupHash<GroupHash<T[]>>>>;
export default function groupBy<T>(list: T[], ...toStringArray: Array<ToString<T>>): GroupHash<any> {
   let result: GroupHash<any> = {};
   list.forEach(item => {

      let subResult: any = result;
      let idx = 0;

      for (let toString of toStringArray) {
         idx++;
         let key = toString(item);
         let subSubResult = subResult[key];
         if (!subSubResult) {
            subSubResult = idx === toStringArray.length ? [] : {};
            subResult[key] = subSubResult;
         }
         subResult = subSubResult;
      }

      subResult.push(item);
   });
   return result
}