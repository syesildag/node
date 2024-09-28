import { Range, RecurrenceRule } from "node-schedule";
import JobFactory from "../utils/jobFactory";

export default class Hello extends JobFactory {

   protected getSpec() {
      const rule = new RecurrenceRule();
      rule.second = new Range(0, 60, 10);
      return rule;
   }

   protected getJobCallback() {
      return () => {
         console.log("watchDog");
      }
   }
}