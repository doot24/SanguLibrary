import cron, { ScheduledTask } from 'node-cron';
import { Application } from 'express';

let scheduledTasks: ScheduledTask[] = [];

//used to schedule in next hour
export const scheduleTask = async <T extends (...args: any[]) => Promise<any>>(
  minute: number,
  method: T
): Promise<void> => {
  const minuteExpression = minute === -1 ? '*' : String(minute);
  const task = cron.schedule(`${minuteExpression} * * * *`, async () => {
    await method();
  });
  scheduledTasks.push(task);
};

//used to schedule in same hour
export const scheduleTaskEveryMinute = async <T extends (...args: any[]) => Promise<any>>(
    minutes: number,
    method: T
  ): Promise<void> => {
    const minuteExpression = minutes === -1 ? '*' : String(minutes);
    const task = cron.schedule(`*/${minuteExpression} * * * *`, async () => {
      await method();
    });
    scheduledTasks.push(task);
  };
  

export const InitializeScheduler = async (app: Application): Promise<void> => {
  // Start executing the scheduled tasks
  scheduledTasks.forEach(task => task.start());
};
