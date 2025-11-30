import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'admin'
  has2FA: boolean
  subscription?: any
  status: string
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  theme: 'light' | 'dark'
  language: 'en' | 'ur'
  stats: {
    adsToday: number
    earningsToday: number
    monthlyEarnings: number
    streak: number
    dailyLimit: number
  }
  setUser: (user: User | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'en' | 'ur') => void
  updateStats: (stats: Partial<AppState['stats']>) => void
  logout: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      theme: 'light',
      language: 'en',
      stats: {
        adsToday: 0,
        earningsToday: 0,
        monthlyEarnings: 0,
        streak: 0,
        dailyLimit: 0
      },
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      setTheme: (theme) => {
        set({ theme })
        document.documentElement.classList.toggle('dark', theme === 'dark')
      },
      setLanguage: (language) => set({ language }),
      updateStats: (newStats) => set((state) => ({
        stats: { ...state.stats, ...newStats }
      })),
      logout: () => {
        // Clear cookies on logout
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        
        set({ 
          user: null, 
          isAuthenticated: false,
          stats: {
            adsToday: 0,
            earningsToday: 0,
            monthlyEarnings: 0,
            streak: 0,
            dailyLimit: 0
          }
        })
      }
    }),
    {
      name: 'adearn-storage',
      partialize: (state) => ({ 
        user: state.user,
        theme: state.theme,
        language: state.language
      })
    }
  )
)

// Initialize theme
const savedTheme = localStorage.getItem('adearn-storage')
if (savedTheme) {
  const parsed = JSON.parse(savedTheme)
  if (parsed.state?.theme === 'dark') {
    document.documentElement.classList.add('dark')
  }
}