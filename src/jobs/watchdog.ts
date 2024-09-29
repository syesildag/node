import { Range, RecurrenceRule } from "node-schedule";
import JobFactory from "../utils/jobFactory";

export default class Watchdog extends JobFactory {

   constructor() {
      super();
      this.setEnable(false);
   }

   protected getSpec() {
      const rule = new RecurrenceRule();
      rule.second = new Range(0, 60, 10);
      return rule;
   }

   protected getJobCallback() {
      return (fireDate: Date) => {
         console.log("watchDog: " + fireDate);
      }
   }
}