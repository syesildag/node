import { Service, ServiceOptions } from 'node-windows';
import options from './options';

// Create a new service object
var svc = new Service(options as ServiceOptions);

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
   console.log('Uninstall complete.');
   console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();