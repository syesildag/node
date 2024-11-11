export type BooleanPropertyNames<T> = { [K in keyof T]: T[K] extends Boolean ? K : never }[keyof T];
export type BooleanProperties<T> = Pick<T, BooleanPropertyNames<T>>;

type ImmutableObject<T> = {
   readonly [K in keyof T]: Immutable<T[K]>;
}

export type Immutable<T> = {
   readonly [K in keyof T]: T[K] extends Function ? T[K] : ImmutableObject<T[K]>;
}