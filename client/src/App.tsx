import { useState } from 'react'
import HostLogin from './HostLogin'
import HostScreen from './HostScreen'
import './App.css'

function App() {
  const [authenticated, setAuthenticated] = useState(false)

  return authenticated ? (
    <HostScreen />
  ) : (
    <HostLogin onSuccess={() => setAuthenticated(true)} />
  )
}

export default App
