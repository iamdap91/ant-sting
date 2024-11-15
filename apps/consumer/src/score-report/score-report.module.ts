import { Module } from '@nestjs/common';
import {
  MacroEnvironmentDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { StockReportConsumer } from './service';

@Module({
  imports: [
    MacroEnvironmentDomainModule,
    StockReportDomainModule,
    AiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.STOCK_REPORT_SCORE,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [StockReportConsumer],
})
export class ScoreReportModule {}
