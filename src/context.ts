import { RequestParams, Request } from "graphql-http";

export type Context = {
  req: Request<any, any>;
  params: RequestParams;
};
