import { useEffect } from 'react'
import { socket } from './socket'

export function useSocketEvent<T>(event: string, setState: (value: T) => void): void {
  useEffect(() => {
    socket.on(event, setState)
    return () => {
      socket.off(event, setState)
    }
  }, [event, setState])
}
