import React from 'react'
import { Link } from 'react-router-dom'
import { Wallet, Mail, Phone, MapPin } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { translations } from '../../lib/utils'

const Footer: React.FC = () => {
  const { language } = useStore()
  const t = translations[language]

  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                AdEarn<span className="text-green-500">.pk</span>
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              {language === 'en' 
                ? "AdEarn.pk is Pakistan's first halal and legal ad-watching platform. Earn guaranteed money by watching ads with complete transparency and Shariah compliance."
                : "AdEarn.pk پاکستان کی پہلی حلال اور قانونی ایڈ دیکھنے والی پلیٹ فارم ہے۔ مکمل شفافیت اور شرعی مطابقت کے ساتھ ایڈز دیکھ کر گارنٹیڈ پیسے کمائیں۔"
              }
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>support@adearn.pk</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+92 300 1234567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {language === 'en' ? 'Quick Links' : 'فوری لنکس'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
                  {t.welcome}
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
                  {t.login}
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
                  {t.register}
                </Link>
              </li>
            </ul>
          </div>

          {/* Packages */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {language === 'en' ? 'Packages' : 'پیکیجز'}
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Silver - 40 ads/day</li>
              <li>• Gold - 80 ads/day</li>
              <li>• Platinum - 120 ads/day</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {language === 'en' 
              ? '© 2024 AdEarn.pk. All rights reserved. Halal & Legal Earnings.'
              : '© 2024 AdEarn.pk۔ جملہ حقوق محفوظ ہیں۔ حلال اور قانونی آمدنی۔'
            }
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer