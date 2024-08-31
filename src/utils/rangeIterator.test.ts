import { describe, expect, test } from '@jest/globals';
import rangeIterator from './rangeIterator';

describe('rangeIterator', () => {
   test('nexts equal 1, 3, 5, 7', () => {
      const it = rangeIterator(1, 9, 2);

      let next = it.next();
      expect(next.value).toBe(1);
      expect(next.done).toBeFalsy();

      next = it.next();
      expect(next.value).toBe(3);
      expect(next.done).toBeFalsy();

      next = it.next();
      expect(next.value).toBe(5);
      expect(next.done).toBeFalsy();

      next = it.next();
      expect(next.value).toBe(7);
      expect(next.done).toBeFalsy();

      next = it.next();
      expect(next.value).toBe(4);
      expect(next.done).toBeTruthy();

   });
});