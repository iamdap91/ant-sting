import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  EconomicInformationAnalysisDomainModule,
  EconomicInformationDomainModule,
} from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { EconomicInformationCommand } from './commands';
import {
  EconomicInformationCrawler,
  AnalyzeEconomicInformationTask,
} from './tasks';

@Module({
  imports: [
    AiModule,
    EconomicInformationDomainModule,
    EconomicInformationAnalysisDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ECONOMIC_INFORMATION,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [
    EconomicInformationCommand,
    EconomicInformationCrawler,
    AnalyzeEconomicInformationTask,
  ],
})
export class EconomicInformationBatchModule {}
