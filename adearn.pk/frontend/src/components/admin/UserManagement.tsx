import React, { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, Eye, Mail, Phone, CheckCircle, XCircle, Ban } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { adminAPI } from '../../lib/api'
import { formatCurrency, formatPhoneNumber } from '../../lib/utils'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  phone: string
  status: string
  role: string
  createdAt: string
  subscription?: any
  _count: {
    adViews: number
    payments: number
    withdrawals: number
  }
}

const UserManagement: React.FC = () => {
  const { language } = useStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    loadUsers()
  }, [pagination.page, search, statusFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getUsers(pagination.page, search)
      setUsers(response.data.users)
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      active: CheckCircle,
      pending: Eye,
      suspended: Ban
    }
    return icons[status as keyof typeof icons] || Eye
  }

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      // Here you would call API to update user status
      toast.success(`User status updated to ${newStatus}`)
      loadUsers() // Reload users
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'en' ? 'User Management' : 'صارفین کا انتظام'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'Manage all users and their subscriptions'
              : 'تمام صارفین اور ان کی سبسکرپشنز کا انتظام کریں'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total} {language === 'en' ? 'users' : 'صارفین'}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search users...' : 'صارفین تلاش کریں...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">{language === 'en' ? 'All Status' : 'تمام حالات'}</option>
          <option value="active">{language === 'en' ? 'Active' : 'فعال'}</option>
          <option value="pending">{language === 'en' ? 'Pending' : 'زیر التواء'}</option>
          <option value="suspended">{language === 'en' ? 'Suspended' : 'معطل'}</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading-spinner"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Loading users...' : 'صارفین لوڈ ہو رہے ہیں...'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'en' ? 'User' : 'صارف'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'en' ? 'Package' : 'پیکیج'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'en' ? 'Stats' : 'اعداد و شمار'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'en' ? 'Status' : 'حالت'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'en' ? 'Joined' : 'شامل ہوئے'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'en' ? 'Actions' : 'اعمال'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => {
                  const StatusIcon = getStatusIcon(user.status)
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{user.email}</span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{formatPhoneNumber(user.phone)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white capitalize">
                          {user.subscription?.package || 'No Package'}
                        </div>
                        {user.subscription && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.subscription.dailyAds} {language === 'en' ? 'ads/day' : 'ایڈز/دن'}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          <div className="text-gray-900 dark:text-white">
                            {user._count.adViews} {language === 'en' ? 'ads watched' : 'ایڈز دیکھے'}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {user._count.withdrawals} {language === 'en' ? 'withdrawals' : 'نکالے'}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {user.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(user.id, 'active')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title={language === 'en' ? 'Activate' : 'فعال کریں'}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(user.id, 'suspended')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title={language === 'en' ? 'Suspend' : 'معطل کریں'}
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {language === 'en' 
                ? `Showing ${((pagination.page - 1) * pagination.limit) + 1} to ${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} users`
                : `${((pagination.page - 1) * pagination.limit) + 1} سے ${Math.min(pagination.page * pagination.limit, pagination.total)} تک، کل ${pagination.total} صارفین میں سے`
              }
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded-lg border dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {language === 'en' ? 'Previous' : 'پچھلا'}
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 rounded-lg border dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {language === 'en' ? 'Next' : 'اگلا'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement