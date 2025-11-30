import React, { useState } from 'react'
import { ArrowLeft, Users, Copy, Share2, Gift, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'

const Referral: React.FC = () => {
  const { user, language } = useStore()
  const [copied, setCopied] = useState(false)

  const referralLink = `https://adearn.pk/register?ref=${user?.id}`
  const referralCode = `ADEARN${user?.id?.slice(0, 8).toUpperCase()}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success(language === 'en' ? 'Referral link copied!' : 'ریفّرل لنک کاپی ہو گیا!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error(language === 'en' ? 'Failed to copy link' : 'لنک کاپی کرنے میں ناکامی')
    }
  }

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'en' ? 'Join AdEarn.pk and Earn Money' : 'AdEarn.pk میں شامل ہوں اور پیسے کمائیں',
          text: language === 'en' 
            ? `Join AdEarn.pk using my referral link and earn money by watching ads! Use code: ${referralCode}`
            : `میرے ریفرل لنک کا استعمال کرتے ہوئے AdEarn.pk میں شامل ہوں اور ایڈز دیکھ کر پیسے کمائیں! کوڈ استعمال کریں: ${referralCode}`,
          url: referralLink,
        })
      } catch (err) {
        // User cancelled the share
      }
    } else {
      copyToClipboard()
    }
  }

  const referralStats = {
    totalReferrals: 5,
    activeReferrals: 3,
    totalEarnings: 1500,
    pendingBonus: 1000
  }

  const steps = [
    {
      step: '1',
      title: language === 'en' ? 'Share Your Link' : 'اپنا لنک شیئر کریں',
      description: language === 'en'
        ? 'Share your unique referral link with friends and family'
        : 'اپنا منفرد ریفرل لنک دوستوں اور خاندان کے ساتھ شیئر کریں'
    },
    {
      step: '2',
      title: language === 'en' ? 'They Sign Up & Pay' : 'وہ سائن اپ کریں اور ادا کریں',
      description: language === 'en'
        ? 'Your referral signs up and makes their first payment'
        : 'آپ کا ریفرل سائن اپ کرتا ہے اور اپنی پہلی ادائیگی کرتا ہے'
    },
    {
      step: '3',
      title: language === 'en' ? 'You Earn ₹500' : 'آپ ₹500 کمائیں',
      description: language === 'en'
        ? 'Get ₹500 bonus when their payment is approved'
        : 'جب ان کی ادائیگی منظور ہو جائے تو ₹500 بونس حاصل کریں'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back to Dashboard' : 'ڈیش بورڈ پر واپس جائیں'}</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {language === 'en' ? 'Refer & Earn' : 'ریفّر کریں اور کمائیں'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {language === 'en'
            ? 'Invite friends and earn ₹500 for each successful referral'
            : 'دوستوں کو مدعو کریں اور ہر کامیاب ریفرل پر ₹500 کمائیں'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Referral Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {referralStats.totalReferrals}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'Total Referrals' : 'کل ریفرلز'}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {referralStats.activeReferrals}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'Active Referrals' : 'فعال ریفرلز'}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 text-center">
              <Gift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(referralStats.totalEarnings)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'Total Earned' : 'کل کمائی'}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 text-center">
              <Gift className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(referralStats.pendingBonus)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'Pending Bonus' : 'زیر التواء بونس'}
              </div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Your Referral Link' : 'آپ کا ریفرل لنک'}
            </h3>
            
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? (language === 'en' ? 'Copied!' : 'کاپی ہو گیا!') : (language === 'en' ? 'Copy' : 'کاپی کریں')}</span>
              </button>
            </div>

            <button
              onClick={shareReferral}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'en' ? 'Share Referral Link' : 'ریفّرل لنک شیئر کریں'}</span>
            </button>
          </div>

          {/* How It Works */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'How It Works' : 'یہ کیسے کام کرتا ہے'}
            </h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{step.step}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Bonus Info */}
        <div className="space-y-6">
          {/* Bonus Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <Gift className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              ₹500 {language === 'en' ? 'Bonus' : 'بونس'}
            </h3>
            <p className="text-green-100 mb-4">
              {language === 'en'
                ? 'For each friend who joins and makes payment'
                : 'ہر دوست کے لیے جو شامل ہوتا ہے اور ادائیگی کرتا ہے'
              }
            </p>
            <div className="text-3xl font-bold">
              {referralStats.totalEarnings > 0 ? `+${formatCurrency(referralStats.totalEarnings)}` : 'Start Earning!'}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              {language === 'en' ? 'Sharing Tips' : 'شیئرنگ کے نکات'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span>
                  {language === 'en'
                    ? 'Share on WhatsApp, Facebook, and other social media'
                    : 'واٹس ایپ، فیس بک اور دیگر سوشل میڈیا پر شیئر کریں'
                  }
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span>
                  {language === 'en'
                    ? 'Explain how AdEarn.pk provides halal earnings'
                    : 'وضاحت کریں کہ AdEarn.pk کیسے حلال آمدنی فراہم کرتا ہے'
                  }
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span>
                  {language === 'en'
                    ? 'Highlight the guaranteed monthly income'
                    : 'گارنٹیڈ ماہانہ آمدنی کو نمایاں کریں'
                  }
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span>
                  {language === 'en'
                    ? 'Share your personal success story'
                    : 'اپنی ذاتی کامیابی کی کہانی شیئر کریں'
                  }
                </span>
              </li>
            </ul>
          </div>

          {/* Terms */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              {language === 'en' ? 'Terms & Conditions' : 'شرائط و ضوابط'}
            </h4>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• {language === 'en' ? 'Bonus paid after referral\'s payment approval' : 'ریفّرل کی ادائیگی کی منظوری کے بعد بونس ادا کیا جاتا ہے'}</li>
              <li>• {language === 'en' ? 'Referral must be a new user' : 'ریفّرل ایک نیا صارف ہونا چاہیے'}</li>
              <li>• {language === 'en' ? 'No self-referrals allowed' : 'خود ریفرلز کی اجازت نہیں ہے'}</li>
              <li>• {language === 'en' ? 'Company reserves right to modify terms' : 'کمپنی شرائط میں ترمیم کا حق محفوظ رکھتی ہے'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Referral