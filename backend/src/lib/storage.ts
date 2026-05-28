import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function userFile(userId: string, key: string) {
  const safe = userId.replace(/[^a-zA-Z0-9_-]/g, '_')
  return path.join(DATA_DIR, `${safe}_${key}.json`)
}

export function getUserId(headers: Record<string, string | string[] | undefined>): string {
  const raw = headers['x-user-id'] || headers['x-user-email']
  const val = Array.isArray(raw) ? raw[0] : raw
  return val?.trim() || 'anonymous'
}

export function loadUserData<T>(userId: string, key: string, defaultVal: T): T {
  ensureDir()
  const file = userFile(userId, key)
  if (!fs.existsSync(file)) return defaultVal
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
  } catch {
    return defaultVal
  }
}

export function saveUserData<T>(userId: string, key: string, data: T): void {
  ensureDir()
  fs.writeFileSync(userFile(userId, key), JSON.stringify(data, null, 2), 'utf-8')
}

export function appendGlobal<T>(key: string, item: T): void {
  ensureDir()
  const file = path.join(DATA_DIR, `${key}.json`)
  const list: T[] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : []
  list.push(item)
  fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf-8')
}

export function loadGlobal<T>(key: string, defaultVal: T): T {
  ensureDir()
  const file = path.join(DATA_DIR, `${key}.json`)
  if (!fs.existsSync(file)) return defaultVal
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
  } catch {
    return defaultVal
  }
}

export function saveGlobal<T>(key: string, value: T): void {
  ensureDir()
  const file = path.join(DATA_DIR, `${key}.json`)
  fs.writeFileSync(file, JSON.stringify(value, null, 2), 'utf-8')
}
