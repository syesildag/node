import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import React, { FormEvent } from "react";
import Page from "../../../../react/page";
import ThemeContainer from '../../../../react/themeContainer';

export default class Test extends Page {

   private handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      return (
         <ThemeContainer>
            <a href="/form">Reset</a>
            <form method="post" onSubmit={this.handleSubmit}>
               <input type="hidden" name="secret" value={this.props.request.secret} />
               <Grid2 container spacing={2}>
                  <Grid2 size={'auto'}>
                     <label htmlFor="firstName">First Name:</label>
                  </Grid2>
                  <Grid2 size={'grow'}>
                     <input type="text" id="firstName" name="firstName" />
                  </Grid2>
                  <Grid2 size={'auto'}>
                     <label htmlFor="lastName">Last Name:</label>
                  </Grid2>
                  <Grid2 size={'grow'}>
                     <input type="text" id="lastName" name="lastName" />
                  </Grid2>
                  <Grid2 size={12}>
                     <Button type="submit" variant="contained">Submit</Button>
                  </Grid2>
               </Grid2>
            </form>
         </ThemeContainer>
      );
   }
}