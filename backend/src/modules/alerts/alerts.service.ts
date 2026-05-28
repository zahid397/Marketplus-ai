import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { getUserId, loadUserData, saveUserData } from '../../lib/storage'

export interface Alert {
  id: string
  ticker: string
  type: string
  condition: string
  value: string
  createdAt: string
  active: boolean
}

@Injectable()
export class AlertsService {
  private getAlerts(userId: string): Alert[] {
    return loadUserData<Alert[]>(userId, 'alerts', [])
  }

  list(headers: Record<string, string>) {
    return { alerts: this.getAlerts(getUserId(headers)) }
  }

  create(headers: Record<string, string>, body: { ticker: string; type: string; condition: string; value: string }) {
    const userId = getUserId(headers)
    const alerts = this.getAlerts(userId)
    const alert: Alert = {
      id: `alert_${Date.now()}`,
      ticker: body.ticker.toUpperCase(),
      type: body.type,
      condition: body.condition,
      value: body.value,
      createdAt: new Date().toISOString(),
      active: true,
    }
    alerts.push(alert)
    saveUserData(userId, 'alerts', alerts)
    return { ok: true, alert }
  }

  remove(headers: Record<string, string>, id: string) {
    const userId = getUserId(headers)
    const alerts = this.getAlerts(userId).filter(a => a.id !== id)
    saveUserData(userId, 'alerts', alerts)
    return { ok: true }
  }
}
