import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import React from "react";
import Page from "../../../../react/page";

export default class Test extends Page {
   render() {
      return super.render(
         <form method="post" onSubmit={this.handleSubmit({ redirect: '/home' })}>
            <input type="hidden" name="secret" value={this.props.request.secret} />
            <Grid2 container spacing={0.5}>
               <Grid2>
                  <div style={{ minWidth: "8em" }}><label htmlFor="firstName">First Name:</label></div>
               </Grid2>
               <Grid2 flexGrow={99}>
                  <input size={32} type="text" id="firstName" name="firstName" />
               </Grid2>
               <Grid2 size={12} />
               <Grid2>
                  <div style={{ minWidth: "8em" }}><label htmlFor="lastName">Last Name:</label></div>
               </Grid2>
               <Grid2 flexGrow={99}>
                  <input size={32} type="text" id="lastName" name="lastName" />
               </Grid2>
               <Grid2 size={12} />
               <Grid2>
                  <Button type="submit" variant='contained'>Submit</Button>
               </Grid2>
               <Grid2>
                  <Button href='/form' variant='contained' color='error'>Reset</Button>
               </Grid2>
            </Grid2>
         </form>
      );
   }
}