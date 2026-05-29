import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './filters/http-exception.filter'

function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== 'false'
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] })

  // 🔥 FIX: Changed origin to true so it allows ANY live frontend URL to connect!
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,x-user-id,x-user-email,Accept',
    credentials: true,
  })

  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  
  // This is why we needed the /api in the URL earlier!
  app.setGlobalPrefix('api')

  const port = Number(process.env.PORT) || 3001
  await app.listen(port)

  const base = `http://localhost:${port}/api`
  console.log('')
  console.log('  MarketPulse AI Backend')
  console.log(`  URL:      ${base}`)
  console.log(`  Health:   ${base}/health`)
  console.log(`  Auth:     ${base}/auth/me`)
  console.log(`  Reports:  ${base}/reports`)
  console.log(`  Export:   ${base}/reports/rpt_pre_earnings/export?format=pdf`)
  console.log(`  Analyze:  ${base}/analyze/NVDA`)
  console.log(`  Demo mode: ${isDemoMode() ? 'ON' : 'OFF'}`)
  console.log('')
}

bootstrap().catch((err) => {
  console.error('Backend failed to start:', err)
  process.exit(1)
})
