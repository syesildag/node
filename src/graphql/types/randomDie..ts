import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import {
   IRandomDieResolver,
   QueryGetDieArgs,
   ResolverTypeWrapper,
   Scalars
} from "../../generated/schema-types";

export interface RollArgs {
   numRolls: number;
}

export default class RandomDie implements IRandomDieResolver {

   private _numSides: number;

   constructor({ numSides }: QueryGetDieArgs) {
      this._numSides = numSides ?? 6;
   }

   numSides(args: {}, ctx?: Context, info?: GraphQLResolveInfo): ResolverTypeWrapper<Scalars["Int"]["output"]> {
      return this._numSides;
   }

   rollOnce() {
      return 1 + Math.floor(Math.random() * this._numSides);
   }

   roll({ numRolls }: RollArgs) {
      var output = [];
      for (var i = 0; i < numRolls; i++)
         output.push(this.rollOnce());
      return output;
   }
}