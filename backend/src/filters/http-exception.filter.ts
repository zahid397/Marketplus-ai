import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP')

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<{ url?: string; method?: string }>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Something went wrong. Please try again.'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const body = exception.getResponse()
      if (typeof body === 'string') {
        message = body
      } else if (body && typeof body === 'object' && 'message' in body) {
        const raw = (body as { message?: string | string[] }).message
        message = Array.isArray(raw) ? raw.join(', ') : raw || message
      }
    } else if (exception instanceof Error) {
      this.logger.error(`${request.method} ${request.url}: ${exception.message}`, exception.stack)
      message = process.env.DEMO_MODE !== 'false' ? exception.message : message
    }

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} → ${status}: ${message}`)
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    })
  }
}
