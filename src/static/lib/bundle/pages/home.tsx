import React from "react";
import JsonView from '@uiw/react-json-view';
import Page from "../../../../react/page";

export default class Home extends Page {

   render() {
      return (
         <div>
            <h1>Homepage</h1>
            <JsonView value={this.props.request} />
         </div>
      );
   }
}