import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { userAPI } from '../../lib/api'
import { translations, getGreeting } from '../../lib/utils'
import StatsCards from '../../components/dashboard/StatsCards'
import EarningsChart from '../../components/dashboard/EarningsChart'
import StreakCounter from '../../components/dashboard/StreakCounter'
import DailyLimitBanner from '../../components/dashboard/DailyLimitBanner'
import { TrendingUp, Calendar, Target, Award } from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardData {
  stats: {
    adsToday: number
    earningsToday: number
    monthlyEarnings: number
    streak: number
    dailyLimit: number
  }
  subscription: any
  earningsHistory: any[]
}

const Dashboard: React.FC = () => {
  const { user, stats, updateStats, language } = useStore()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsResponse, earningsResponse] = await Promise.all([
        userAPI.getDashboardStats(),
        userAPI.getEarningsHistory(30)
      ])

      const data = {
        stats: statsResponse.data.stats,
        subscription: statsResponse.data.subscription,
        earningsHistory: earningsResponse.data.earnings
      }

      setDashboardData(data)
      updateStats(data.stats)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Loading dashboard...' : 'ڈیش بورڈ لوڈ ہو رہا ہے...'}
          </p>
        </div>
      </div>
    )
  }

  const greeting = getGreeting()
  const t = translations[language]

  const quickActions = [
    {
      icon: TrendingUp,
      title: language === 'en' ? 'Watch Ads' : 'ایڈز دیکھیں',
      description: language === 'en' 
        ? `Watch ${stats.dailyLimit - stats.adsToday} more ads today`
        : `آج ${stats.dailyLimit - stats.adsToday} مزید ایڈز دیکھیں`,
      action: '/dashboard/ads',
      color: 'from-green-500 to-green-600',
      disabled: stats.adsToday >= stats.dailyLimit
    },
    {
      icon: Target,
      title: language === 'en' ? 'Daily Target' : 'روزانہ ہدف',
      description: language === 'en'
        ? `${stats.adsToday}/${stats.dailyLimit} ads completed`
        : `${stats.adsToday}/${stats.dailyLimit} ایڈز مکمل`,
      action: '/dashboard/ads',
      color: 'from-blue-500 to-blue-600',
      progress: (stats.adsToday / stats.dailyLimit) * 100
    },
    {
      icon: Award,
      title: language === 'en' ? 'Refer & Earn' : 'ریفّر کریں اور کمائیں',
      description: language === 'en'
        ? 'Earn ₹500 for each successful referral'
        : 'ہر کامیاب ریفرل پر ₹500 کمائیں',
      action: '/dashboard/referral',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Calendar,
      title: language === 'en' ? 'Monthly Goal' : 'ماہانہ ہدف',
      description: language === 'en'
        ? `₹${dashboardData?.subscription?.monthlyEarnings || 0} monthly target`
        : `₹${dashboardData?.subscription?.monthlyEarnings || 0} ماہانہ ہدف`,
      action: '/dashboard',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {greeting}, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {language === 'en'
            ? 'Ready to watch ads and earn money today?'
            : 'آج ایڈز دیکھ کر پیسے کمانے کے لیے تیار ہیں؟'
          }
        </p>
      </div>

      {/* Daily Limit Banner */}
      <DailyLimitBanner />

      {/* Stats Cards */}
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Actions & Streak */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Quick Actions' : 'فوری اعمال'}
            </h3>
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                const isDisabled = action.disabled

                return (
                  <a
                    key={index}
                    href={action.action}
                    className={`block p-4 rounded-xl border dark:border-gray-600 transition-all duration-200 ${
                      isDisabled 
                        ? 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                        : 'bg-gray-50 dark:bg-gray-700 hover:shadow-md card-hover'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                        {/* Progress bar for target action */}
                        {action.progress !== undefined && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${action.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Streak Counter */}
          <StreakCounter />

          {/* Package Info */}
          {dashboardData?.subscription && (
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">
                {language === 'en' ? 'Your Package' : 'آپ کا پیکیج'}
              </h3>
              <div className="text-2xl font-bold mb-1 capitalize">
                {dashboardData.subscription.package}
              </div>
              <div className="text-green-100 text-sm">
                {dashboardData.subscription.dailyAds} {language === 'en' ? 'ads per day' : 'ایڈز فی دن'}
              </div>
              <div className="mt-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span>{language === 'en' ? 'Monthly Target' : 'ماہانہ ہدف'}</span>
                  <span className="font-semibold">
                    ₹{dashboardData.subscription.monthlyEarnings}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'en' ? 'Valid Until' : 'تک درست'}</span>
                  <span className="font-semibold">
                    {new Date(dashboardData.subscription.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Earnings Chart */}
        <div className="lg:col-span-2">
          <EarningsChart 
            data={dashboardData?.earningsHistory || []} 
            timeframe="30d"
          />

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Today\'s Progress' : 'آج کی پیشرفت'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <div className="font-semibold text-green-800 dark:text-green-200">
                    {language === 'en' ? 'Ads Watched' : 'ایڈز دیکھے گئے'}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    {language === 'en' 
                      ? `${stats.adsToday} of ${stats.dailyLimit} completed`
                      : `${stats.dailyLimit} میں سے ${stats.adsToday} مکمل`
                    }
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.adsToday}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    {language === 'en' ? 'ads' : 'ایڈز'}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div>
                  <div className="font-semibold text-blue-800 dark:text-blue-200">
                    {language === 'en' ? 'Earnings Today' : 'آج کی آمدنی'}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {language === 'en' 
                      ? 'Total earned from ads today'
                      : 'آج ایڈز سے کل کمائی'
                    }
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{stats.earningsToday.toFixed(2)}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {language === 'en' ? 'earned' : 'کمایا'}
                  </div>
                </div>
              </div>

              {stats.adsToday < stats.dailyLimit && (
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                    {language === 'en'
                      ? `You have ${stats.dailyLimit - stats.adsToday} ads remaining today!`
                      : `آج آپ کے ${stats.dailyLimit - stats.adsToday} ایڈز باقی ہیں!`
                    }
                  </p>
                  <a
                    href="/dashboard/ads"
                    className="inline-block mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                  >
                    {language === 'en' ? 'Watch More Ads' : 'مزید ایڈز دیکھیں'}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard