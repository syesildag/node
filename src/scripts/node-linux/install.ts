import { Service, ServiceOptions } from 'node-linux';
import options from './options';

// Create a new service object
var svc = new Service(options as ServiceOptions);

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', () => {
   svc.start();
});

svc.install();