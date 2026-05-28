import { Controller, Get, Post, Delete, Patch, Body, Param, Headers, HttpException, HttpStatus } from '@nestjs/common'
import { WatchlistService } from './watchlist.service'

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  list(@Headers() headers: Record<string, string>) {
    return this.watchlistService.list(headers)
  }

  @Post()
  add(@Headers() headers: Record<string, string>, @Body() body: { ticker: string; name?: string; pinned?: boolean }) {
    if (!body.ticker?.trim()) throw new HttpException('Ticker required', HttpStatus.BAD_REQUEST)
    return this.watchlistService.add(headers, body.ticker.toUpperCase(), body.name, body.pinned)
  }

  @Delete(':ticker')
  remove(@Headers() headers: Record<string, string>, @Param('ticker') ticker: string) {
    return this.watchlistService.remove(headers, ticker.toUpperCase())
  }

  @Patch(':ticker')
  update(@Headers() headers: Record<string, string>, @Param('ticker') ticker: string, @Body() body: { pinned?: boolean }) {
    return this.watchlistService.update(headers, ticker.toUpperCase(), body)
  }
}
