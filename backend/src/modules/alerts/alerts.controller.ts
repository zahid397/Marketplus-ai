import { Controller, Get, Post, Delete, Body, Param, Headers, HttpException, HttpStatus } from '@nestjs/common'
import { AlertsService } from './alerts.service'

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  list(@Headers() headers: Record<string, string>) {
    return this.alertsService.list(headers)
  }

  @Post()
  create(@Headers() headers: Record<string, string>, @Body() body: { ticker: string; type: string; condition: string; value: string }) {
    if (!body.ticker || !body.value) throw new HttpException('Ticker and value required', HttpStatus.BAD_REQUEST)
    return this.alertsService.create(headers, body)
  }

  @Delete(':id')
  remove(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.alertsService.remove(headers, id)
  }
}
