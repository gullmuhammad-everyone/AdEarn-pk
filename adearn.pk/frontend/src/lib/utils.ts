import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/^92/, '0')
}

export const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export const calculateProgress = (current: number, total: number): number => {
  return total > 0 ? Math.min((current / total) * 100, 100) : 0
}

export const generateConfetti = () => {
  import('canvas-confetti').then((confetti) => {
    confetti.default({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#16a34a', '#15803d', '#166534']
    })
  })
}

export const translations = {
  en: {
    welcome: "Welcome to AdEarn.pk",
    tagline: "Watch Ads, Earn Money - Halal & Legal",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    name: "Full Name",
    phone: "Phone Number",
    submit: "Submit",
    dashboard: "Dashboard",
    earnings: "Earnings",
    ads: "Ads",
    referrals: "Referrals",
    withdraw: "Withdraw",
    today: "Today",
    monthly: "Monthly",
    streak: "Streak",
    watchAd: "Watch Ad",
    earn: "Earn",
    completed: "Completed",
    remaining: "Remaining"
  },
  ur: {
    welcome: "AdEarn.pk میں خوش آمدید",
    tagline: "ایڈز دیکھیں، پیسے کمائیں - حلال اور قانونی",
    login: "لاگ ان",
    register: "رجسٹر کریں",
    email: "ای میل",
    password: "پاس ورڈ",
    name: "پورا نام",
    phone: "فون نمبر",
    submit: "جمع کرائیں",
    dashboard: "ڈیش بورڈ",
    earnings: "آمدنی",
    ads: "ایڈز",
    referrals: "ریفّرلز",
    withdraw: "نکالیں",
    today: "آج",
    monthly: "ماہانہ",
    streak: "سلسلہ",
    watchAd: "ایڈ دیکھیں",
    earn: "کمائیں",
    completed: "مکمل",
    remaining: "باقی"
  }
}