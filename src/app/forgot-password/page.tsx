'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [resetLink, setResetLink] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    if (data.token) {
      setResetLink(`${window.location.origin}/reset-password?token=${data.token}`)
    } else {
      // Email not found — show same message to not reveal existence
      setResetLink('__not_found__')
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(resetLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          width: '100%', maxWidth: 400, background: '#fff', borderRadius: 20,
          padding: '44px 40px 40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)',
          animation: 'fadeIn 0.4s ease',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(145deg, #0071E3, #0084FF)',
              marginBottom: 16, boxShadow: '0 4px 12px rgba(0,113,227,0.3)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C9.24 2 7 4.24 7 7v1H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V10a2 2 0 00-2-2h-2V7c0-2.76-2.24-5-5-5zm0 13a2 2 0 110-4 2 2 0 010 4zm3-12v1H9V7a3 3 0 016 0z" fill="white"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em', margin: '0 0 6px' }}>Reset Password</h1>
            <p style={{ color: '#6E6E73', fontSize: 14, margin: 0 }}>Enter your email to get a reset link</p>
          </div>

          {!resetLink ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email" placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)} required
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{
                  padding: '13px 16px', borderRadius: 10,
                  border: focused ? '1.5px solid #0071E3' : '1.5px solid #E5E5EA',
                  fontSize: 15, fontFamily: 'inherit', outline: 'none',
                  background: focused ? '#F5F9FF' : '#FAFAFA', color: '#1D1D1F',
                  width: '100%', boxSizing: 'border-box' as const,
                  boxShadow: focused ? '0 0 0 3px rgba(0,113,227,0.12)' : 'none',
                  transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                }}
              />
              {error && (
                <div style={{ background: '#FFF2F2', border: '1px solid #FFCDD2', borderRadius: 10, padding: '10px 14px', color: '#D32F2F', fontSize: 13 }}>
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
                  transition: 'background 0.15s, transform 0.1s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {loading && <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }}/>}
                {loading ? 'Generating link…' : 'Get Reset Link'}
              </button>
            </form>
          ) : resetLink === '__not_found__' ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
              <p style={{ color: '#1D1D1F', fontWeight: 600, margin: '0 0 8px' }}>Check your account</p>
              <p style={{ color: '#6E6E73', fontSize: 14, margin: 0 }}>If that email is registered, a reset link has been generated.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#F0F7FF', border: '1px solid #B8D9F8', borderRadius: 12, padding: '16px' }}>
                <p style={{ color: '#0071E3', fontWeight: 600, margin: '0 0 8px', fontSize: 14 }}>Your reset link is ready</p>
                <p style={{ color: '#3C3C43', fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>
                  Copy and open this link to set a new password. It expires in 1 hour.
                </p>
                <div style={{
                  background: '#fff', border: '1px solid #D2D2D7', borderRadius: 8,
                  padding: '10px 12px', fontSize: 11, color: '#6E6E73',
                  wordBreak: 'break-all', lineHeight: 1.6, marginBottom: 10,
                }}>
                  {resetLink}
                </div>
                <button
                  onClick={copyLink}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 8,
                    background: copied ? '#34C759' : '#0071E3',
                    color: '#fff', border: 'none', fontSize: 14, fontWeight: 500,
                    fontFamily: 'inherit', cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>
              <Link href={resetLink} style={{
                display: 'block', textAlign: 'center', padding: '13px',
                borderRadius: 980, background: '#F5F5F7',
                color: '#0071E3', textDecoration: 'none', fontWeight: 500, fontSize: 15,
              }}>
                Open Reset Link →
              </Link>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6E6E73' }}>
            <Link href="/login" style={{ color: '#0071E3', textDecoration: 'none', fontWeight: 500 }}>Back to Sign In</Link>
          </p>
        </div>
      </div>
    </>
  )
}
