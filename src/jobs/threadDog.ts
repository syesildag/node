import { Range, RecurrenceRule } from "node-schedule";
import ThreadJobFactory from "../utils/threadJobFactory";
import AbstractBaseWorker from "../worker/abstractBaseWorker";
import jobWorker from "../worker/custom/jobWorker";

export default class Threaddog extends ThreadJobFactory {

   constructor() {
      super();
      this.setEnable(false);
   }

   protected getSpec() {
      const rule = new RecurrenceRule();
      rule.minute = new Range(0, 60, 1);
      return rule;
   }

   protected getWorker(): AbstractBaseWorker<Date, void> {
      return jobWorker;
   }
}