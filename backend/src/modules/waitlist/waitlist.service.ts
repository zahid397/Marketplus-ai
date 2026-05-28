import { Injectable } from '@nestjs/common'
import { loadGlobal, saveGlobal } from '../../lib/storage'

interface WaitlistEntry {
  email: string
  name: string | null
  joinedAt: string
}

@Injectable()
export class WaitlistService {
  join(email: string, name?: string) {
    const list = loadGlobal<WaitlistEntry[]>('waitlist', [])
    if (list.some((item) => item.email === email)) {
      return { ok: true, message: 'Email is already on the waitlist' }
    }
    list.push({ email, name: name || null, joinedAt: new Date().toISOString() })
    saveGlobal('waitlist', list)
    return { ok: true, message: 'Early access request received' }
  }
}
