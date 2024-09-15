import compression from "compression";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import fs from 'fs';
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import path from 'path';
import favicon from "serve-favicon";
import rootValue from "./graphql/root";
import stringify from "./utils/circularJSON";

const app = express();

app.use(compression({ filter: shouldCompress }));

function shouldCompress(req: express.Request, res: express.Response) {
   if (req.headers['x-no-compression'])
      // don't compress responses with this request header
      return false;

   // fallback to standard filter function
   return compression.filter(req, res);
}

// load the cookie-parsing middleware
app.use(cookieParser());

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static'), {
   index: false,
   etag: true,
   maxAge: '1d',
   redirect: false,
   setHeaders: function (res, path, stat) {
      res.setHeader('x-timestamp', Date.now());
   },
}));

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
   console.error(err.stack);
   res.status(500).send('Something broke!');
});

// JSON parsing middleware
app.use(express.json({ limit: '1mb' }));

// RAW parsing middleware
app.use(express.raw({ limit: '1mb' }));

// TEXT parsing middleware
app.use(express.text({ limit: '1mb' }));

// URLENCODED parsing middleware
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Favicon
app.use(favicon(path.join(__dirname, 'static/images', 'favicon.ico')));

// Construct a schema, using GraphQL schema language
const schema = buildSchema(
   fs.readFileSync(
      path.join(__dirname, 'schema.graphql'), {
      encoding: 'utf8'
   }));

// Create and use the GraphQL handler.
app.all("/graphql", createHandler({ schema, rootValue }));

app.get("/:page", (req: Request, res: Response) => {
   res.send(`
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${process.env.TITLE}</title>
      <script type="module" src="/static/lib/webpack/page.js"></script>
   </head>
   <body>
      <script>
         document.addEventListener("DOMContentLoaded", function (event) {
            // your page initialization code here
            // the DOM will be available here
            mountPage('${stringify(req)}', 'placeholder');
         });
      </script>
      <div id="placeholder">&nbsp;</div>
   </body>
</html>`);
});

const PORT: number = +process.env.PORT!;
const HOST: string = process.env.HOST!;
app.listen(PORT, HOST, () => {
   console.log(`[server]: Server is running at http://${HOST}:${PORT}`);
});