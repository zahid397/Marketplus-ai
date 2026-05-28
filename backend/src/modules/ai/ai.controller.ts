import { Body, Controller, Post } from '@nestjs/common'
import { AiService } from './ai.service'

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  chat(@Body() body: { message?: string; ticker?: string }) {
    const message = body.message?.trim() || ''
    const ticker = body.ticker?.trim().toUpperCase() || 'NVDA'
    return this.aiService.chat(message, ticker)
  }
}
