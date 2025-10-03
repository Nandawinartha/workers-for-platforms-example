'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon, 
  CheckIcon, 
  CloudIcon, 
  BoltIcon, 
  ShieldCheckIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const features = [
  {
    name: 'Serverless Functions',
    description: 'Deploy serverless functions with zero configuration. Auto-scaling and pay-per-use.',
    icon: BoltIcon,
  },
  {
    name: 'Global Edge Network',
    description: 'Your applications run on Cloudflare\'s global edge network for maximum performance.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Container Orchestration',
    description: 'Deploy containers with Durable Objects for stateful applications.',
    icon: CloudIcon,
  },
  {
    name: 'Built-in Security',
    description: 'DDoS protection, WAF, and security features built-in by default.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Developer Experience',
    description: 'GitHub integration, CLI tools, and comprehensive documentation.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Analytics & Monitoring',
    description: 'Real-time analytics, logging, and monitoring for your applications.',
    icon: ChartBarIcon,
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for personal projects and experimentation',
    features: [
      '100,000 requests/month',
      '1GB bandwidth',
      '1 project',
      'Community support',
      'Basic analytics',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$20',
    description: 'For growing applications and small teams',
    features: [
      '1M requests/month',
      '100GB bandwidth',
      '10 projects',
      'Priority support',
      'Advanced analytics',
      'Custom domains',
      'GitHub integration',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale applications and enterprises',
    features: [
      'Unlimited requests',
      'Unlimited bandwidth',
      'Unlimited projects',
      '24/7 support',
      'Custom analytics',
      'SLA guarantee',
      'On-premise deployment',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    await signIn('github', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gradient">Cloudflare PaaS</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-500 hover:text-gray-900">
                Sign In
              </Link>
              <button
                onClick={handleGitHubSignIn}
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Signing in...' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Deploy Anywhere,{' '}
              <span className="text-gradient">Scale Everywhere</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              The production-ready Platform as a Service built on Cloudflare Workers. 
              Compete with Vercel, Netlify, and Heroku with superior performance and global reach.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={handleGitHubSignIn}
                disabled={isLoading}
                className="btn-primary text-lg px-8 py-3"
              >
                Deploy Your First App
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              <Link href="#features" className="btn-secondary text-lg px-8 py-3">
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Cloudflare PaaS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on Cloudflare's global infrastructure with cutting-edge technologies
              for the modern developer experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`card p-8 relative ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    {plan.price !== 'Custom' && <span className="text-lg text-gray-500">/month</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Deploy Your Next Big Idea?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of developers who trust Cloudflare PaaS for their production applications.
          </p>
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-md font-medium text-lg transition-colors duration-200"
          >
            Start Building Today
            <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Cloudflare PaaS</h3>
              <p className="text-gray-400">
                The production-ready Platform as a Service built on Cloudflare Workers.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/status">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/community">Community</Link></li>
                <li><Link href="/security">Security</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Cloudflare PaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}