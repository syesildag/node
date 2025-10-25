import { QueryGetDieArgs } from "../../generated/schema-types";
import RandomDie from "../types/randomDie.";

export default function getDie(getDieArgs: QueryGetDieArgs) {
   return new RandomDie(getDieArgs);
}