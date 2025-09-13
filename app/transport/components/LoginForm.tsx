'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import '../transport.css'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }
    
    setError('')

    startTransition(async () => {
      try {
        const response = await fetch('/transport/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })

        const data = await response.json()

        if (data.success) {
          router.push('/transport/dashboard')
          router.refresh()
        } else {
          setError(data.error || 'Login failed')
        }
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }, [username, password, router])

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Transport Portal</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Transporter ID
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your transporter ID"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isPending}
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%' }}
            disabled={isPending}
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
