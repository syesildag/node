import { CreateFetcherOptions, createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from "graphiql";
import React from "react";
import Page from '../../../react/page';

(window as any).mountGraphiql = mountGraphiql;
export default function mountGraphiql(placeholder: string, url: string) {
   Page.mount({url}, placeholder, graphiql);
}

function graphiql(options: CreateFetcherOptions) {
  return <GraphiQL
    fetcher={createGraphiQLFetcher(options)}
    defaultQuery={defaultQuery}
    variables={defaultVariables}
  />;
}

// noinspection JSUnusedLocalSymbols
const defaultQuery = `query GetDie($numSides: Int, $numRolls: Int!) {
  getDie(numSides: $numSides) {
    roll(numRolls: $numRolls)
  }
}`;

const defaultVariables = `{
  "numSides": 6,
  "numRolls": 5
}`;