import { Body, Controller, Get, Headers, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: { email: string; password: string; name?: string }) {
    return this.authService.signup(body.email || '', body.password || '', body.name)
  }

  @Post('signin')
  signin(@Body() body: { email: string; password: string }) {
    return this.authService.signin(body.email || '', body.password || '')
  }

  @Post('magic-link')
  magicLink(@Body() body: { email: string }) {
    return this.authService.magicLink(body.email || '')
  }

  @Get('me')
  me(@Headers() headers: Record<string, string | string[] | undefined>) {
    return this.authService.me(headers)
  }
}
