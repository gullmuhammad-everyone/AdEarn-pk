import React from 'react'
import { Eye, DollarSign, Calendar, Zap } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { formatCurrency, calculateProgress } from '../../lib/utils'

const StatsCards: React.FC = () => {
  const { stats, language } = useStore()

  const cards = [
    {
      title: language === 'en' ? 'Ads Today' : 'آج کے ایڈز',
      value: stats.adsToday,
      total: stats.dailyLimit,
      icon: Eye,
      color: 'blue',
      progress: calculateProgress(stats.adsToday, stats.dailyLimit)
    },
    {
      title: language === 'en' ? 'Earnings Today' : 'آج کی آمدنی',
      value: stats.earningsToday,
      icon: DollarSign,
      color: 'green',
      isCurrency: true
    },
    {
      title: language === 'en' ? 'Monthly Earnings' : 'ماہانہ آمدنی',
      value: stats.monthlyEarnings,
      icon: Calendar,
      color: 'purple',
      isCurrency: true
    },
    {
      title: language === 'en' ? 'Login Streak' : 'لاگ ان سلسلہ',
      value: stats.streak,
      icon: Zap,
      color: 'orange',
      suffix: language === 'en' ? 'days' : 'دن'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 relative overflow-hidden card-hover"
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getColorClasses(card.color)} opacity-10 rounded-full -translate-y-8 translate-x-8`} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.isCurrency ? formatCurrency(card.value) : card.value}
                    {card.suffix && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{card.suffix}</span>}
                  </p>
                  
                  {/* Progress for ads today */}
                  {card.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>{language === 'en' ? 'Progress' : 'پیشرفت'}</span>
                        <span>{Math.round(card.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full bg-gradient-to-r ${getColorClasses(card.color)} transition-all duration-500`}
                          style={{ width: `${card.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`p-3 rounded-lg bg-gradient-to-br ${getColorClasses(card.color)} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${getColorClasses(card.color).replace('from-', 'text-').split(' ')[0]}`} />
                </div>
              </div>

              {/* Additional info for ads card */}
              {card.total !== undefined && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'en' 
                    ? `${card.value} of ${card.total} watched`
                    : `${card.value} میں سے ${card.total} دیکھے گئے`
                  }
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards