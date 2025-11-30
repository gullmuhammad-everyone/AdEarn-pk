import React, { useState, useEffect } from 'react'
import { ArrowLeft, Wallet, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { userAPI } from '../../lib/api'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'

interface WithdrawalRequest {
  id: string
  amount: number
  method: string
  accountInfo: string
  status: string
  createdAt: string
  processedAt?: string
}

const Withdraw: React.FC = () => {
  const { user, stats, language } = useStore()
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    amount: '',
    method: 'jazzcash',
    accountInfo: ''
  })

  const withdrawalMethods = [
    {
      value: 'jazzcash',
      label: 'JazzCash',
      icon: '📱',
      description: language === 'en' ? 'Instant transfer to JazzCash' : 'JazzCash میں فوری ٹرانسفر'
    },
    {
      value: 'easypaisa',
      label: 'EasyPaisa',
      icon: '💳',
      description: language === 'en' ? 'Instant transfer to EasyPaisa' : 'EasyPaisa میں فوری ٹرانسفر'
    },
    {
      value: 'bank',
      label: language === 'en' ? 'Bank Transfer' : 'بینک ٹرانسفر',
      icon: '🏦',
      description: language === 'en' ? 'Bank account transfer (1-2 days)' : 'بینک اکاؤنٹ ٹرانسفر (1-2 دن)'
    }
  ]

  // Load withdrawal history
  useEffect(() => {
    loadWithdrawalHistory()
  }, [])

  const loadWithdrawalHistory = async () => {
    try {
      setLoading(true)
      // This would be an API call to get withdrawal history
      // For now, using mock data
      setTimeout(() => {
        setWithdrawals([
          {
            id: '1',
            amount: 1500,
            method: 'jazzcash',
            accountInfo: '0300*****67',
            status: 'processed',
            createdAt: '2024-01-15',
            processedAt: '2024-01-15'
          },
          {
            id: '2',
            amount: 2000,
            method: 'easypaisa',
            accountInfo: '0315*****89',
            status: 'pending',
            createdAt: '2024-01-20'
          }
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to load withdrawal history' : 'نکالنے کی تاریخ لوڈ کرنے میں ناکامی')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (parseFloat(formData.amount) > stats.monthlyEarnings) {
      toast.error(language === 'en' 
        ? 'Withdrawal amount exceeds your earnings'
        : 'نکالنے کی رقم آپ کی آمدنی سے زیادہ ہے'
      )
      return
    }

    if (parseFloat(formData.amount) < 500) {
      toast.error(language === 'en' 
        ? 'Minimum withdrawal amount is ₹500'
        : 'کم از کم نکالنے کی رقم ₹500 ہے'
      )
      return
    }

    setSubmitting(true)

    try {
      await userAPI.requestWithdrawal({
        amount: parseFloat(formData.amount),
        method: formData.method,
        accountInfo: formData.accountInfo
      })

      toast.success(language === 'en' 
        ? 'Withdrawal request submitted successfully!'
        : 'نکالنے کی درخواست کامیابی سے جمع کرائی گئی!'
      )
      
      // Reset form
      setFormData({
        amount: '',
        method: 'jazzcash',
        accountInfo: ''
      })
      
      // Reload history
      loadWithdrawalHistory()
    } catch (error: any) {
      toast.error(error.response?.data?.error || (language === 'en' 
        ? 'Withdrawal request failed' 
        : 'نکالنے کی درخواست ناکام'
      ))
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      processed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      processed: CheckCircle,
      pending: Clock,
      rejected: AlertCircle
    }
    return icons[status as keyof typeof icons] || Clock
  }

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
          {language === 'en' ? 'Withdraw Earnings' : 'آمدنی واپس لیں'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {language === 'en'
            ? 'Withdraw your earnings to your preferred payment method'
            : 'اپنی آمدنی اپنی پسندیدہ ادائیگی کے طریقے پر واپس لیں'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Withdrawal Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {language === 'en' ? 'Request Withdrawal' : 'نکالنے کی درخواست کریں'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'en' 
                  ? 'Transfer your earnings to your account'
                  : 'اپنی آمدنی اپنے اکاؤنٹ میں منتقل کریں'
                }
              </p>
            </div>
          </div>

          {/* Earnings Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'Available Earnings' : 'دستیاب آمدنی'}
              </span>
              <span className="text-2xl font-bold text-green-500">
                {formatCurrency(stats.monthlyEarnings)}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {language === 'en' 
                ? 'Minimum withdrawal: ₹500'
                : 'کم از کم نکالنے کی رقم: ₹500'
              }
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Amount (₹)' : 'رقم (₹)'}
              </label>
              <input
                type="number"
                required
                min="500"
                max={stats.monthlyEarnings}
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>
                  {language === 'en' ? 'Min: ₹500' : 'کم از کم: ₹500'}
                </span>
                <span>
                  {language === 'en' ? 'Max:' : 'زیادہ سے زیادہ:'} {formatCurrency(stats.monthlyEarnings)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Payment Method' : 'ادائیگی کا طریقہ'}
              </label>
              <div className="space-y-2">
                {withdrawalMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.method === method.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={method.value}
                      checked={formData.method === method.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{method.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {method.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {method.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Account Information' : 'اکاؤنٹ کی معلومات'}
              </label>
              <input
                type="text"
                required
                value={formData.accountInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, accountInfo: e.target.value }))}
                className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={
                  formData.method === 'jazzcash' || formData.method === 'easypaisa'
                    ? (language === 'en' ? 'Phone number (e.g., 03001234567)' : 'فون نمبر (مثال: 03001234567)')
                    : (language === 'en' ? 'Bank account number' : 'بینک اکاؤنٹ نمبر')
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || parseFloat(formData.amount) < 500 || parseFloat(formData.amount) > stats.monthlyEarnings}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="loading-spinner border-white"></div>
                  <span>
                    {language === 'en' ? 'Processing...' : 'پروسس ہو رہا ہے...'}
                  </span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>
                    {language === 'en' ? 'Request Withdrawal' : 'نکالنے کی درخواست کریں'}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {language === 'en' ? 'Withdrawal History' : 'نکالنے کی تاریخ'}
          </h3>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="loading-spinner"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'Loading history...' : 'تاریخ لوڈ ہو رہی ہے...'}
              </span>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'en' 
                  ? 'No withdrawal requests yet'
                  : 'ابھی تک کوئی نکالنے کی درخواست نہیں'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => {
                const StatusIcon = getStatusIcon(withdrawal.status)
                
                return (
                  <div
                    key={withdrawal.id}
                    className="flex items-center justify-between p-4 border dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(withdrawal.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(withdrawal.amount)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {withdrawal.method} • {withdrawal.accountInfo}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)} capitalize`}>
                      {withdrawal.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Processing Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {language === 'en' ? 'Processing Time' : 'پروسس کا وقت'}
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• {language === 'en' ? 'JazzCash/EasyPaisa: 2-4 hours' : 'JazzCash/EasyPaisa: 2-4 گھنٹے'}</li>
              <li>• {language === 'en' ? 'Bank Transfer: 1-2 business days' : 'بینک ٹرانسفر: 1-2 کاروباری دن'}</li>
              <li>• {language === 'en' ? 'Processing time may vary' : 'پروسس کا وقت مختلف ہو سکتا ہے'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Withdraw