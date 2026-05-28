'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Settings, User, LogOut, Crown, CheckCheck, Loader2 } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { useClickOutside } from '@/hooks/useClickOutside'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', type: 'signal', title: 'New Signal', message: 'NVDA institutional buy detected — confidence 87%', read: false, createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'n2', type: 'alert', title: 'Price Alert', message: 'TSLA crossed above $250 threshold', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', type: 'system', title: 'Report Ready', message: 'Your NVDA Pre-Earnings report is ready to download', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
]

interface Props {
  onOpenPricing?: () => void
  className?: string
}

export default function HeaderActions({ onOpenPricing, className }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const { user, signout } = useAuth()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadingNotifs, setLoadingNotifs] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const closeAll = useCallback(() => {
    setProfileOpen(false)
    setNotifOpen(false)
  }, [])

  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen)
  useClickOutside(notifRef, () => setNotifOpen(false), notifOpen)

  const loadNotifications = useCallback(async () => {
    setLoadingNotifs(true)
    try {
      const res = await api.listNotifications()
      const items = (res.notifications?.length ? res.notifications : FALLBACK_NOTIFICATIONS) as NotificationItem[]
      setNotifications(items)
      setUnreadCount(res.unreadCount ?? items.filter((n) => !n.read).length)
    } catch {
      setNotifications(FALLBACK_NOTIFICATIONS)
      setUnreadCount(FALLBACK_NOTIFICATIONS.filter((n) => !n.read).length)
    } finally {
      setLoadingNotifs(false)
    }
  }, [])

  useEffect(() => {
    if (notifOpen) void loadNotifications()
  }, [notifOpen, loadNotifications])

  const markAllRead = async () => {
    try {
      await api.readAllNotifications()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
      toast('All notifications marked as read', 'success')
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
      toast('Notifications marked read (demo)', 'info')
    }
  }

  const displayName = user?.name || 'Demo User'
  const displayEmail = user?.email || 'demo@marketpulse.ai'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className={cn('flex items-center gap-1 flex-shrink-0', className)}>
      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => {
            setNotifOpen((p) => !p)
            setProfileOpen(false)
          }}
          className="relative p-2 text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-2rem))] bg-[#0A1628] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/8">
              <span className="text-sm font-semibold">Notifications</span>
              <button
                type="button"
                onClick={markAllRead}
                className="text-[10px] text-indigo hover:text-white flex items-center gap-1"
              >
                <CheckCheck size={12} /> Mark all read
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {loadingNotifs ? (
                <div className="flex items-center justify-center gap-2 py-8 text-secondary text-sm">
                  <Loader2 size={14} className="animate-spin" /> Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-secondary">No notifications yet</div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => toast(n.message, 'info')}
                    className={cn(
                      'w-full text-left px-3 py-2.5 border-b border-white/5 hover:bg-white/5 transition-colors',
                      !n.read && 'bg-indigo/5',
                    )}
                  >
                    <div className="text-xs font-semibold text-white">{n.title}</div>
                    <div className="text-[11px] text-secondary line-clamp-2 mt-0.5">{n.message}</div>
                  </button>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                closeAll()
                toast('Notification center — demo mode', 'info')
              }}
              className="w-full text-xs text-secondary hover:text-white py-2 border-t border-white/8"
            >
              View all notifications
            </button>
          </div>
        )}
      </div>

      {/* Settings */}
      <button
        type="button"
        aria-label="Settings"
        onClick={() => {
          closeAll()
          toast('Opening settings', 'info')
          router.push('/settings')
        }}
        className="p-2 text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
      >
        <Settings size={16} />
      </button>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          type="button"
          aria-label="User profile"
          onClick={() => {
            setProfileOpen((p) => !p)
            setNotifOpen(false)
          }}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo to-purple flex items-center justify-center text-xs font-bold text-white flex-shrink-0 hover:ring-2 hover:ring-indigo/50 transition-all"
        >
          {initial}
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-[#0A1628] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-3 py-3 border-b border-white/8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo to-purple flex items-center justify-center text-sm font-bold">
                  {initial}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{displayName}</div>
                  <div className="text-[11px] text-secondary truncate">{displayEmail}</div>
                </div>
              </div>
              <span className="inline-block mt-2 text-[10px] uppercase tracking-wide text-indigo bg-indigo/10 border border-indigo/20 rounded-full px-2 py-0.5">
                {user?.role || 'admin'} · demo
              </span>
            </div>
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  closeAll()
                  toast('Profile settings — demo mode', 'info')
                  router.push('/settings')
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-white hover:bg-white/5"
              >
                <User size={14} /> Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  closeAll()
                  if (onOpenPricing) onOpenPricing()
                  else toast('Pro features coming soon in demo mode', 'info')
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-white hover:bg-white/5"
              >
                <Crown size={14} /> Upgrade to Pro
              </button>
              <button
                type="button"
                onClick={() => {
                  closeAll()
                  signout()
                  toast('Signed out', 'info')
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red hover:bg-red/10"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
