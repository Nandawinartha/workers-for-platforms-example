import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cloudflare PaaS - Deploy Anywhere, Scale Everywhere',
  description: 'Production-ready Platform as a Service built on Cloudflare Workers, competing with Vercel, Netlify, and Heroku.',
  keywords: ['PaaS', 'Cloudflare', 'Serverless', 'Deployment', 'Platform'],
  authors: [{ name: 'Cloudflare PaaS Team' }],
  openGraph: {
    title: 'Cloudflare PaaS - Deploy Anywhere, Scale Everywhere',
    description: 'Production-ready Platform as a Service built on Cloudflare Workers',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloudflare PaaS - Deploy Anywhere, Scale Everywhere',
    description: 'Production-ready Platform as a Service built on Cloudflare Workers',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}