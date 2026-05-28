import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  root() {
    return { message: 'MarketPulse AI API is running' }
  }
}
