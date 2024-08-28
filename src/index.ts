import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { ServeStaticOptions } from "serve-static";
import cookieParser from "cookie-parser";
import { fileURLToPath, URL } from 'url';
import { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const app = express();

// load the cookie-parsing middleware
app.use(cookieParser());

// Serve static files
var options: ServeStaticOptions = {
   index: false,
   maxAge: '1d',
   redirect: false,
   setHeaders: function (res, path, stat) {
      res.setHeader('x-timestamp', Date.now());
   }
};

app.use('/static', express.static(__dirname + '/../../static'));

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
   console.error(err.stack);
   res.status(500).send('Something broke!');
});

const {
   port = 3000,
   title = 'HomePage'
} = process.env;

app.get("/", (req: Request, res: Response) => {
   res.send(
`
<html>
   <head>
      <title>${title}</title>
   </head>
   <body>
   Express + TypeScript Server
   </body>
</html>`
   );
});

app.listen(port, () => {
   console.log(`[server]: Server is running at http://localhost:${port}`);
});