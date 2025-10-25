//validate(schema, documentNode);

import { Resolvers } from "../generated/schema-types";
import getDie from "./query/getDie";

// The root provides the top-level API endpoints
const rootValue: Required<Resolvers> = {
   getDie,
   createReview: () => {
      throw new Error("Not implemented");
   }
};

export default rootValue;