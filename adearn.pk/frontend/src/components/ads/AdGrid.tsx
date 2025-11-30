import React from 'react'
import { Play, Clock, DollarSign, Eye } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { formatCurrency } from '../../lib/utils'

interface Ad {
  id: string
  title: string
  description?: string
  videoUrl: string
  duration: number
  earnings: number
}

interface AdGridProps {
  ads: Ad[]
  onAdSelect: (ad: Ad) => void
  stats: {
    adsWatchedToday: number
    adsRemaining: number
    dailyLimit: number
  }
}

const AdGrid: React.FC<AdGridProps> = ({ ads, onAdSelect, stats }) => {
  const { language } = useStore()

  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
          {language === 'en' ? 'No ads available' : 'کوئی ایڈز دستیاب نہیں'}
        </h3>
        <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
          {language === 'en' 
            ? 'You have watched all available ads for today. Check back tomorrow for new ads!'
            : 'آپ نے آج کے تمام دستیاب ایڈز دیکھ لیے ہیں۔ نئے ایڈز کے لیے کل دوبارہ چیک کریں!'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{stats.adsWatchedToday}</div>
            <div className="text-green-100 text-sm">
              {language === 'en' ? 'Watched Today' : 'آج دیکھے گئے'}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.adsRemaining}</div>
            <div className="text-green-100 text-sm">
              {language === 'en' ? 'Remaining' : 'باقی'}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.dailyLimit}</div>
            <div className="text-green-100 text-sm">
              {language === 'en' ? 'Daily Limit' : 'روزانہ حد'}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-green-100 mb-1">
            <span>
              {language === 'en' ? 'Daily Progress' : 'روزانہ پیشرفت'}
            </span>
            <span>
              {stats.adsWatchedToday} / {stats.dailyLimit}
            </span>
          </div>
          <div className="w-full bg-green-400 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(stats.adsWatchedToday / stats.dailyLimit) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 card-hover"
          >
            {/* Ad Thumbnail/Preview */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-6 h-6 text-white fill-current" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {language === 'en' ? 'Watch Ad' : 'ایڈ دیکھیں'}
                  </span>
                </div>
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => onAdSelect(ad)}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-200 flex items-center space-x-2 hover:bg-green-600"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {language === 'en' ? 'Watch & Earn' : 'دیکھیں اور کمائیں'}
                  </span>
                </button>
              </div>
            </div>

            {/* Ad Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {ad.title}
              </h3>
              
              {ad.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {ad.description}
                </p>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{ad.duration}s</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-500 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(ad.earnings)}</span>
                  </div>
                </div>

                <button
                  onClick={() => onAdSelect(ad)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center space-x-1"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {language === 'en' ? 'Watch' : 'دیکھیں'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Limit Notice */}
      {stats.adsRemaining === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-yellow-800 dark:text-yellow-200">
            <Eye className="w-5 h-5" />
            <span className="font-semibold">
              {language === 'en' 
                ? 'Daily limit reached! Come back tomorrow.'
                : 'روزانہ حد مکمل ہو گئی! کل دوبارہ آئیں۔'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdGrid