declare module 'node-linux' {

   export type EventType =
      'install' | //Fired when the script is installed as a service.
      'alreadyinstalled' | //Fired if the script is already known to be a service.
      'invalidinstallation' | //Fired if an installation is detected but missing required files.
      'uninstall' | //Fired when an uninstallation is complete.
      'start' | //Fired when the new service is started.
      'stop' | //Fired when the service is stopped.
      'error' | //Fired in some instances when an error occurs.
      'doesnotexist'; //Fired when an attempt to start a non-existent service is detected.

   export interface EnvNameValue {
      name: string;
      value: string | undefined;
   }

   export interface ServiceOptions {
      name: string;
      description?: string;
      script: string;
      env?: EnvNameValue | EnvNameValue[];
      user?: string | undefined;
      group?: string | undefined;
      cwd: string;
      wait?: number;
      grow?: number;
      abortOnError?: boolean;
      nodeOptions?: string[];
      execPath?: string;
      dependsOn?: string[];
      allowServiceLogon?: boolean;
   }

   export interface LogOnAs {
      domain: string;
      account: string;
      password: string;
   }

   export interface Sudo {
      password: string;
   }

   export class Service {
      public logOnAs: LogOnAs;
      public sudo: Sudo;
      constructor(options: ServiceOptions);
      on(event: EventType, callback: () => void): void;
      start(): void;
      install(): void;
      uninstall(): void;
      exists(): boolean;
   }
}