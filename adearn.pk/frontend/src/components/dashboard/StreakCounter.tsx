import React from 'react'
import { Flame, Trophy, Star, Target } from 'lucide-react'
import { useStore } from '../../store/useStore'

const StreakCounter: React.FC = () => {
  const { stats, language } = useStore()

  const getStreakMessage = () => {
    if (stats.streak >= 30) {
      return {
        message: language === 'en' ? 'Fire Legend! 🔥' : 'لیجنڈ! 🔥',
        icon: Trophy,
        color: 'from-yellow-500 to-orange-500',
        description: language === 'en' 
          ? '30+ days streak! You are amazing!'
          : '30+ دن کا سلسلہ! آپ زبردست ہیں!'
      }
    } else if (stats.streak >= 14) {
      return {
        message: language === 'en' ? 'Hot Streak! 🔥' : 'زبردست سلسلہ! 🔥',
        icon: Flame,
        color: 'from-orange-500 to-red-500',
        description: language === 'en'
          ? 'Keep going! You are on fire!'
          : 'جاری رکھیں! آپ تو زبردست ہیں!'
      }
    } else if (stats.streak >= 7) {
      return {
        message: language === 'en' ? 'Great Job! ⭐' : 'بہت خوب! ⭐',
        icon: Star,
        color: 'from-purple-500 to-pink-500',
        description: language === 'en'
          ? 'One week completed! Amazing!'
          : 'ایک ہفتہ مکمل! زبردست!'
      }
    } else {
      return {
        message: language === 'en' ? 'Keep Going! 🎯' : 'جاری رکھیں! 🎯',
        icon: Target,
        color: 'from-blue-500 to-green-500',
        description: language === 'en'
          ? 'Complete 7 days for bonus rewards!'
          : 'بونس انعامات کے لیے 7 دن مکمل کریں!'
      }
    }
  }

  const streakInfo = getStreakMessage()
  const Icon = streakInfo.icon

  // Calculate progress to next milestone
  const getNextMilestone = () => {
    if (stats.streak < 7) return 7
    if (stats.streak < 14) return 14
    if (stats.streak < 30) return 30
    return 60 // Next milestone after 30
  }

  const nextMilestone = getNextMilestone()
  const progress = (stats.streak / nextMilestone) * 100

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full bg-gradient-to-br ${streakInfo.color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {streakInfo.message}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {streakInfo.description}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-orange-500">
            {stats.streak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Day Streak' : 'دن کا سلسلہ'}
          </div>
        </div>
      </div>

      {/* Progress to next milestone */}
      {stats.streak < 60 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>
              {language === 'en' ? 'Next milestone' : 'اگلا سنگ میل'}
            </span>
            <span>
              {stats.streak} / {nextMilestone} {language === 'en' ? 'days' : 'دن'}
            </span>
          </div>
          <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {language === 'en'
              ? `Complete ${nextMilestone - stats.streak} more days for special rewards!`
              : `خصوصی انعامات کے لیے ${nextMilestone - stats.streak} مزید دن مکمل کریں!`
            }
          </p>
        </div>
      )}

      {/* Streak benefits */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="text-green-500 font-bold text-lg">+5%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Earning Bonus' : 'آمدنی بونس'}
          </div>
        </div>
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="text-blue-500 font-bold text-lg">+2</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Extra Ads' : 'اضافی ایڈز'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreakCounter