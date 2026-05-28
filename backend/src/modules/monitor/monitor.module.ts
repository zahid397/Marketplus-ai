import { Module } from '@nestjs/common'
import { MonitorService } from './monitor.service'
import { AnalyzeModule } from '../analyze/analyze.module'

@Module({
  imports: [AnalyzeModule],
  providers: [MonitorService],
})
export class MonitorModule {}
