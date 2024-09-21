import React, { ComponentClass, FunctionComponent } from "react";
import { createRoot } from "react-dom/client";

export interface Props {
   request?: any;
}

export default abstract class Page extends React.Component<Props> {

   public static mount(request: any, placeholder: string, component: ComponentClass<Props>) {
      let container = document.getElementById(placeholder);
      if (container) {
         const root = createRoot(container);
         if (component)
            root.render(React.createElement(component, { request }));
         else
            root.render(<h1>Component not found.</h1>);
      }
      else
         console.error(`Element with id ${placeholder} not found.`);
   }
}

(window as any).reactComponent = Page;