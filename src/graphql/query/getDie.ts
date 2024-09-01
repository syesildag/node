import RandomDie from "../types/randomDie.";

export interface GetDieArgs {
   numSides: number;
}

export default function getDie(getDieArgs: GetDieArgs) {
   return new RandomDie(getDieArgs);
}