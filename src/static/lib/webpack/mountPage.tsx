import React from "react";
import { createRoot } from "react-dom/client";

(window as any).mountPage = mountPage;
export default function mountPage(request: any, placeholder: string) {
   let container = document.getElementById(placeholder);
   if (container) {
      const root = createRoot(container);
      root.render(<div> Page {request} </div>);
   }
   else
      console.error(`Element with id ${placeholder} not found.`);
}