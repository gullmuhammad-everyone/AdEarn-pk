import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Play, Clock, DollarSign } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'

interface Ad {
  id: string
  title: string
  description?: string
  videoUrl: string
  duration: number
  earnings: number
  isActive: boolean
  createdAt: string
}

const AdManagement: React.FC = () => {
  const { language } = useStore()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 30,
    earnings: 2.5,
    isActive: true
  })

  // Mock data - replace with API call
  useEffect(() => {
    loadAds()
  }, [])

  const loadAds = async () => {
    try {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setAds([
          {
            id: '1',
            title: 'Tech Gadgets Review',
            description: 'Latest smartphone review advertisement',
            videoUrl: 'https://example.com/ad1.mp4',
            duration: 45,
            earnings: 2.5,
            isActive: true,
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            title: 'Fashion Brand Launch',
            description: 'New clothing line promotion',
            videoUrl: 'https://example.com/ad2.mp4',
            duration: 30,
            earnings: 2.0,
            isActive: true,
            createdAt: '2024-01-14'
          },
          {
            id: '3',
            title: 'Food Delivery Service',
            description: 'Food ordering app advertisement',
            videoUrl: 'https://example.com/ad3.mp4',
            duration: 60,
            earnings: 3.0,
            isActive: false,
            createdAt: '2024-01-13'
          }
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      toast.error('Failed to load ads')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingAd) {
        // Update existing ad
        toast.success('Ad updated successfully')
      } else {
        // Create new ad
        toast.success('Ad created successfully')
      }
      setShowForm(false)
      setEditingAd(null)
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        duration: 30,
        earnings: 2.5,
        isActive: true
      })
      loadAds()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save ad')
    }
  }

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      description: ad.description || '',
      videoUrl: ad.videoUrl,
      duration: ad.duration,
      earnings: ad.earnings,
      isActive: ad.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (adId: string) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this ad?' : 'کیا آپ واقعی یہ ایڈ ڈیلیٹ کرنا چاہتے ہیں؟')) {
      try {
        toast.success('Ad deleted successfully')
        loadAds()
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to delete ad')
      }
    }
  }

  const toggleAdStatus = async (adId: string, currentStatus: boolean) => {
    try {
      toast.success(`Ad ${currentStatus ? 'deactivated' : 'activated'} successfully`)
      loadAds()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update ad status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'en' ? 'Ad Management' : 'ایڈز کا انتظام'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'Create and manage advertisement content'
              : 'اشتہاری مواد بنائیں اور ان کا انتظام کریں'
            }
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{language === 'en' ? 'Create Ad' : 'ایڈ بنائیں'}</span>
        </button>
      </div>

      {/* Ad Creation/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingAd ? (language === 'en' ? 'Edit Ad' : 'ایڈ میں ترمیم کریں') : (language === 'en' ? 'Create New Ad' : 'نیا ایڈ بنائیں')}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Ad Title' : 'ایڈ کا عنوان'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={language === 'en' ? 'Enter ad title...' : 'ایڈ کا عنوان درج کریں...'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Video URL' : 'ویڈیو یو آر ایل'}
                </label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/ad.mp4"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'en' ? 'Description' : 'تفصیل'}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={language === 'en' ? 'Enter ad description...' : 'ایڈ کی تفصیل درج کریں...'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Duration (seconds)' : 'دورانیہ (سیکنڈ)'}
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  max="300"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Earnings (₹)' : 'آمدنی (₹)'}
                </label>
                <input
                  type="number"
                  required
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={formData.earnings}
                  onChange={(e) => setFormData(prev => ({ ...prev, earnings: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Status' : 'حالت'}
                </label>
                <select
                  value={formData.isActive.toString()}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="true">{language === 'en' ? 'Active' : 'فعال'}</option>
                  <option value="false">{language === 'en' ? 'Inactive' : 'غیر فعال'}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingAd(null)
                  setFormData({
                    title: '',
                    description: '',
                    videoUrl: '',
                    duration: 30,
                    earnings: 2.5,
                    isActive: true
                  })
                }}
                className="px-4 py-2 border dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {editingAd ? (language === 'en' ? 'Update Ad' : 'ایڈ اپ ڈیٹ کریں') : (language === 'en' ? 'Create Ad' : 'ایڈ بنائیں')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ads Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Loading ads...' : 'ایڈز لوڈ ہو رہی ہیں...'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden card-hover"
            >
              {/* Ad Header */}
              <div className={`p-4 text-white ${ad.isActive ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg line-clamp-2">{ad.title}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleAdStatus(ad.id, ad.isActive)}
                      className="p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
                    >
                      {ad.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(ad)}
                      className="p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ad Content */}
              <div className="p-4 space-y-3">
                {ad.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {ad.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{ad.duration}s</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-500 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatCurrency(ad.earnings)}</span>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ad.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {ad.isActive ? (language === 'en' ? 'Active' : 'فعال') : (language === 'en' ? 'Inactive' : 'غیر فعال')}
                  </span>
                </div>

                {/* Video Preview */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Play className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Video Preview</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'en' ? 'Created' : 'بنایا گیا'} {new Date(ad.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdManagement