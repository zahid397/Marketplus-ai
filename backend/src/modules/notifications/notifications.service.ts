import { Injectable } from '@nestjs/common'
import { getUserId, loadUserData, saveUserData } from '../../lib/storage'

export interface Notification {
  id: string
  type: 'alert' | 'signal' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'signal', title: 'New Signal', message: 'NVDA institutional buy detected — confidence 87%', read: false, createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'n2', type: 'alert', title: 'Price Alert', message: 'TSLA crossed above $250 threshold', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', type: 'system', title: 'Report Ready', message: 'Your NVDA Pre-Earnings report is ready to download', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
]

@Injectable()
export class NotificationsService {
  private getItems(userId: string): Notification[] {
    const stored = loadUserData<Notification[]>(userId, 'notifications', [])
    if (stored.length === 0) {
      saveUserData(userId, 'notifications', DEFAULT_NOTIFICATIONS)
      return DEFAULT_NOTIFICATIONS
    }
    return stored
  }

  list(headers: Record<string, string>) {
    const items = this.getItems(getUserId(headers))
    return { notifications: items, unreadCount: items.filter(n => !n.read).length }
  }

  markAllRead(headers: Record<string, string>) {
    const userId = getUserId(headers)
    const items = this.getItems(userId).map(n => ({ ...n, read: true }))
    saveUserData(userId, 'notifications', items)
    return { ok: true, unreadCount: 0 }
  }
}
