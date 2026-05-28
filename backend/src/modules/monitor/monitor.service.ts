import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { AnalyzeService } from '../analyze/analyze.service'

const WATCHED = ['NVDA', 'TSLA', 'META', 'PLTR', 'AMD']

@Injectable()
export class MonitorService {
  private readonly logger = new Logger(MonitorService.name)
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  refreshCache() {
    if (process.env.DEMO_MODE !== 'false') return
    this.logger.log('Refreshing cache for watched tickers...')
    for (const t of WATCHED) {
      this.analyzeService.refresh(t)
    }
    this.logger.log(`Cache refresh complete: ${WATCHED.join(', ')}`)
  }
}
