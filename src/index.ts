import compression from "compression";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import fs from 'fs';
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import schedule from "node-schedule";
import path from 'path';
import favicon from "serve-favicon";
import rootValue from "./graphql/root";
import stringify from "./utils/circularJSON";
import { getAbsoluteFileNamesFromDir, getFileNamesFromDir } from "./utils/fileNames";
import JobFactory from "./utils/jobFactory";
import { Constructor } from "./utils/annotations";
import { Socket } from "net";

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

app.post("/:page", (req: Request, res: Response) => {
   res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(req.body));
});

app.get("/:page", (req: Request, res: Response) => {

   const page = req.params.page;

   if (!PAGES.has(page)) {
      res.redirect('/home');
      return;
   }

   const pageScript = `/static/lib/bundle/pages/${page}.js`;

   res.send(`
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${process.env.TITLE}</title>
      <script type="module" src="${pageScript}"></script>
   </head>
   <body>
      <noscript>
         Your browser does not support JavaScript or it is turned off
      </noscript>
      <script type="module">
         import component from '.${pageScript}';
         document.addEventListener("DOMContentLoaded", function (event) {
            const request = ${stringify(req)};
            component.mount({request}, 'placeholder', component);
         });
      </script>
      <div id="placeholder"/>
   </body>
</html>`);
});

const PAGE_PROMISES = getFileNamesFromDir(path.join(__dirname, 'static/lib/bundle/pages'));
let PAGES = new Set<string>();

const PORT: number = +process.env.PORT!;
const HOST: string = process.env.HOST!;
const server = app.listen(PORT, HOST, async () => {
   console.log(`[server]: Server is running at http://${HOST}:${PORT}`);
   const pages = (await PAGE_PROMISES).map(file => file.name.substring(0, file.name.lastIndexOf('.')));
   PAGES = new Set<string>(pages);
});

let connections: Array<Socket> = [];
server.on('connection', connection => {
   connections.push(connection);
   connection.on('close', hadError => {
      if(hadError)
         console.error('Socket closed with an error');
      connections = connections.filter(curr => curr !== connection)
   });
});

process.on('SIGTERM', gracefulShutdown);

process.on('SIGINT', gracefulShutdown);

function gracefulShutdown(event: NodeJS.Signals) {

   let scheduler = schedule.gracefulShutdown();

   console.log(`${event} signal received.`);

   console.log('Shutting down gracefully...');

   connections.forEach(connection => {
      console.log(`Closing active connection ${connection.remoteAddress}:${connection.remotePort}`);
      connection.end();
   });

   server.close(async (err?: Error) => {
      console.log(`Server closed with ${err ?? 'Success'}`);
      // Close any other connections or resources here
      await scheduler;
      process.exit(0);
   });

   setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      connections.forEach(curr => curr.destroy());
      process.exit(1);
   }, +process.env.SERVER_TERMINATE_TIMEOUT!);
}

async function scheduleJobs() {
   const JOBS = await getAbsoluteFileNamesFromDir(path.join(__dirname, 'jobs'));
   JOBS
      .filter(file => file.endsWith('.js'))
      .forEach(async (file) => {
         const module = await import(file);
         const jobFactory: JobFactory = new (module.default as Constructor<JobFactory>);
         jobFactory.create();
      });
}

scheduleJobs();