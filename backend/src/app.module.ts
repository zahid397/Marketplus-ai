import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AnalyzeModule } from './modules/analyze/analyze.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { WaitlistModule } from './modules/waitlist/waitlist.module'
import { WatchlistModule } from './modules/watchlist/watchlist.module'
import { SettingsModule } from './modules/settings/settings.module'
import { AlertsModule } from './modules/alerts/alerts.module'
import { ReportsModule } from './modules/reports/reports.module'
import { CompareModule } from './modules/compare/compare.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { AuthModule } from './modules/auth/auth.module'
import { AiModule } from './modules/ai/ai.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    AiModule,
    AnalyzeModule,
    MonitorModule,
    WaitlistModule,
    WatchlistModule,
    SettingsModule,
    AlertsModule,
    ReportsModule,
    CompareModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
