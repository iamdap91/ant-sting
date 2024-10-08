import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  DebentureReportRepository,
  DebentureReport as DebentureEntity,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import {
  formatSixDigitDate,
  joinUrl,
  requestAndParseEucKr,
} from '@libs/common';
import { N_PAY_RESEARCH_URL } from '../constants';
import { DebentureReport } from '../interface';
import { figureNid } from '../utils';

@Injectable()
export class DebentureReportCrawlerTask {
  private readonly URL = joinUrl(N_PAY_RESEARCH_URL, 'debenture_list.naver');

  constructor(
    private readonly debentureReportRepository: DebentureReportRepository,
    @InjectQueue(QUEUE_NAME.DEBENTURE_REPORT_SCORE)
    private readonly queue: Queue,
  ) {}

  async exec() {
    const html = await requestAndParseEucKr(this.URL);

    const rows = html
      .querySelectorAll('#contentarea_left > div.box_type_m > table.type_1 tr')
      .filter((row) => row.querySelector('td.file'));

    const debentureReports: DebentureReport[] = [];
    for (const row of rows) {
      const cells = row.querySelectorAll('td:not(.file)');
      const titleAnchor = cells.shift().querySelector('a');
      const [stockFirm, date, views] = cells.map((cell) =>
        cell.innerText.trim(),
      );
      const anchor = row.querySelector('td.file > a');
      const detailUrl = titleAnchor.getAttribute('href');

      debentureReports.push({
        title: titleAnchor.innerHTML.trim(),
        nid: figureNid(detailUrl),
        detailUrl,
        stockFirm,
        date: formatSixDigitDate(date),
        views,
        file: anchor.getAttribute('href'),
      });
    }

    for (const report of debentureReports) {
      let debentureReport = await this.debentureReportRepository.findOneByNid(
        report.nid,
      );
      if (debentureReport) {
        await this.debentureReportRepository.save({
          ...debentureReport,
          ...report,
        });
      } else {
        const entity = DebentureEntity.create(report);
        debentureReport = await this.debentureReportRepository.save(entity);
      }

      const _id = debentureReport._id.toString();
      await this.queue.addBulk(
        new Array(5).fill({
          data: { _id },
          opts: { removeOnComplete: true, removeOnFail: true },
        }),
      );
    }
  }
}
