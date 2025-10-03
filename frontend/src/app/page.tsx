import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LandingPage from '@/components/landing/landing-page'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPage />
    </Suspense>
  )
}