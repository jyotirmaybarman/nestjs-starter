import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueJobs } from '../queue.jobs';
import { QUEUES } from './queue.constants';
import { WinstonLogger } from 'src/utils/winston-logger/winston-logger';

@Processor(QUEUES.DEFAULT_QUEUE)
export class QueueProcessor {
  private logger = new WinstonLogger(QueueProcessor.name);
  constructor(private readonly queueJobs: QueueJobs) {}

  @Process()
  async process(job: Job) {
    try {
      this.logger.log('Processing job: # ' + job.data.task);
      await this.queueJobs[job.data.task](job.data.payload);
      this.logger.log('Processed job: # ' + job.data.task);
      return true;
    } catch (error) {
      this.logger.error(error);
      this.logger.error('Failed to process job: # ' + job.data.task);
      return false;
    }
  }
}
