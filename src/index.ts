import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import favicon from "serve-favicon";
import { fileURLToPath, URL } from 'url';
import path, { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

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
app.use('/static', express.static(path.join(__dirname, '../../static'), {
   index: false,
   maxAge: '1d',
   redirect: false,
   setHeaders: function (res, path, stat) {
      res.setHeader('x-timestamp', Date.now());
   }
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
app.use(favicon(path.join(__dirname, '../../static/images', 'favicon.ico')));

app.get("/:page", (req: Request, res: Response) => {
   res.send(
`
<html>
   <head>
      <title>${process.env.TITLE}</title>
   </head>
   <body>
      Express + TypeScript Server
      <br>Params  :<br> ${JSON.stringify(req.params)}
      <br>Query   :<br> ${JSON.stringify(req.query)}
      <br>Headers :<br> ${JSON.stringify(req.headers)}
      <br>Cookies :<br> ${JSON.stringify(req.cookies)}
      <br>URL     :<br> ${JSON.stringify(req.url)}
      <br>OURL    :<br> ${JSON.stringify(req.originalUrl)}
      <br>BURL    :<br> ${JSON.stringify(req.baseUrl)}
      <br>SECRET  :<br> ${JSON.stringify(req.secret)}
      <br>SECURE  :<br> ${JSON.stringify(req.secure)}
   </body>
</html>`
   );
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
   console.log(`[server]: Server is running at http://localhost:${PORT}`);
});