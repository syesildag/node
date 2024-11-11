import "dotenv/config";
import { ServiceOptions } from 'node-linux';
import path from 'path';
import { Immutable } from '../../utils/utilityTypes';

export default {
   name: 'node',
   description: 'The nodejs.org express web server.',
   script: path.join(__dirname, '../../index.js'),
   env: Object.keys(process.env).map(key => ({ name: key, value: process.env[key] })),
   user: process.env.NODE_USER,
   group: process.env.NODE_GROUP,
   cwd: process.cwd(),
   wait: 2,
   grow: .5,
   abortOnError: false
} as Immutable<ServiceOptions>;