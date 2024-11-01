import React, { FormEvent } from "react";
import Page from "../../../../react/page";

export default class Test extends Page {

   private handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const target = event.target as HTMLFormElement;
      const data = new FormData(target);
      const request = {};
      for (const [key, value] of data.entries())
         request[key] = value;
      console.log('request:');
      console.dir(request);
      try {
         const response = await fetch(target.action, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
         });
         let data = await response.json();
         console.log('response');
         console.dir(data);
      }
      catch (error) {
         console.error(`error: ${error}`);
      }

      window.location.href = "/home";
   }

   render() {
      return (<>
         <a href="/test">Reload</a>
         <form method="post" onSubmit={this.handleSubmit}
            style={{
               display: "flex",
               flexDirection: "column", alignItems: "flex-start"
            }}>
            <input type="hidden" name="secret" value={this.props.request.secret} />
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" />
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" />
            <input type="submit" />
         </form>
      </>
      );
   }
}