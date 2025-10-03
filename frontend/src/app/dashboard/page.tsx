'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  RocketLaunchIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useQuery } from 'react-query'

interface Project {
  id: string
  name: string
  status: 'active' | 'building' | 'error' | 'paused'
  lastDeployment: string
  deployments: number
  domains: string[]
}

interface Deployment {
  id: string
  projectId: string
  status: 'success' | 'building' | 'error' | 'cancelled'
  createdAt: string
  duration: number
  url: string
}

interface Analytics {
  totalRequests: number
  totalBandwidth: number
  averageResponseTime: number
  errorRate: number
  requestsTrend: 'up' | 'down'
  bandwidthTrend: 'up' | 'down'
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'my-awesome-app',
    status: 'active',
    lastDeployment: '2 minutes ago',
    deployments: 12,
    domains: ['my-awesome-app.paas.dev'],
  },
  {
    id: '2',
    name: 'portfolio-site',
    status: 'building',
    lastDeployment: 'Building...',
    deployments: 8,
    domains: ['portfolio.paas.dev'],
  },
  {
    id: '3',
    name: 'api-backend',
    status: 'error',
    lastDeployment: 'Failed 5 minutes ago',
    deployments: 3,
    domains: ['api.paas.dev'],
  },
]

const mockDeployments: Deployment[] = [
  {
    id: '1',
    projectId: '1',
    status: 'success',
    createdAt: '2 minutes ago',
    duration: 45,
    url: 'https://my-awesome-app.paas.dev',
  },
  {
    id: '2',
    projectId: '2',
    status: 'building',
    createdAt: '5 minutes ago',
    duration: 0,
    url: 'https://portfolio.paas.dev',
  },
  {
    id: '3',
    projectId: '3',
    status: 'error',
    createdAt: '10 minutes ago',
    duration: 0,
    url: 'https://api.paas.dev',
  },
]

const mockAnalytics: Analytics = {
  totalRequests: 1250000,
  totalBandwidth: 2.5,
  averageResponseTime: 45,
  errorRate: 0.02,
  requestsTrend: 'up',
  bandwidthTrend: 'up',
}

export default function DashboardPage() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [recentDeployments, setRecentDeployments] = useState<Deployment[]>([])

  useEffect(() => {
    // Simulate API calls
    setRecentProjects(mockProjects.slice(0, 3))
    setRecentDeployments(mockDeployments.slice(0, 5))
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'building':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'paused':
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'building':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'paused':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-primary-100">
          Your applications are running smoothly. Here's what's happening with your projects.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <RocketLaunchIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Deployments</p>
              <p className="text-2xl font-semibold text-gray-900">23</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Requests Today</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockAnalytics.totalRequests.toLocaleString()}
              </p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +12.5%
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockAnalytics.averageResponseTime}ms
              </p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                -5.2%
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Error Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(mockAnalytics.errorRate * 100).toFixed(2)}%
              </p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                -0.1%
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
              <Link href="/dashboard/projects" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(project.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.lastDeployment}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="text-sm text-gray-500">{project.deployments} deploys</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Deployments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Deployments</h3>
              <Link href="/dashboard/deployments" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentDeployments.map((deployment) => (
                <div key={deployment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(deployment.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {mockProjects.find(p => p.id === deployment.projectId)?.name}
                      </p>
                      <p className="text-sm text-gray-500">{deployment.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${getStatusColor(deployment.status)}`}>
                      {deployment.status}
                    </span>
                    {deployment.duration > 0 && (
                      <span className="text-sm text-gray-500">{deployment.duration}s</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/projects/new" className="btn-primary text-center">
              <RocketLaunchIcon className="h-5 w-5 mr-2" />
              Deploy New Project
            </Link>
            <Link href="/dashboard/domains" className="btn-secondary text-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Add Custom Domain
            </Link>
            <Link href="/dashboard/functions" className="btn-secondary text-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              Create Function
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}