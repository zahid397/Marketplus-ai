import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common'
import { CompareService } from './compare.service'

@Controller('compare')
export class CompareController {
  constructor(private readonly compareService: CompareService) {}

  @Post()
  compare(@Body() body: { tickers: string[]; base?: string }) {
    if (!body.tickers?.length) throw new HttpException('At least one ticker required', HttpStatus.BAD_REQUEST)
    return this.compareService.compare(body.base?.toUpperCase(), body.tickers.map(t => t.toUpperCase()))
  }
}
