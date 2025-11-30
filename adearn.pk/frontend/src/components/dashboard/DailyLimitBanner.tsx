import React, { useState, useEffect } from 'react'
import { PartyPopper, AlertCircle, CheckCircle, X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { generateConfetti } from '../../lib/utils'

const DailyLimitBanner: React.FC = () => {
  const { stats, language } = useStore()
  const [showBanner, setShowBanner] = useState(false)
  const [bannerType, setBannerType] = useState<'completed' | 'warning' | null>(null)

  useEffect(() => {
    const progress = (stats.adsToday / stats.dailyLimit) * 100
    
    if (stats.adsToday >= stats.dailyLimit) {
      setBannerType('completed')
      setShowBanner(true)
      generateConfetti()
    } else if (progress >= 80) {
      setBannerType('warning')
      setShowBanner(true)
    } else {
      setShowBanner(false)
    }
  }, [stats.adsToday, stats.dailyLimit])

  if (!showBanner) return null

  const getBannerConfig = () => {
    if (bannerType === 'completed') {
      return {
        icon: PartyPopper,
        bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
        textColor: 'text-white',
        message: language === 'en'
          ? `🎉 Amazing! You've completed your daily limit of ${stats.dailyLimit} ads!`
          : `🎉 زبردست! آپ نے اپنی روزانہ کی ${stats.dailyLimit} ایڈز کی حد مکمل کر لی ہے!`,
        subMessage: language === 'en'
          ? `You earned ₹${stats.earningsToday} today. Come back tomorrow for more!`
          : `آپ نے آج ₹${stats.earningsToday} کمائے۔ مزید کے لیے کل دوبارہ آئیں!`
      }
    } else {
      return {
        icon: AlertCircle,
        bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        textColor: 'text-white',
        message: language === 'en'
          ? `⚠️ Almost there! You've watched ${stats.adsToday} of ${stats.dailyLimit} ads today`
          : `⚠️ تقریباً مکمل! آپ نے آج ${stats.dailyLimit} میں سے ${stats.adsToday} ایڈز دیکھے ہیں`,
        subMessage: language === 'en'
          ? `Only ${stats.dailyLimit - stats.adsToday} ads left to complete your daily goal!`
          : `آپ کے روزانہ کے ہدف کو مکمل کرنے کے لیے صرف ${stats.dailyLimit - stats.adsToday} ایڈز باقی ہیں!`
      }
    }
  }

  const config = getBannerConfig()
  const Icon = config.icon

  return (
    <div className={`${config.bgColor} ${config.textColor} rounded-xl p-4 mb-6 relative overflow-hidden shadow-lg`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Icon className="w-6 h-6 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-lg mb-1">{config.message}</p>
              <p className="opacity-90 text-sm">{config.subMessage}</p>
              
              {/* Progress bar for warning state */}
              {bannerType === 'warning' && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      {language === 'en' ? 'Daily Progress' : 'روزانہ پیشرفت'}
                    </span>
                    <span>
                      {Math.round((stats.adsToday / stats.dailyLimit) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.adsToday / stats.dailyLimit) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Celebration for completed state */}
              {bannerType === 'completed' && (
                <div className="mt-3 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {language === 'en' 
                      ? 'Daily mission accomplished! 🎊'
                      : 'روزانہ مشن مکمل! 🎊'
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowBanner(false)}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Additional tips */}
        <div className="mt-3 pt-3 border-t border-white border-opacity-20">
          <p className="text-sm opacity-80">
            {language === 'en'
              ? '💡 Tip: Consistent daily watching maximizes your monthly earnings!'
              : '💡 ٹپ: مستقل روزانہ دیکھنا آپ کی ماہانہ آمدنی کو زیادہ سے زیادہ کرتا ہے!'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default DailyLimitBanner