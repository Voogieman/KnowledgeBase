import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AnalyticsClientService implements OnModuleInit {
  constructor(@Inject('ANALYTICS_SERVICE') private readonly client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('[AnalyticsClient] Connected to RabbitMQ');
    } catch (e) {
      console.error('[AnalyticsClient] Connection Error:', e);
    }
  }


  async emitEvent(pattern: string, data: any) {
    try {
      await this.client.emit(pattern, data).toPromise();
    } catch (error) {
      console.error('[Analytics Emit Error]', error);
    }
  }
}
