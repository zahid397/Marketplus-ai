import { Module } from '@nestjs/common'
import { ReportsController } from './reports.controller'
import { ReportsService } from './reports.service'
import { AnalyzeModule } from '../analyze/analyze.module'

@Module({ imports: [AnalyzeModule], controllers: [ReportsController], providers: [ReportsService] })
export class ReportsModule {}
