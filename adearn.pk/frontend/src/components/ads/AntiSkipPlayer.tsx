import React, { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useStore } from '../../store/useStore'
import { socket } from '../../lib/socket'
import { generateConfetti } from '../../lib/utils'
import { AlertTriangle, Fullscreen, Clock, Eye, CheckCircle } from 'lucide-react'

interface AntiSkipPlayerProps {
  ad: {
    id: string
    title: string
    videoUrl: string
    duration: number
    earnings: number
  }
  onComplete: (earnings: number) => void
  onClose: () => void
}

const AntiSkipPlayer: React.FC<AntiSkipPlayerProps> = ({ ad, onComplete, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(ad.duration)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [warnings, setWarnings] = useState(0)
  const [cheatDetected, setCheatDetected] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)
  const cheatCheckRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeAd()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (cheatCheckRef.current) clearTimeout(cheatCheckRef.current)
    }
  }, [isPlaying, timeLeft])

  // Enhanced cheat detection
  useEffect(() => {
    if (!isPlaying || cheatDetected || isCompleted) return

    const detectCheating = () => {
      if (cheatDetected || isCompleted) return

      setWarnings(prev => {
        const newWarnings = prev + 1
        if (newWarnings >= 2) { // Reduced to 2 warnings for stricter detection
          handleCheatDetection()
          return 0
        }
        
        // Show warning
        setTimeout(() => {
          setCheatDetected(true)
          setTimeout(() => setCheatDetected(false), 2000)
        }, 100)
        
        return newWarnings
      })
    }

    const handleVisibilityChange = () => {
      if (document.hidden) detectCheating()
    }

    const handleBlur = () => {
      if (document.hasFocus()) return
      detectCheating()
    }

    const handleMouseLeave = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) {
          detectCheating()
        }
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPlaying) {
        e.preventDefault()
        e.returnValue = 'Are you sure you want to leave? Your ad progress will be lost.'
      }
    }

    // Random cheat checks
    cheatCheckRef.current = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance to check randomly
        if (!document.hasFocus() || document.hidden) {
          detectCheating()
        }
      }
    }, 5000)

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    if (containerRef.current) {
      containerRef.current.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [isPlaying, cheatDetected, isCompleted])

  const handleCheatDetection = () => {
    setCheatDetected(true)
    setIsPlaying(false)
    if (timerRef.current) clearInterval(timerRef.current)
    
    // Log cheat attempt to server
    socket.emit('cheatDetected', { adId: ad.id })
    
    // Show warning and restart ad after 3 seconds
    setTimeout(() => {
      setCheatDetected(false)
      setTimeLeft(ad.duration)
      setIsLocked(false)
      setWarnings(0)
    }, 3000)
  }

  const requestFullscreen = async () => {
    if (containerRef.current) {
      try {
        await containerRef.current.requestFullscreen()
        setIsLocked(true)
        setIsPlaying(true)
      } catch (error) {
        console.error('Fullscreen failed:', error)
      }
    }
  }

  const completeAd = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (cheatCheckRef.current) clearTimeout(cheatCheckRef.current)
    
    setIsCompleted(true)
    setIsPlaying(false)

    // Trigger confetti
    generateConfetti()

    // Notify parent component
    onComplete(ad.earnings)

    // Notify server via socket
    socket.emit('adCompleted', { 
      adId: ad.id, 
      earnings: ad.earnings 
    })

    // Exit fullscreen after completion
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }

    // Auto close after 2 seconds
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const startAd = async () => {
    setTimeLeft(ad.duration)
    await requestFullscreen()
  }

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && isLocked && !isCompleted) {
      handleCheatDetection()
    }
  }

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [isLocked, isCompleted])

  const progress = ((ad.duration - timeLeft) / ad.duration) * 100

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      {/* Cheat Detection Warning */}
      {cheatDetected && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4 flex items-center space-x-2 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
          <span>⚠️ Cheating detected! Please watch the entire ad properly.</span>
        </div>
      )}

      {/* Completion Message */}
      {isCompleted && (
        <div className="bg-green-500 text-white p-4 rounded-lg mb-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>🎉 Ad completed! You earned ₹{ad.earnings}</span>
        </div>
      )}

      {/* Ad Player Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">{ad.title}</h3>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{timeLeft}s</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-green-400 rounded-full h-2 mt-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Video Area */}
        <div className="aspect-video bg-black relative">
          {!isLocked ? (
            // Preview Mode
            <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
              <Eye className="w-16 h-16 text-green-400 mb-4" />
              <h4 className="text-2xl font-bold mb-2">Ready to Watch</h4>
              <p className="text-gray-300 mb-4">
                Watch this {ad.duration}-second ad to earn <span className="text-green-400 font-bold">₹{ad.earnings}</span>
              </p>
              <div className="bg-yellow-500 text-yellow-900 p-3 rounded-lg mb-4 max-w-md">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">Anti-cheat system active</span>
                </div>
                <p className="text-xs mt-1">
                  Do not switch tabs, minimize window, or leave fullscreen mode
                </p>
              </div>
              <button
                onClick={startAd}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <Fullscreen className="w-5 h-5" />
                <span>Start Watching in Fullscreen</span>
              </button>
            </div>
          ) : (
            // Fullscreen Mode
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-4">
                  <div className="text-6xl font-mono font-bold mb-2">{timeLeft}</div>
                  <div className="text-lg">seconds remaining</div>
                </div>
                
                {/* Simulated Video Player */}
                <div className="w-64 h-36 bg-gray-800 rounded-lg mx-auto flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-300">Ad Playing</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Keep this window active and in fullscreen mode. 
                  Earnings will be credited after {ad.duration} seconds.
                </p>
                
                {cheatDetected && (
                  <div className="mt-4 bg-red-500 text-white p-3 rounded-lg animate-pulse">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-sm">Warning: Please focus on the ad</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="text-center">
              <div className="font-semibold">Duration</div>
              <div>{ad.duration} seconds</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Earnings</div>
              <div className="text-green-500 font-bold">₹{ad.earnings}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Status</div>
              <div>
                {!isLocked && 'Ready to start'}
                {isLocked && !isCompleted && 'Watching...'}
                {isCompleted && 'Completed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      {!isLocked && (
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            Close Ad
          </button>
        </div>
      )}
    </div>
  )
}

export default AntiSkipPlayer