import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import {
  formatSixDigitDate,
  joinUrl,
  requestAndParseEucKr,
} from '@libs/common';
import {
  EconomicInformation,
  EconomicInformationRepository,
  N_PAY_RESEARCH_URL,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { format } from 'date-fns';

/**
 * 매크로 환경
 * - 시황
 * - 투자정보
 * - 경제분석
 * - 채권분석
 */
@Injectable()
export class NaverEconomicInformationCrawler {
  private readonly DETAIL_URLS = [
    'market_info_list.naver',
    'invest_list.naver',
    'economy_list.naver',
    'debenture_list.naver',
  ];

  constructor(
    @InjectQueue(QUEUE_NAME.ECONOMIC_INFORMATION)
    private readonly queue: Queue,
    private readonly repo: EconomicInformationRepository,
  ) {}

  async exec() {
    // make entity to store data
    const date = format(new Date(), 'yyyy-MM-dd');
    let entity = await this.repo.findOneByDate(date);
    if (!entity) {
      entity = await this.repo.createOne(EconomicInformation.create({ date }));
    }

    // crawl data and add to queue
    for (const detailUrl of this.DETAIL_URLS) {
      const url = joinUrl(N_PAY_RESEARCH_URL, detailUrl);

      const html = await requestAndParseEucKr(url);
      const rows = html
        .querySelectorAll(
          '#contentarea_left > div.box_type_m > table.type_1 tr',
        )
        .filter((row) => row.querySelector('td.file'));

      const urls: string[] = [];
      for (const row of rows) {
        const cells = row.querySelectorAll('td:not(.file)');
        const dateInfo = row.querySelector('td.date');
        const currentDate = formatSixDigitDate(dateInfo.textContent);
        if (currentDate !== date) {
          continue;
        }

        const titleAnchor = cells.shift().querySelector('a');
        const detailUrl = titleAnchor.getAttribute('href');
        urls.push(detailUrl);
      }
      await this.queue.addBulk(
        urls.map((url) => ({
          data: { url, documentId: entity._id },
          opts: { removeOnComplete: true, removeOnFail: true },
        })),
      );
    }
  }
}