import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'B2B Sales Job',
  description: 'B2B SaaS Market Intelligence — daily updated SDR/BDR hiring tracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
