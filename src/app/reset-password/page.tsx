'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [btnHover, setBtnHover] = useState(false)

  useEffect(() => {
    if (!token) setError('Invalid reset link. Please request a new one.')
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  const inputSt = (f: string): React.CSSProperties => ({
    padding: '13px 16px', borderRadius: 10,
    border: focusedField === f ? '1.5px solid #0071E3' : '1.5px solid #E5E5EA',
    fontSize: 15, fontFamily: 'inherit', outline: 'none',
    background: focusedField === f ? '#F5F9FF' : '#FAFAFA', color: '#1D1D1F',
    width: '100%', boxSizing: 'border-box',
    boxShadow: focusedField === f ? '0 0 0 3px rgba(0,113,227,0.12)' : 'none',
    transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
  })

  return (
    <div style={{
      width: '100%', maxWidth: 400, background: '#fff', borderRadius: 20,
      padding: '44px 40px 40px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)',
      animation: 'fadeIn 0.4s ease',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 52, height: 52, borderRadius: 14,
          background: done ? 'linear-gradient(145deg, #34C759, #30D158)' : 'linear-gradient(145deg, #0071E3, #0084FF)',
          marginBottom: 16, boxShadow: done ? '0 4px 12px rgba(52,199,89,0.3)' : '0 4px 12px rgba(0,113,227,0.3)',
          transition: 'background 0.3s, box-shadow 0.3s',
        }}>
          {done ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C9.24 2 7 4.24 7 7v1H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V10a2 2 0 00-2-2h-2V7c0-2.76-2.24-5-5-5zm0 13a2 2 0 110-4 2 2 0 010 4zm3-12v1H9V7a3 3 0 016 0z" fill="white"/>
            </svg>
          )}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
          {done ? 'Password Updated' : 'Set New Password'}
        </h1>
        <p style={{ color: '#6E6E73', fontSize: 14, margin: 0 }}>
          {done ? 'Redirecting to sign in…' : 'Choose a strong password for your account'}
        </p>
      </div>

      {!done ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password" placeholder="New password" value={password}
            onChange={e => setPassword(e.target.value)} required
            onFocus={() => setFocusedField('pw')} onBlur={() => setFocusedField(null)}
            style={inputSt('pw')} disabled={!token}
          />
          <input
            type="password" placeholder="Confirm new password" value={confirm}
            onChange={e => setConfirm(e.target.value)} required
            onFocus={() => setFocusedField('cf')} onBlur={() => setFocusedField(null)}
            style={inputSt('cf')} disabled={!token}
          />
          {error && (
            <div style={{ background: '#FFF2F2', border: '1px solid #FFCDD2', borderRadius: 10, padding: '10px 14px', color: '#D32F2F', fontSize: 13 }}>
              {error}
            </div>
          )}
          <button
            type="submit" disabled={loading || !token}
            onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
            style={{
              marginTop: 4, padding: '14px 16px', borderRadius: 980,
              background: btnHover && !loading ? '#0062C4' : '#0071E3',
              color: '#fff', border: 'none', fontSize: 15, fontWeight: 600,
              fontFamily: 'inherit', cursor: loading || !token ? 'not-allowed' : 'pointer',
              opacity: loading || !token ? 0.7 : 1,
              transform: btnHover && !loading ? 'scale(0.99)' : 'scale(1)',
              transition: 'background 0.15s, transform 0.1s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading && <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }}/>}
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Link href="/login" style={{
            display: 'inline-block', padding: '13px 32px', borderRadius: 980,
            background: '#0071E3', color: '#fff', textDecoration: 'none',
            fontWeight: 600, fontSize: 15,
          }}>
            Go to Sign In
          </Link>
        </div>
      )}

      {!done && (
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6E6E73' }}>
          <Link href="/login" style={{ color: '#0071E3', textDecoration: 'none', fontWeight: 500 }}>Back to Sign In</Link>
        </p>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
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
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </>
  )
}
