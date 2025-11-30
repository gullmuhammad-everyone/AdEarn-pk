import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { adminAPI } from '../../lib/api'
import { formatCurrency } from '../../lib/utils'
import { Users, DollarSign, Eye, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminStats {
  stats: {
    totalUsers: number
    activeUsers: number
    activeToday: number
    pendingPayments: number
    pendingWithdrawals: number
    totalRevenue: number
  }
  weeklyEarnings: Array<{
    date: string
    earnings: number
  }>
}

const AdminDashboard: React.FC = () => {
  const { user, language } = useStore()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminStats()
  }, [])

  const loadAdminStats = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getStats()
      setStats(response.data)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load admin stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Loading dashboard...' : 'ڈیش بورڈ لوڈ ہو رہا ہے...'}
          </span>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: language === 'en' ? 'Total Users' : 'کل صارفین',
      value: stats?.stats.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: language === 'en' ? 'Active Today' : 'آج فعال',
      value: stats?.stats.activeToday || 0,
      icon: Eye,
      color: 'from-green-500 to-green-600',
      change: '+5%'
    },
    {
      title: language === 'en' ? 'Pending Payments' : 'زیر التواء ادائیگیاں',
      value: stats?.stats.pendingPayments || 0,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      change: '+3'
    },
    {
      title: language === 'en' ? 'Pending Withdrawals' : 'زیر التواء نکالے',
      value: stats?.stats.pendingWithdrawals || 0,
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      change: '+2'
    },
    {
      title: language === 'en' ? 'Total Revenue' : 'کل آمدنی',
      value: stats?.stats.totalRevenue || 0,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      isCurrency: true,
      change: '+18%'
    },
    {
      title: language === 'en' ? 'Active Users' : 'فعال صارفین',
      value: stats?.stats.activeUsers || 0,
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
      change: '+8%'
    }
  ]

  const quickActions = [
    {
      title: language === 'en' ? 'Approve Payments' : 'ادائیگیاں منظور کریں',
      description: language === 'en' 
        ? 'Review and approve pending payment proofs'
        : 'زیر التواء ادائیگی کے ثبوتوں کا جائزہ لیں اور منظوری دیں',
      path: '/admin/payments',
      icon: DollarSign,
      count: stats?.stats.pendingPayments || 0,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
    },
    {
      title: language === 'en' ? 'Manage Users' : 'صارفین کا انتظام',
      description: language === 'en'
        ? 'View and manage all user accounts'
        : 'تمام صارف کے اکاؤنٹس دیکھیں اور ان کا انتظام کریں',
      path: '/admin/users',
      icon: Users,
      count: stats?.stats.totalUsers || 0,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200'
    },
    {
      title: language === 'en' ? 'Process Withdrawals' : 'نکالے پروسیس کریں',
      description: language === 'en'
        ? 'Process pending withdrawal requests'
        : 'زیر التواء نکالنے کی درخواستیں پروسیس کریں',
      path: '/admin/payments',
      icon: DollarSign,
      count: stats?.stats.pendingWithdrawals || 0,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200'
    },
    {
      title: language === 'en' ? 'Ad Management' : 'ایڈز کا انتظام',
      description: language === 'en'
        ? 'Create and manage advertisement content'
        : 'اشتہاری مواد بنائیں اور ان کا انتظام کریں',
      path: '/admin/ads',
      icon: Eye,
      count: '∞',
      color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'en' ? 'Admin Dashboard' : 'ایڈمن ڈیش بورڈ'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en'
            ? `Welcome back, ${user?.name}. Here's your platform overview.`
            : `خوش آمدید، ${user?.name}. یہ آپ کا پلیٹ فارم کا جائزہ ہے۔`
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon
          
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {card.change}
                </span>
              </div>
              
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {card.isCurrency ? formatCurrency(card.value) : card.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {card.title}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {language === 'en' ? 'Quick Actions' : 'فوری اعمال'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                
                return (
                  <a
                    key={index}
                    href={action.path}
                    className="block p-4 border dark:border-gray-600 rounded-xl hover:shadow-md transition-all duration-200 card-hover"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${action.color}`}>
                        {action.count}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {language === 'en' ? 'Recent Activity' : 'حالیہ سرگرمی'}
            </h2>
            
            <div className="space-y-4">
              {[
                { action: 'New user registration', user: 'Ali Ahmed', time: '2 minutes ago' },
                { action: 'Payment approved', user: 'Sara Khan', time: '15 minutes ago' },
                { action: 'Withdrawal processed', user: 'Usman Ali', time: '1 hour ago' },
                { action: 'New ad created', user: 'System', time: '2 hours ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border dark:border-gray-600 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.user} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Platform Health */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Platform Health' : 'پلیٹ فارم کی صحت'}
            </h3>
            
            <div className="space-y-3">
              {[
                { label: language === 'en' ? 'Server Status' : 'سرور کی حالت', value: 'Online', status: 'good' },
                { label: language === 'en' ? 'Database' : 'ڈیٹا بیس', value: 'Healthy', status: 'good' },
                { label: language === 'en' ? 'WhatsApp Service' : 'واٹس ایپ سروس', value: 'Connected', status: 'good' },
                { label: language === 'en' ? 'Payment Gateway' : 'ادائیگی گیٹ وے', value: 'Active', status: 'good' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'good' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Earnings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Weekly Earnings' : 'ہفتہ وار آمدنی'}
            </h3>
            
            <div className="space-y-3">
              {stats?.weeklyEarnings.map((day, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="font-semibold text-green-500">
                    {formatCurrency(day.earnings)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Total' : 'کل'}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats?.weeklyEarnings.reduce((sum, day) => sum + day.earnings, 0) || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">
                {language === 'en' ? 'Attention Needed' : 'توجہ کی ضرورت'}
              </span>
            </div>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• {stats?.stats.pendingPayments || 0} {language === 'en' ? 'payments pending approval' : 'ادائیگیاں منظوری کے منتظر'}</li>
              <li>• {stats?.stats.pendingWithdrawals || 0} {language === 'en' ? 'withdrawals to process' : 'نکالے پروسیس کرنے کے لیے'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard