import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Smartphone, Shield } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { authAPI } from '../../lib/api'
import { translations } from '../../lib/utils'
import toast from 'react-hot-toast'

const Login: React.FC = () => {
  const { setUser, language, theme } = useStore()
  const navigate = useNavigate()
  const t = translations[language]

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requires2FA, setRequires2FA] = useState(false)
  const [totpCode, setTotpCode] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    const token = document.cookie.includes('access_token')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const credentials = requires2FA 
        ? { ...formData, totpCode }
        : formData

      const response = await authAPI.login(credentials)

      if (response.status === 206 && response.data.requires2FA) {
        setRequires2FA(true)
        toast.success('Please enter your 2FA code')
      } else {
        setUser(response.data.user)
        toast.success(language === 'en' ? 'Login successful!' : 'لاگ ان کامیاب!')
        navigate('/dashboard')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || (language === 'en' ? 'Login failed' : 'لاگ ان ناکام')
      toast.error(errorMessage)
      
      // Reset 2FA if wrong password
      if (requires2FA && error.response?.status === 401) {
        setRequires2FA(false)
        setTotpCode('')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              AdEarn<span className="text-green-500">.pk</span>
            </span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t.login}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'Sign in to your account to continue earning'
              : 'کمائی جاری رکھنے کے لیے اپنے اکاؤنٹ میں سائن ان کریں'
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 2FA Code Field */}
            {requires2FA && (
              <div className="animate-fade-in">
                <label htmlFor="totpCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? '2FA Verification Code' : '2FA تصدیقی کوڈ'}
                </label>
                <div className="relative">
                  <Smartphone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="totpCode"
                    name="totpCode"
                    type="text"
                    required
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-10 pr-4 py-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-center text-lg font-mono tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {language === 'en' 
                    ? 'Enter the 6-digit code from your authenticator app'
                    : 'اپنی تصدیق ایپ سے 6 ہندسوں کا کوڈ درج کریں'
                  }
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="loading-spinner border-white"></div>
                  <span>
                    {language === 'en' ? 'Signing in...' : 'سائن ان ہو رہا ہے...'}
                  </span>
                </>
              ) : (
                <span>{t.login}</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  {language === 'en' ? 'New to AdEarn?' : 'AdEarn میں نئے ہیں؟'}
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="text-green-500 hover:text-green-600 font-semibold transition-colors"
              >
                {language === 'en' 
                  ? 'Create your account →'
                  : 'اپنا اکاؤنٹ بنائیں →'
                }
              </Link>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en' 
              ? '🔒 Your data is securely encrypted and protected'
              : '🔒 آپ کا ڈیٹا محفوظ طریقے سے انکرپٹڈ اور محفوظ ہے'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login