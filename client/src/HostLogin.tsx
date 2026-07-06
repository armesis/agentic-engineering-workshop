import { useState, type FormEvent } from 'react'

interface HostLoginProps {
  onSuccess: () => void
}

function HostLogin({ onSuccess }: HostLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/host/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        onSuccess()
        return
      }

      const data = await response.json().catch(() => null)
      setError(data?.error ?? 'Incorrect password')
    } catch {
      setError('Could not reach the server')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="center">
      <h1>Host Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoFocus
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Checking…' : 'Log in'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
    </section>
  )
}

export default HostLogin
