import React, { ComponentClass, FormEvent, FunctionComponent } from "react";
import { createRoot } from "react-dom/client";
import ThemeContainer from "./themeContainer";

export interface Props {
   request?: any;
   children?: React.ReactNode;
}

export interface HandleSubmitOptions {
   redirect: string;
   onBeforeRedirect?: () => void;
   onError?: (error: Error) => void;
}

export default abstract class Page extends React.Component<Props> {

   public static mount<P extends {} = any>(props: P, placeholder: string, component: FunctionComponent<P> | ComponentClass<P>) {
      let container = document.getElementById(placeholder);
      if (container) {
         const root = createRoot(container);
         if (component)
            root.render(React.createElement(component, props));
         else
            root.render(<h1>Component not found.</h1>);
      }
      else
         console.error(`Element with id ${placeholder} not found.`);
   }

   protected handleSubmit = ({
      redirect,
      onBeforeRedirect,
      onError
   }: HandleSubmitOptions) => async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      const request = {};
      for (const [key, value] of formData.entries())
         request[key] = value;

      try {
         const response = await fetch(form.action, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
         });
         let data = await response.json();
         if (data.error)
            throw new Error(data.error);

         onBeforeRedirect?.();
         window.location.href = redirect;
      }
      catch (error) {
         onError?.(error);
      }
   }

   public render(children: React.ReactNode = this.props.children) {
      return (
         <ThemeContainer>
            {children}
         </ThemeContainer>
      );
   }
}