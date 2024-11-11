import { Service, ServiceOptions } from 'node-linux';
import options from './options';

// Create a new service object
var svc = new Service(options as ServiceOptions);

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', () => {
   svc.start();
});

svc.on('alreadyinstalled', () => {
   console.log('alreadyinstalled');
});

svc.on('invalidinstallation', () => {
   console.log('invalidinstallation');
});

svc.on('start', () => {
   console.log('start');
});

svc.on('stop', () => {
   console.log('stop');
});

svc.on('error', () => {
   console.log('error');
});

svc.on('doesnotexist', () => {
   console.log('doesnotexist');
});

svc.install();