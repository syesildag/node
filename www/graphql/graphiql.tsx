import React from "react";
import { createRoot } from "react-dom/client";
import { GraphiQL } from "graphiql";
import type { FetcherOpts, FetcherParams } from '@graphiql/toolkit';

let URL: string;

export default function mountGraphiql(placeholder: string, endpoint: string) {

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

const defaultQuery = `
query Hello {
  hello
}`;

const defaultVariables = '{"criterias": {"nbDays": 7,"startDate": "2022-06-10","nbAdults": 2,"etabIDs": [1]}}';

function GraphqlPlayground() {
   return <GraphiQL
      fetcher={graphQLFetcher}
      defaultQuery={defaultQuery}
      variables={defaultVariables}
   />;
}