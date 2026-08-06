'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBFBFD', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.015em', margin: 0 }}>B2B Sales Job</h1>
          <p style={{ color: '#6E6E73', marginTop: 6, fontSize: 15 }}>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
            style={inputStyle}
          />
          <input
            type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} required
            style={inputStyle}
          />
          {error && <p style={{ color: '#FF3B30', fontSize: 13, margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6E6E73' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#0071E3', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '13px 16px', borderRadius: 10, border: '1px solid #D2D2D7', fontSize: 15,
  fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#1D1D1F', width: '100%', boxSizing: 'border-box',
}
const btnStyle: React.CSSProperties = {
  padding: '13px 16px', borderRadius: 980, background: '#0071E3', color: '#fff', border: 'none',
  fontSize: 15, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', marginTop: 4,
}
