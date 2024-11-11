import "dotenv/config";
import { ServiceOptions } from 'node-windows';
import path from 'path';
import { Immutable } from '../../utils/utilityTypes';

export default {
   name: 'node',
   description: 'The nodejs.org express web server.',
   script: path.join(__dirname, '../../index.js'),
   nodeOptions: [
      '--max-old-space-size=4096'
   ],
   cwd: process.cwd(),
   //, dependsOn: ["serviceA"],
   //, scriptOptions: '-c C:\\path\\to\\somewhere\\special -i' // script options to pass to the script
   //, execPath: 'C:\\path\\to\\specific\\node.exe', // specific node executable to use to run your script
   //, workingDirectory: '...'
   //, allowServiceLogon: true
} as Immutable<ServiceOptions>;

// svc.logOnAs.domain = 'mydomain.local';
// svc.logOnAs.account = 'username';
// svc.logOnAs.password = 'password';

// svc.sudo.password = 'password';
