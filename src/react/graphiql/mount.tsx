import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from "graphiql";
import React from "react";
import { createRoot } from "react-dom/client";

export default function mount(placeholder: string, url: string) {

   let container = document.getElementById(placeholder);
   if (container) {
      const root = createRoot(container);
      root.render(<GraphiQL
         fetcher={createGraphiQLFetcher({ url })}
         defaultQuery={defaultQuery}
         variables={defaultVariables}
      />);
   }
   else
      console.error(`Element with id ${placeholder} not found.`);
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