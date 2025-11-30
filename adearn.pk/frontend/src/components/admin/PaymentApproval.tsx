import React, { useState, useEffect } from 'react'
import { Search, CheckCircle, XCircle, Eye, Download, Clock } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { adminAPI } from '../../lib/api'
import { formatCurrency, formatPhoneNumber } from '../../lib/utils'
import toast from 'react-hot-toast'

interface Payment {
  id: string
  userId: string
  imageUrl: string
  amount: number
  method: string
  status: string
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  user: {
    id: string
    name: string
    email: string
    phone: string
  }
}

const PaymentApproval: React.FC = () => {
  const { language } = useStore()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getPendingPayments()
      setPayments(response.data.payments)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (paymentId: string) => {
    try {
      await adminAPI.approvePayment(paymentId)
      toast.success('Payment approved successfully')
      loadPayments()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to approve payment')
    }
  }

  const handleReject = async (paymentId: string) => {
    try {
      await adminAPI.rejectPayment(paymentId, 'Manual rejection by admin')
      toast.success('Payment rejected successfully')
      loadPayments()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reject payment')
    }
  }

  const getMethodColor = (method: string) => {
    const colors = {
      jazzcash: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      easypaisa: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      bank: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
    return colors[method as keyof typeof colors] || colors.jazzcash
  }

  const openImageModal = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'en' ? 'Payment Approval' : 'ادائیگی کی منظوری'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'Review and approve pending payment proofs'
              : 'زیر التواء ادائیگی کے ثبوتوں کا جائزہ لیں اور منظوری دیں'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {payments.length} {language === 'en' ? 'pending payments' : 'زیر التواء ادائیگیاں'}
          </span>
        </div>
      </div>

      {/* Payments Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Loading payments...' : 'ادائیگیاں لوڈ ہو رہی ہیں...'}
          </span>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {language === 'en' ? 'No Pending Payments' : 'کوئی زیر التواء ادائیگی نہیں'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {language === 'en'
              ? 'All payment proofs have been reviewed. Check back later for new submissions.'
              : 'ادائیگی کے تمام ثبوتوں کا جائزہ لیا جا چکا ہے۔ نئی جمع کرائی گئی ادائیگیوں کے لیے بعد میں چیک کریں۔'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden card-hover"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{payment.user.name}</h3>
                    <p className="text-blue-100 text-sm">{payment.user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(payment.method)} capitalize`}>
                    {payment.method}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'en' ? 'Amount' : 'رقم'}
                  </span>
                  <span className="text-lg font-bold text-green-500">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'en' ? 'Phone' : 'فون'}
                  </span>
                  <span className="text-sm font-medium">
                    {formatPhoneNumber(payment.user.phone)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'en' ? 'Submitted' : 'جمع کرایا'}
                  </span>
                  <span className="text-sm">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Payment Proof Image */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 mb-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">
                      {language === 'en' ? 'Payment Proof' : 'ادائیگی کا ثبوت'}
                    </span>
                  </div>
                  <button
                    onClick={() => openImageModal(payment)}
                    className="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    {language === 'en' ? 'View Proof' : 'ثبوت دیکھیں'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 flex space-x-2">
                <button
                  onClick={() => handleApprove(payment.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === 'en' ? 'Approve' : 'منظور کریں'}</span>
                </button>
                <button
                  onClick={() => handleReject(payment.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{language === 'en' ? 'Reject' : 'مسترد کریں'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {language === 'en' ? 'Payment Proof' : 'ادائیگی کا ثبوت'} - {selectedPayment.user.name}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-auto">
              <img
                src={`http://localhost:5000${selectedPayment.imageUrl}`}
                alt="Payment proof"
                className="w-full h-auto rounded-lg"
              />
            </div>
            
            <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatCurrency(selectedPayment.amount)} • {selectedPayment.method}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(selectedPayment.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                >
                  {language === 'en' ? 'Approve' : 'منظور کریں'}
                </button>
                <button
                  onClick={() => handleReject(selectedPayment.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                >
                  {language === 'en' ? 'Reject' : 'مسترد کریں'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentApproval