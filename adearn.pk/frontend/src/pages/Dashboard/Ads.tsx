import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { userAPI } from '../../lib/api'
import { translations } from '../../lib/utils'
import AntiSkipPlayer from '../../components/ads/AntiSkipPlayer'
import AdGrid from '../../components/ads/AdGrid'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

interface Ad {
  id: string
  title: string
  description?: string
  videoUrl: string
  duration: number
  earnings: number
}

interface AdsData {
  ads: Ad[]
  stats: {
    adsWatchedToday: number
    adsRemaining: number
    dailyLimit: number
  }
}

const Ads: React.FC = () => {
  const { language, updateStats, stats } = useStore()
  const [adsData, setAdsData] = useState<AdsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadAds()
  }, [])

  const loadAds = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getAds()
      setAdsData(response.data)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load ads')
    } finally {
      setLoading(false)
    }
  }

  const refreshAds = async () => {
    try {
      setRefreshing(true)
      await loadAds()
      toast.success(language === 'en' ? 'Ads refreshed!' : 'ایڈز ریفریش ہو گئیں!')
    } catch (error) {
      // Error handled in loadAds
    } finally {
      setRefreshing(false)
    }
  }

  const handleAdSelect = (ad: Ad) => {
    setSelectedAd(ad)
  }

  const handleAdComplete = (earnings: number) => {
    // Update local stats
    updateStats({
      adsToday: stats.adsToday + 1,
      earningsToday: stats.earningsToday + earnings
    })
    
    // Refresh ads list to remove the watched ad
    loadAds()
  }

  const handleAdClose = () => {
    setSelectedAd(null)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Loading ads...' : 'ایڈز لوڈ ہو رہی ہیں...'}
          </span>
        </div>
      </div>
    )
  }

  if (selectedAd) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={handleAdClose}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {language === 'en' ? 'Back to ads' : 'ایڈز پر واپس جائیں'}
          </span>
        </button>
        
        <AntiSkipPlayer
          ad={selectedAd}
          onComplete={handleAdComplete}
          onClose={handleAdClose}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'en' ? 'Back to Dashboard' : 'ڈیش بورڈ پر واپس جائیں'}</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {language === 'en' ? 'Watch Ads & Earn' : 'ایڈز دیکھیں اور کمائیں'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {language === 'en'
              ? 'Watch ads to earn money. Complete your daily limit to maximize earnings.'
              : 'پیسے کمانے کے لیے ایڈز دیکھیں۔ اپنی آمدنی کو زیادہ سے زیادہ کرنے کے لیے اپنی روزانہ کی حد مکمل کریں۔'
            }
          </p>
        </div>

        <button
          onClick={refreshAds}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>
            {language === 'en' ? 'Refresh Ads' : 'ایڈز ریفریش کریں'}
          </span>
        </button>
      </div>

      {/* Ads Grid */}
      {adsData && (
        <AdGrid
          ads={adsData.ads}
          onAdSelect={handleAdSelect}
          stats={adsData.stats}
        />
      )}

      {/* Tips Section */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          {language === 'en' ? 'Tips for Maximum Earnings' : 'زیادہ سے زیادہ آمدنی کے لیے تجاویز'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">💡</span>
            <span>
              {language === 'en'
                ? 'Watch ads daily to maintain your streak and earn bonuses'
                : 'اپنا سلسلہ برقرار رکھنے اور بونس حاصل کرنے کے لیے روزانہ ایڈز دیکھیں'
              }
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">⏰</span>
            <span>
              {language === 'en'
                ? 'Complete your daily limit early to avoid missing out'
                : 'چھوٹ جانے سے بچنے کے لیے اپنی روزانہ کی حد جلدی مکمل کریں'
              }
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">👥</span>
            <span>
              {language === 'en'
                ? 'Refer friends to earn ₹500 per successful referral'
                : 'دوستوں کو ریفر کریں اور ہر کامیاب ریفرل پر ₹500 کمائیں'
              }
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">🎯</span>
            <span>
              {language === 'en'
                ? 'Focus on the ad - anti-cheat system monitors activity'
                : 'ایڈ پر توجہ دیں - اینٹی چیٹ سسٹم سرگرمی کی نگرانی کرتا ہے'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Anti-Cheat Notice */}
      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
          <span className="font-semibold">⚠️</span>
          <span className="font-medium">
            {language === 'en' ? 'Anti-Cheat System Active' : 'اینٹی چیٹ سسٹم فعال'}
          </span>
        </div>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
          {language === 'en'
            ? 'Our system monitors for genuine ad viewing. Do not switch tabs, minimize windows, or use automation tools. Violations may result in account suspension.'
            : 'ہمارا سسٹم اصلی ایڈ دیکھنے کی نگرانی کرتا ہے۔ ٹیبز تبدیل نہ کریں، ونڈوز کو کم از کم نہ کریں، یا آٹومیشن ٹولز استعمال نہ کریں۔ خلاف ورزیوں کے نتیجے میں اکاؤنٹ معطل ہو سکتا ہے۔'
          }
        </p>
      </div>
    </div>
  )
}

export default Ads