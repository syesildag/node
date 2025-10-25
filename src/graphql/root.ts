//validate(schema, documentNode);

import { Resolvers } from "../generated/schema-types";
import getDie from "./query/getDie";

// The root provides the top-level API endpoints
const rootValue = {
   getDie
};

export default rootValue;