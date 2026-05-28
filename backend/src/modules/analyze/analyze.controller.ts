import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common'
import { AnalyzeService } from './analyze.service'

@Controller()
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      message: 'MarketPulse API running',
    }
  }

  @Get('analyze/:ticker')
  analyze(@Param('ticker') ticker: string) {
    if (!ticker || ticker.length > 10) {
      throw new HttpException('Invalid ticker', HttpStatus.BAD_REQUEST)
    }
    return this.analyzeService.analyze(ticker.toUpperCase())
  }
}
