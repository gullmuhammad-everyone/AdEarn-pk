import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null

  connect() {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1]

    if (!token) {
      console.warn('No authentication token found for socket connection')
      return
    }

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('✅ Connected to server via WebSocket')
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  get connected(): boolean {
    return this.socket?.connected || false
  }
}

export const socket = new SocketService()