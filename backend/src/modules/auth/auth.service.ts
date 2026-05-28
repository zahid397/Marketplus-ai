import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { loadGlobal, saveGlobal } from '../../lib/storage'

interface StoredUser {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: string
}

interface Session {
  token: string
  userId: string
  expiresAt: string
}

export interface PublicUser {
  id: string
  email: string
  name: string
  role?: string
}

const DEMO_USER: PublicUser = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@marketpulse.ai',
  role: 'admin',
}

function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== 'false'
}

const USERS_KEY = 'users'
const SESSIONS_KEY = 'sessions'

@Injectable()
export class AuthService {
  private getUsers(): StoredUser[] {
    return loadGlobal<StoredUser[]>(USERS_KEY, [])
  }

  private saveUsers(users: StoredUser[]): void {
    saveGlobal(USERS_KEY, users)
  }

  private getSessions(): Session[] {
    return loadGlobal<Session[]>(SESSIONS_KEY, []).filter((s) => new Date(s.expiresAt).getTime() > Date.now())
  }

  private saveSessions(sessions: Session[]): void {
    saveGlobal(SESSIONS_KEY, sessions)
  }

  private cleanEmail(email: string): string {
    return email.trim().toLowerCase()
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex')
    const hash = scryptSync(password, salt, 64).toString('hex')
    return `${salt}:${hash}`
  }

  private verifyPassword(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(':')
    if (!salt || !hash) return false
    const incoming = scryptSync(password, salt, 64)
    const expected = Buffer.from(hash, 'hex')
    if (incoming.length !== expected.length) return false
    return timingSafeEqual(incoming, expected)
  }

  private toPublicUser(user: StoredUser): PublicUser {
    return { id: user.id, email: user.email, name: user.name }
  }

  private ensurePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new HttpException('Password must be at least 8 characters', HttpStatus.BAD_REQUEST)
    }
  }

  private issueSession(userId: string): string {
    const token = randomBytes(32).toString('hex')
    const sessions = this.getSessions()
    const ttlDays = Number(process.env.SESSION_TTL_DAYS || '30')
    const ttlMs = Number.isFinite(ttlDays) && ttlDays > 0 ? ttlDays * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000
    const expiresAt = new Date(Date.now() + ttlMs).toISOString()
    sessions.push({ token, userId, expiresAt })
    this.saveSessions(sessions)
    return token
  }

  private findUserFromHeaders(headers: Record<string, string | string[] | undefined>): StoredUser | null {
    const authHeader = headers.authorization || headers.Authorization
    const authValue = Array.isArray(authHeader) ? authHeader[0] : authHeader
    const token = authValue?.startsWith('Bearer ') ? authValue.slice(7).trim() : ''
    if (token) {
      const session = this.getSessions().find((s) => s.token === token)
      if (!session) {
        throw new HttpException('Invalid session token', HttpStatus.UNAUTHORIZED)
      }
      const user = this.getUsers().find((u) => u.id === session.userId)
      if (!user) {
        throw new HttpException('Session user not found', HttpStatus.UNAUTHORIZED)
      }
      return user
    }

    const headerEmail = headers['x-user-email'] || headers['x-user-id']
    const raw = Array.isArray(headerEmail) ? headerEmail[0] : headerEmail
    const email = raw?.trim().toLowerCase()
    if (!email) return null
    return this.getUsers().find((u) => u.email === email) || null
  }

  signup(email: string, password: string, name?: string) {
    const clean = this.cleanEmail(email)
    if (!this.isValidEmail(clean)) {
      throw new HttpException('Valid email is required', HttpStatus.BAD_REQUEST)
    }
    this.ensurePassword(password)

    const users = this.getUsers()
    if (users.some((u) => u.email === clean)) {
      throw new HttpException('Email already registered', HttpStatus.CONFLICT)
    }

    const user: StoredUser = {
      id: `usr_${Date.now()}_${randomBytes(4).toString('hex')}`,
      email: clean,
      name: (name || clean.split('@')[0] || 'Analyst').trim(),
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    this.saveUsers(users)
    const token = this.issueSession(user.id)
    return { token, user: this.toPublicUser(user) }
  }

  signin(email: string, password: string) {
    const clean = this.cleanEmail(email)
    const user = this.getUsers().find((u) => u.email === clean)
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)
    }
    if (!this.verifyPassword(password, user.passwordHash)) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)
    }
    const token = this.issueSession(user.id)
    return { token, user: this.toPublicUser(user) }
  }

  magicLink(email: string) {
    const clean = this.cleanEmail(email)
    if (!this.isValidEmail(clean)) {
      throw new HttpException('Valid email is required', HttpStatus.BAD_REQUEST)
    }

    const users = this.getUsers()
    let user = users.find((u) => u.email === clean)
    if (!user) {
      user = {
        id: `usr_${Date.now()}_${randomBytes(4).toString('hex')}`,
        email: clean,
        name: clean.split('@')[0] || 'Analyst',
        passwordHash: this.hashPassword(randomBytes(12).toString('hex')),
        createdAt: new Date().toISOString(),
      }
      users.push(user)
      this.saveUsers(users)
    }

    const token = this.issueSession(user.id)
    return {
      token,
      user: this.toPublicUser(user),
      message: 'Magic link session created',
    }
  }

  me(headers: Record<string, string | string[] | undefined>) {
    if (isDemoMode()) {
      try {
        const user = this.findUserFromHeaders(headers)
        if (user) return { user: { ...this.toPublicUser(user), role: 'admin' } }
      } catch {
        // invalid or missing session — return demo user in demo mode
      }
      return { user: DEMO_USER }
    }
    const user = this.findUserFromHeaders(headers)
    if (!user) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED)
    }
    return { user: this.toPublicUser(user) }
  }
}
