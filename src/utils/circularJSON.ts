import { isObject } from "./assertions";

export const replacerFunc = () => {
  const visited = new WeakSet();
  return (key: string, value: any) => {
    if (isObject(value)) {
      if (visited.has(value))
        return;
      visited.add(value);
    }
    return value;
  };
};

export default function stringify(value: any, space?: string | number) {
  return JSON.stringify(value, replacerFunc(), space);
}
