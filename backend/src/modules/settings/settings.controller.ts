import { Controller, Get, Put, Post, Body, Headers } from '@nestjs/common'
import { SettingsService } from './settings.service'

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get(@Headers() headers: Record<string, string>) {
    return this.settingsService.get(headers)
  }

  @Put()
  update(@Headers() headers: Record<string, string>, @Body() body: Record<string, unknown>) {
    return this.settingsService.update(headers, body)
  }

  @Post('test-provider')
  testProvider(@Body() body: { provider: string }) {
    return this.settingsService.testProvider(body.provider)
  }
}
