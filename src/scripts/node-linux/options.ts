import "dotenv/config";
import { ServiceOptions } from 'node-linux';
import path from 'path';
import { Immutable } from '../../utils/utilityTypes';

export default {
   name: 'node',
   description: 'The nodejs.org example web server.',
   script: path.join(__dirname, '../../index.js'),
   env: Object.keys(process.env).map(key => ({ name: key, value: process.env[key] })),
   user: process.env.USER,
   group: process.env.GROUP,
   cwd: process.cwd(),
} as Immutable<ServiceOptions>;