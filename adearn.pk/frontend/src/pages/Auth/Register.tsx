import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { authAPI } from '../../lib/api'
import { translations } from '../../lib/utils'
import toast from 'react-hot-toast'

const Register: React.FC = () => {
  const { setUser, language } = useStore()
  const navigate = useNavigate()
  const t = translations[language]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if already authenticated
  useEffect(() => {
    const token = document.cookie.includes('access_token')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.name.length < 2) {
      newErrors.name = language === 'en' ? 'Name must be at least 2 characters' : 'نام کم از کم 2 حروف کا ہونا چاہیے'
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'en' ? 'Please enter a valid email' : 'براہ کرم درست ای میل درج کریں'
    }

    if (!/^92[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = language === 'en' 
        ? 'Please enter a valid Pakistani phone number (923001234567)'
        : 'براہ کرم درست پاکستانی فون نمبر درج کریں (923001234567)'
    }

    if (formData.password.length < 6) {
      newErrors.password = language === 'en' 
        ? 'Password must be at least 6 characters'
        : 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'en' 
        ? 'Passwords do not match'
        : 'پاس ورڈ مماثل نہیں ہیں'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error(language === 'en' ? 'Please fix the errors' : 'براہ کرم غلطیاں درست کریں')
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...submitData } = formData
      const response = await authAPI.register(submitData)
      
      setUser(response.data.user)
      toast.success(language === 'en' ? 'Registration successful!' : 'رجسٹریشن کامیاب!')
      navigate('/dashboard')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || (language === 'en' ? 'Registration failed' : 'رجسٹریشن ناکام')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneChange = (value: string) => {
    // Auto-format phone number
    let formatted = value.replace(/\D/g, '')
    if (formatted.startsWith('0')) {
      formatted = '92' + formatted.slice(1)
    } else if (formatted.startsWith('3')) {
      formatted = '92' + formatted
    }
    formatted = formatted.slice(0, 11) // 923001234567
    
    setFormData(prev => ({ ...prev, phone: formatted }))
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
            {t.register}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'Create your account and start earning today'
              : 'اپنا اکاؤنٹ بنائیں اور آج ہی کمائی شروع کریں'
            }
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.name}
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-500' : 'dark:border-gray-700'
                  }`}
                  placeholder={language === 'en' ? 'John Doe' : 'علی احمد'}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

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
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'dark:border-gray-700'
                  }`}
                  placeholder="user@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.phone}
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.phone ? 'border-red-500' : 'dark:border-gray-700'
                  }`}
                  placeholder="923001234567"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {language === 'en' 
                  ? 'Format: 923001234567 (Pakistani number)'
                  : 'فارمیٹ: 923001234567 (پاکستانی نمبر)'
                }
              </p>
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
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'dark:border-gray-700'
                  }`}
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
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Confirm Password' : 'پاس ورڈ کی تصدیق کریں'}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'dark:border-gray-700'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {language === 'en' 
                  ? 'I agree to the Terms and Privacy Policy'
                  : 'میں شرائط و ضوابط اور پرائیویسی پالیسی سے متفق ہوں'
                }
              </label>
            </div>

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
                    {language === 'en' ? 'Creating account...' : 'اکاؤنٹ بن رہا ہے...'}
                  </span>
                </>
              ) : (
                <span>{t.register}</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  {language === 'en' ? 'Already have an account?' : 'پہلے سے اکاؤنٹ ہے؟'}
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-green-500 hover:text-green-600 font-semibold transition-colors"
              >
                {language === 'en' 
                  ? 'Sign in to your account →'
                  : 'اپنے اکاؤنٹ میں سائن ان کریں →'
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

export default Register