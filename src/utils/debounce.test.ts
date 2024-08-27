import { describe, expect, jest, test } from '@jest/globals';
import debounce from './debounce.js';

jest.useFakeTimers();

type Value = { title?: string };

let globalTitle: string = "";

function echo(title: string) {
   globalTitle = title;
}

describe('debounce', () => {
   test('timeout equals to Hello', () => {

      let debouncedEcho = debounce(echo, 1000);
      debouncedEcho("firstHello");
      debouncedEcho("secondHello");
      debouncedEcho("thirdHello");

      jest.runOnlyPendingTimers();

      expect(globalTitle).toStrictEqual("thirdHello");
   });
});