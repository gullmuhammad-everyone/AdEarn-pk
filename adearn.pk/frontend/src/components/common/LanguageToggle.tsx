import React from 'react'
import { Globe } from 'lucide-react'
import { useStore } from '../../store/useStore'

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useStore()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={language === 'en' ? 'Switch to Urdu' : 'Switch to English'}
    >
      <Globe className="w-5 h-5" />
      <span className="text-sm font-medium">
        {language === 'en' ? 'EN' : 'UR'}
      </span>
    </button>
  )
}

export default LanguageToggle