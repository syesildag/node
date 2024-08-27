export type BooleanPropertyNames<T> = { [K in keyof T]: T[K] extends Boolean ? K : never }[keyof T];
export type BooleanProperties<T> = Pick<T, BooleanPropertyNames<T>>;