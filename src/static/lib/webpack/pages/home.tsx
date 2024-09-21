import React from "react";
import Page from "../page";
import JsonView from '@uiw/react-json-view';

export default class Home extends Page {

   render() {
      return (
         <div>
            <h1>Home</h1>
            <JsonView value={this.props.request} />
         </div>
      );
   }
}

(window as any).reactComponentHome = Home;