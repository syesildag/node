import React from "react";
import { createRoot } from "react-dom/client";
import { GraphiQL } from "graphiql";
import type { FetcherOpts, FetcherParams } from '@graphiql/toolkit';

let URL: string;

export default function mountGraphiql(placeholder: string, endpoint: string) {

   URL = endpoint;

   let container = document.getElementById(placeholder);
   if (container) {
      const root = createRoot(container);
      root.render(<GraphqlPlayground />);
   }
   else
      console.error(`Element with id ${placeholder} not found.`);
}

// noinspection JSUnusedLocalSymbols
function graphQLFetcher(graphQLParams: FetcherParams, opts?: FetcherOpts) {
   return fetch(URL, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphQLParams),
      credentials: "omit"
   }).then(response => response.json())
      .catch(reason => console.log(reason));
}

const defaultQuery = `query GetDie($numSides: Int, $numRolls: Int!) {
  getDie(numSides: $numSides) {
    roll(numRolls: $numRolls)
  }
}`;

const defaultVariables = `{
  "numSides": 6,
  "numRolls": 5
}`;

function GraphqlPlayground() {
   return <GraphiQL
      fetcher={graphQLFetcher}
      defaultQuery={defaultQuery}
      variables={defaultVariables}
   />;
}