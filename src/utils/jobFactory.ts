import { Job, JobCallback, Spec, scheduleJob } from "node-schedule";

export default abstract class JobFactory {
   protected abstract getSpec(): Spec;
   protected abstract getJobCallback(): JobCallback;
   public create(): Job {
      return scheduleJob(this.getSpec(), this.getJobCallback());
   }
}