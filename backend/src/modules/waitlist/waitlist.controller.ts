import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common'
import { WaitlistService } from './waitlist.service'

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  join(@Body() body: { email: string; name?: string }) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email || '')) {
      throw new HttpException('Valid email required', HttpStatus.BAD_REQUEST)
    }
    return this.waitlistService.join(body.email.trim().toLowerCase(), body.name)
  }
}
