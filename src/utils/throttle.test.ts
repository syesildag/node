import { describe, expect, jest, test } from '@jest/globals';
import throttle from './throttle';

Object.defineProperty(global, 'performance', {
   writable: true,
});

jest.useFakeTimers();

let counter = 0;

function increment() {
   counter++;
}

describe('debounce', () => {
   test('timeout equals to Hello', () => {

      let throttled = throttle(increment, 1000);

      throttled(); //time = 0, OK
      jest.advanceTimersByTime(600);
      throttled(); //time = 600, KO
      jest.advanceTimersByTime(600);
      throttled(); //time = 1200, OK
      jest.advanceTimersByTime(600);
      throttled(); //time = 1800, KO
      jest.advanceTimersByTime(600);
      throttled(); //time = 2400, OK
      jest.advanceTimersByTime(600);
      throttled(); //time = 3000, KO

      expect(counter).toBe(3);
   });
});