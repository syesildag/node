import React from "react";
import JsonView from '@uiw/react-json-view';
import Page from "../../../../react/page";
import ThemeContainer from "../../../../react/themeContainer";

export default class Home extends Page {
   render() {
      return (
         <ThemeContainer>
            <div>
               <h1>Homepage</h1>
               <JsonView value={this.props.request} />
            </div>
         </ThemeContainer>
      );
   }
}