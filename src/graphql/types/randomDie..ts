import { GetDieArgs } from "../query/getDie";

export interface RollArgs {
   numRolls: number;
}

export default class RandomDie {

   private numSides: number;

   constructor(getDieArgs: GetDieArgs) {
      this.numSides = getDieArgs.numSides ?? 6;
   }

   rollOnce() {
      return 1 + Math.floor(Math.random() * this.numSides);
   }

   roll(rollArgs: RollArgs) {
      var output = [];
      for (var i = 0; i < rollArgs.numRolls; i++)
         output.push(this.rollOnce());
      return output;
   }
}