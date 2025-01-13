import { Module } from '@nestjs/common';
import {
  BondYieldDomainModule,
  EconomicInformationDomainModule,
  ExchangeRateDomainModule,
  FinancialStatementDomainModule,
  InterestRateDomainModule,
  StockIndexDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { TestCommand } from './commands';
import { TestTask } from './tasks';
import { ExternalApiModule } from '@libs/external-api';

@Module({
  imports: [
    AiModule,
    FinancialStatementDomainModule,
    EconomicInformationDomainModule,
    StockReportDomainModule,
    BondYieldDomainModule,
    ExchangeRateDomainModule,
    InterestRateDomainModule,
    StockIndexDomainModule,
    ExternalApiModule,
    BullModule.registerQueueAsync(
      {
        name: QUEUE_NAME.ECONOMIC_INFORMATION,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getCommonConfig() };
        },
      },
      {
        name: QUEUE_NAME.ANALYZE_STOCK,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getCommonConfig() };
        },
      },
    ),
  ],
  providers: [TestCommand, TestTask],
})
export class TestBatchModule {}
