import { Injectable } from '@nestjs/common'
import { getUserId, loadUserData, saveUserData } from '../../lib/storage'

export interface UserSettings {
  name: string
  email: string
  model: string
  notifications: { signals: boolean; news: boolean; hiring: boolean; earnings: boolean }
}

const DEFAULTS: UserSettings = {
  name: 'Analyst',
  email: '',
  model: 'claude',
  notifications: { signals: true, news: true, hiring: false, earnings: true },
}

@Injectable()
export class SettingsService {
  get(headers: Record<string, string>) {
    const userId = getUserId(headers)
    const settings = loadUserData<UserSettings>(userId, 'settings', { ...DEFAULTS, email: userId.includes('@') ? userId : '' })
    return { settings }
  }

  update(headers: Record<string, string>, body: Record<string, unknown>) {
    const userId = getUserId(headers)
    const current = loadUserData<UserSettings>(userId, 'settings', { ...DEFAULTS })
    const settings = { ...current, ...body } as UserSettings
    saveUserData(userId, 'settings', settings)
    return { ok: true, settings }
  }

  testProvider(provider: string) {
    const map: Record<string, string> = {
      'Anthropic Claude': 'ANTHROPIC_API_KEY',
      'Google Gemini': 'GEMINI_API_KEY',
      'OpenAI GPT-4': 'OPENAI_API_KEY',
      'Bright Data': 'BRIGHT_DATA_API_TOKEN',
    }
    const envKey = map[provider] || provider
    const configured = !!process.env[envKey]
    return {
      provider,
      configured,
      status: configured ? 'connected' : process.env.DEMO_MODE === 'true' ? 'demo_mode' : 'not_configured',
      message: configured ? `${provider} API key is configured` : process.env.DEMO_MODE === 'true' ? 'Running in demo mode — provider not required' : `${provider} API key not set in .env`,
    }
  }
}
