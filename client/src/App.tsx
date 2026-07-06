import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'

function App() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = io()

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <section id="center">
      <h1>Kahoot-Clone Quiz App</h1>
      <p>Socket.IO status: {connected ? 'connected' : 'disconnected'}</p>
    </section>
  )
}

export default App
