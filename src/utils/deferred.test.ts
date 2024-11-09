import { describe, expect, test } from '@jest/globals';
import Deferred from './deferred';

describe('deferred', () => {

   test('deferred equals Hello', async() => {

      const HELLO = "Hello";

      const deferred = new Deferred<string>();

      setTimeout(() => {
         deferred.resolve(HELLO);
      }, 1);

      let result = await deferred.promise();
      
      expect(result).toBe(HELLO);
   });
});