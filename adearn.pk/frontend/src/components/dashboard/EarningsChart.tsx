import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '../../store/useStore'
import { formatCurrency } from '../../lib/utils'

interface EarningsData {
  date: string
  earnings: number
  ads?: number
}

interface EarningsChartProps {
  data: EarningsData[]
  timeframe?: '7d' | '30d' | '90d'
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data, timeframe = '30d' }) => {
  const { language, theme } = useStore()

  // Format data for chart
  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date, timeframe, language),
    earningsLabel: formatCurrency(item.earnings)
  }))

  const isDark = theme === 'dark'

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          <p className="text-green-500 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.ads && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {payload[0].payload.ads} {language === 'en' ? 'ads' : 'ایڈز'}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {language === 'en' ? 'Earnings History' : 'آمدنی کی تاریخ'}
        </h3>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? '#374151' : '#e5e7eb'} 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="formattedDate"
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#16a34a' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p>
                {language === 'en' 
                  ? 'No earnings data available'
                  : 'آمدنی کا ڈیٹا دستیاب نہیں'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Summary */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(chartData.reduce((sum, item) => sum + item.earnings, 0))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Total' : 'کل'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {chartData.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Days' : 'دن'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {formatCurrency(chartData.reduce((sum, item) => sum + item.earnings, 0) / chartData.length || 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Avg/Day' : 'اوسط/دن'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to format dates based on timeframe
function formatDate(dateString: string, timeframe: string, language: string): string {
  const date = new Date(dateString)
  
  if (timeframe === '7d') {
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ur-PK', { 
      weekday: 'short' 
    })
  }
  
  return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ur-PK', { 
    month: 'short', 
    day: 'numeric' 
  })
}

export default EarningsChart