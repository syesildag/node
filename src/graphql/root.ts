//validate(schema, documentNode);

import { Resolvers } from "../generated/schema-types";
import RandomDie from "./types/randomDie.";
import Review from "./types/review";

// The root provides the top-level API endpoints
const rootValue: Required<Resolvers> = {
   getDie: (args) => (new RandomDie(args)),
   createReview: (args) => (new Review(args))
};

export default rootValue;