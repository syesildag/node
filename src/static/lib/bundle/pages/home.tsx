import React, { lazy } from "react";
import Page from "../../../../react/page";
const JsonView = lazy(() => import('@uiw/react-json-view'));

export default class Home extends Page {
   render() {
      return super.render(
         <div>
            <h1>Homepage</h1>
            <JsonView value={this.props.request} />
         </div>
      );
   }
}