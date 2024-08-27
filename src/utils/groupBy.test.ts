import { describe, expect, test } from '@jest/globals';
import groupBy from './groupBy.js';
import assert from 'assert';

const inventory = [
   { city: "London", name: "asparagus", type: "vegetables", quantity: 5 },
   { city: "London", name: "bananas", type: "fruit", quantity: 0 },
   { city: "London", name: "cherries", type: "fruit", quantity: 5 },
   { city: "London", name: "goat", type: "meat", quantity: 23 },
   { city: "Rome", name: "fish", type: "meat", quantity: 22 },
];

const groupedInventory = {
   "vegetables": {
      "London": [
         { "city": "London", "name": "asparagus", "type": "vegetables", "quantity": 5 }]
   },
   "fruit": {
      "London": [
         { "city": "London", "name": "bananas", "type": "fruit", "quantity": 0 },
         { "city": "London", "name": "cherries", "type": "fruit", "quantity": 5 }]
   },
   "meat": {
      "London": [
         { "city": "London", "name": "goat", "type": "meat", "quantity": 23 }],
      "Rome": [
         { "city": "Rome", "name": "fish", "type": "meat", "quantity": 22 }]
   }
};

describe('groupBy', () => {
   test('equals', () => {
      let testGroupedInventory = groupBy(inventory, ({ type }) => type, ({ city }) => city);
      assert.deepStrictEqual(testGroupedInventory, groupedInventory)
   });
});