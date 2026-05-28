import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { ReportsService } from './reports.service'
import { isDemoMode } from '../../lib/demoReports'

@Controller('reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name)

  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  list(@Headers() headers: Record<string, string>, @Query('ticker') ticker?: string) {
    try {
      return this.reportsService.list(headers, ticker?.toUpperCase())
    } catch (error) {
      this.logger.error('list reports failed', error instanceof Error ? error.stack : error)
      throw new HttpException('Could not load reports', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post()
  generate(@Headers() headers: Record<string, string>, @Body() body: { ticker: string; template: string }) {
    try {
      if (!body?.ticker) throw new HttpException('Ticker required', HttpStatus.BAD_REQUEST)
      return this.reportsService.generate(headers, body.ticker.toUpperCase(), body.template || 'pre-earnings')
    } catch (error) {
      if (error instanceof HttpException) throw error
      this.logger.error('generate report failed', error instanceof Error ? error.stack : error)
      throw new HttpException('Report generation failed', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get(':id/export')
  export(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Query('format') format: string,
    @Query('ticker') ticker: string | undefined,
    @Res() res: Response,
  ) {
    try {
      const fmt = format === 'csv' ? 'csv' : 'pdf'
      const report = this.reportsService.resolveReport(headers, id, ticker?.toUpperCase() || 'NVDA')

      const content = this.reportsService.exportContent(report, fmt)
      const ext = fmt === 'csv' ? 'csv' : 'pdf'
      const filename = `${report.ticker}_${report.template}_${report.id}.${ext}`

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      res.setHeader('Content-Type', fmt === 'csv' ? 'text/csv; charset=utf-8' : 'application/pdf')
      res.setHeader('Cache-Control', 'no-store')

      if (Buffer.isBuffer(content)) {
        res.setHeader('Content-Length', content.length)
        res.send(content)
      } else {
        res.send(content)
      }
    } catch (error) {
      this.logger.error(`export ${id} failed`, error instanceof Error ? error.stack : error)
      if (isDemoMode()) {
        const fallback = this.reportsService.resolveReport(headers, 'rpt_pre_earnings', ticker?.toUpperCase() || 'NVDA')
        const pdf = this.reportsService.exportContent(fallback, 'pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="marketpulse_demo_report.pdf"')
        res.setHeader('Content-Type', 'application/pdf')
        return res.send(pdf)
      }
      throw new HttpException('Export failed', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
