import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { getUserId, loadUserData, saveUserData } from '../../lib/storage'

export interface WatchlistEntry {
  ticker: string
  name: string
  pinned: boolean
  addedAt: string
}

@Injectable()
export class WatchlistService {
  private getItems(userId: string): WatchlistEntry[] {
    return loadUserData<WatchlistEntry[]>(userId, 'watchlist', [])
  }

  list(headers: Record<string, string>) {
    const userId = getUserId(headers)
    return { items: this.getItems(userId) }
  }

  add(headers: Record<string, string>, ticker: string, name?: string, pinned = false) {
    const userId = getUserId(headers)
    const items = this.getItems(userId)
    if (items.some(i => i.ticker === ticker)) {
      throw new HttpException(`${ticker} already in watchlist`, HttpStatus.CONFLICT)
    }
    const entry: WatchlistEntry = { ticker, name: name || ticker, pinned, addedAt: new Date().toISOString() }
    items.push(entry)
    saveUserData(userId, 'watchlist', items)
    return { ok: true, item: entry }
  }

  remove(headers: Record<string, string>, ticker: string) {
    const userId = getUserId(headers)
    const items = this.getItems(userId).filter(i => i.ticker !== ticker)
    saveUserData(userId, 'watchlist', items)
    return { ok: true }
  }

  update(headers: Record<string, string>, ticker: string, body: { pinned?: boolean }) {
    const userId = getUserId(headers)
    const items = this.getItems(userId)
    const item = items.find(i => i.ticker === ticker)
    if (!item) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    if (body.pinned !== undefined) item.pinned = body.pinned
    saveUserData(userId, 'watchlist', items)
    return { ok: true, item }
  }
}
