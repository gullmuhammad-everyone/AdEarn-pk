import React from 'react'
import { Link } from 'react-router-dom'
import { Play, DollarSign, Shield, Users, Star, TrendingUp, CheckCircle } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { translations } from '../../lib/utils'

const Landing: React.FC = () => {
  const { language, setLanguage, theme, setTheme } = useStore()
  const t = translations[language]

  const features = [
    {
      icon: DollarSign,
      title: language === 'en' ? 'Guaranteed Earnings' : 'گارنٹیڈ آمدنی',
      description: language === 'en' 
        ? 'Earn fixed monthly income by watching ads daily'
        : 'روزانہ ایڈز دیکھ کر مقررہ ماہانہ آمدنی حاصل کریں'
    },
    {
      icon: Shield,
      title: language === 'en' ? 'Halal & Legal' : 'حلال اور قانونی',
      description: language === 'en'
        ? '100% Shariah compliant and legally approved in Pakistan'
        : '100% شرعی طور پر جائز اور پاکستان میں قانونی طور پر منظور شدہ'
    },
    {
      icon: Users,
      title: language === 'en' ? 'Referral Bonus' : 'ریفّرل بونس',
      description: language === 'en'
        ? 'Earn ₹500 for each successful referral'
        : 'ہر کامیاب ریفرل پر ₹500 کمائیں'
    },
    {
      icon: TrendingUp,
      title: language === 'en' ? 'Daily Progress' : 'روزانہ پیشرفت',
      description: language === 'en'
        ? 'Track your earnings and progress in real-time'
        : 'اپنی آمدنی اور پیشرفت کو رئیل ٹائم ٹریک کریں'
    }
  ]

  const packages = [
    {
      name: 'Silver',
      nameUr: 'سلور',
      ads: 40,
      earnings: 3000,
      color: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      name: 'Gold',
      nameUr: 'گولڈ',
      ads: 80,
      earnings: 6000,
      color: 'from-yellow-500 to-yellow-600',
      popular: true
    },
    {
      name: 'Platinum',
      nameUr: 'پلاٹینم',
      ads: 120,
      earnings: 9000,
      color: 'from-blue-500 to-blue-600',
      popular: false
    }
  ]

  const steps = [
    {
      step: '01',
      title: language === 'en' ? 'Sign Up' : 'سائن اپ کریں',
      description: language === 'en'
        ? 'Create your account with email and phone verification'
        : 'ای میل اور فون کی تصدیق کے ساتھ اپنا اکاؤنٹ بنائیں'
    },
    {
      step: '02',
      title: language === 'en' ? 'Choose Package' : 'پیکیج منتخب کریں',
      description: language === 'en'
        ? 'Select your preferred package and make payment'
        : 'اپنا پسندیدہ پیکیج منتخب کریں اور ادائیگی کریں'
    },
    {
      step: '03',
      title: language === 'en' ? 'Watch Ads' : 'ایڈز دیکھیں',
      description: language === 'en'
        ? 'Watch daily ads and earn guaranteed money'
        : 'روزانہ ایڈز دیکھیں اور گارنٹیڈ پیسے کمائیں'
    },
    {
      step: '04',
      title: language === 'en' ? 'Withdraw Earnings' : 'آمدنی واپس لیں',
      description: language === 'en'
        ? 'Withdraw your earnings to JazzCash or EasyPaisa'
        : 'اپنی آمدنی JazzCash یا EasyPaisa میں واپس لیں'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                AdEarn<span className="text-green-500">.pk</span>
              </span>
            </div>

            {/* Language & Theme Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md transition-shadow"
              >
                <span className="font-medium">
                  {language === 'en' ? 'EN' : 'اردو'}
                </span>
              </button>
              
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md transition-shadow"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {t.login}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {language === 'en' ? (
                <>
                  Watch Ads,{' '}
                  <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    Earn Money
                  </span>
                </>
              ) : (
                <>
                  ایڈز دیکھیں،{' '}
                  <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    پیسے کمائیں
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              {language === 'en'
                ? "Pakistan's first halal and legal ad-watching platform. Earn guaranteed monthly income with complete transparency."
                : "پاکستان کی پہلی حلال اور قانونی ایڈ دیکھنے والی پلیٹ فارم۔ مکمل شفافیت کے ساتھ گارنٹیڈ ماہانہ آمدنی حاصل کریں۔"
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{language === 'en' ? 'Start Earning Now' : 'ابھی کمائیں شروع کریں'}</span>
              </Link>
              
              <Link
                to="/login"
                className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200"
              >
                {language === 'en' ? 'Existing User?' : 'پہلے سے صارف ہیں؟'}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">10K+</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Happy Users' : 'خوش صارفین'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">₹50L+</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Earned' : 'کمایا گیا'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">99%</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Success Rate' : 'کامیابی کی شرح'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">24/7</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Support' : 'سپورٹ'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Why Choose AdEarn.pk?' : 'AdEarn.pk کیوں منتخب کریں؟'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'en'
                ? 'We provide a transparent, halal, and rewarding platform for Pakistani users'
                : 'ہم پاکستانی صارفین کے لیے ایک شفاف، حلال اور فائدہ مند پلیٹ فارم فراہم کرتے ہیں'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center card-hover border dark:border-gray-600"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'en' ? 'Choose Your Package' : 'اپنا پیکیج منتخب کریں'}
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Select the package that fits your earning goals'
                : 'اپنے کمائی کے ہدف کے مطابق پیکیج منتخب کریں'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-8 relative ${
                  pkg.popular ? 'ring-4 ring-yellow-400 transform scale-105' : ''
                } card-hover`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {language === 'en' ? 'MOST POPULAR' : 'سب سے مقبول'}
                    </span>
                  </div>
                )}

                <div className={`w-20 h-20 bg-gradient-to-r ${pkg.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <Star className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                  {language === 'en' ? pkg.name : pkg.nameUr}
                </h3>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    ₹{pkg.earnings}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {language === 'en' ? 'per month' : 'فی مہینہ'}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {pkg.ads} {language === 'en' ? 'ads per day' : 'ایڈز فی دن'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      ₹{pkg.earnings} {language === 'en' ? 'monthly earnings' : 'ماہانہ آمدنی'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === 'en' ? 'Guaranteed payments' : 'گارنٹیڈ ادائیگیاں'}
                    </span>
                  </div>
                </div>

                <Link
                  to="/register"
                  className={`w-full py-3 rounded-xl font-semibold text-center block transition-all duration-200 ${
                    pkg.popular
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {language === 'en' ? 'Get Started' : 'شروع کریں'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'How It Works' : 'یہ کیسے کام کرتا ہے'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Start earning in just 4 simple steps'
                : 'صرف 4 آسان مراحل میں کمائی شروع کریں'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {language === 'en' 
              ? 'Ready to Start Your Earning Journey?'
              : 'اپنا کمائی کا سفر شروع کرنے کے لیے تیار ہیں؟'
            }
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Join thousands of Pakistanis who are earning halal income with AdEarn.pk'
              : 'ہزاروں پاکستانیوں میں شامل ہوں جو AdEarn.pk کے ساتھ حلال آمدنی حاصل کر رہے ہیں'
            }
          </p>
          <Link
            to="/register"
            className="bg-white text-green-500 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{language === 'en' ? 'Join Now - It\'s Free!' : 'ابھی شامل ہوں - مفت ہے!'}</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing