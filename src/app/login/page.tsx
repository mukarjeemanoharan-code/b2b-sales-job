'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [btnHover, setBtnHover] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5F5F7 0%, #FBFBFD 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
        padding: '24px',
      }}>
        <div style={{
          width: '100%', maxWidth: 400,
          background: '#fff', borderRadius: 20,
          padding: '44px 40px 40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)',
          animation: 'fadeIn 0.4s ease',
        }}>
          {/* Logo mark */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(145deg, #0071E3, #0084FF)',
              marginBottom: 16, boxShadow: '0 4px 12px rgba(0,113,227,0.3)',
            }}>
              <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
                <rect x="0" y="8" width="6" height="14" rx="2" fill="rgba(255,255,255,0.6)"/>
                <rect x="10" y="4" width="6" height="18" rx="2" fill="rgba(255,255,255,0.85)"/>
                <rect x="20" y="0" width="6" height="22" rx="2" fill="#fff"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em', margin: '0 0 6px' }}>B2B Sales Job</h1>
            <p style={{ color: '#6E6E73', fontSize: 14, margin: 0 }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email" placeholder="Email address" value={email}
              onChange={e => setEmail(e.target.value)} required
              onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
              style={inputStyle(focusedField === 'email')}
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required
              onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
              style={inputStyle(focusedField === 'password')}
            />

            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <Link href="/forgot-password" style={{ color: '#0071E3', fontSize: 13, textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            {error && (
              <div style={{
                background: '#FFF2F2', border: '1px solid #FFCDD2', borderRadius: 10,
                padding: '10px 14px', color: '#D32F2F', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
              style={{
                marginTop: 4, padding: '14px 16px', borderRadius: 980,
                background: btnHover && !loading ? '#0062C4' : '#0071E3',
                color: '#fff', border: 'none', fontSize: 15, fontWeight: 600,
                fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1,
                transform: btnHover && !loading ? 'scale(0.99)' : 'scale(1)',
                transition: 'background 0.15s, transform 0.1s, opacity 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading && (
                <span style={{
                  width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite', display: 'inline-block',
                }}/>
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6E6E73' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#0071E3', textDecoration: 'none', fontWeight: 500 }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    padding: '13px 16px', borderRadius: 10,
    border: focused ? '1.5px solid #0071E3' : '1.5px solid #E5E5EA',
    fontSize: 15, fontFamily: 'inherit', outline: 'none',
    background: focused ? '#F5F9FF' : '#FAFAFA',
    color: '#1D1D1F', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
    boxShadow: focused ? '0 0 0 3px rgba(0,113,227,0.12)' : 'none',
  }
}
