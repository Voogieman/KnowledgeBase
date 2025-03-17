import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AnalyticsClientService } from './analytics-client.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANALYTICS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [String(process.env.RABBITMQ_URL)],
          queue: String(process.env.RABBITMQ_QUEUE),
          queueOptions: {
            durable: false, // в проде true
          },
        },
      },
    ]),
  ],
  providers: [AnalyticsClientService],
  exports: [AnalyticsClientService],
})
export class AnalyticsClientModule {}
