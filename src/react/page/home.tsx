import React from "react";

export interface Props {
}

export interface State {
}

export default class Home extends React.Component<Props, State> {

   constructor(props: Props) {
      super(props);
   }

   render() {
      return (
         <div>
            <h1>Home</h1>
            <p>Welcome to the home page</p>
         </div>
      );
   }
}