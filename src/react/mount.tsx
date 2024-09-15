import React from "react";
import { createRoot } from "react-dom/client";

export default function mount(page: string, placeholder: string) {
   let container = document.getElementById(placeholder);
   if (container) {
      const root = createRoot(container);
      root.render(<div> Page {page} </div>);
   }
   else
      console.error(`Element with id ${placeholder} not found.`);
}
