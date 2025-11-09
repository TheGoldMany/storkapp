import cron from 'node-cron';
import { statusService } from './status.service';

class SchedulerService {
  /**
   * Start all scheduled jobs
   */
  start() {
    // Run auto-deletion every day at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('Running scheduled auto-deletion job...');
      try {
        const deleted = await statusService.deleteExpiredRecords();
        console.log(
          `Auto-deletion completed: ${deleted.animals} animals, ${deleted.lostPets} lost pets, ${deleted.foundPets} found pets`
        );
      } catch (error) {
        console.error('Auto-deletion job failed:', error);
      }
    });

    console.log('Scheduler service started - auto-deletion job will run daily at 2 AM');
  }
}

export const schedulerService = new SchedulerService();
