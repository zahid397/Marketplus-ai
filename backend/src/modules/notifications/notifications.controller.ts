import { Controller, Get, Post, Headers, Body } from '@nestjs/common'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@Headers() headers: Record<string, string>) {
    return this.notificationsService.list(headers)
  }

  @Post('read-all')
  markAllRead(@Headers() headers: Record<string, string>) {
    return this.notificationsService.markAllRead(headers)
  }
}
