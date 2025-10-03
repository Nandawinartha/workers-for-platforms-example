'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  FolderIcon,
  RocketLaunchIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import clsx from 'clsx'
import toast from 'react-hot-toast'

interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'building' | 'error' | 'paused'
  last_deployment?: string
  created_at: string
  updated_at: string
  domains: string[]
  github_repo?: string
  build_command?: string
  output_directory?: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'my-awesome-app',
    description: 'A modern web application built with React and Node.js',
    status: 'active',
    last_deployment: '2024-01-15T10:30:00Z',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    domains: ['my-awesome-app.paas.dev'],
    github_repo: 'user/my-awesome-app',
    build_command: 'npm run build',
    output_directory: 'dist',
  },
  {
    id: '2',
    name: 'portfolio-site',
    description: 'Personal portfolio website showcasing my work',
    status: 'building',
    last_deployment: '2024-01-15T11:00:00Z',
    created_at: '2024-01-12T14:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
    domains: ['portfolio.paas.dev'],
    github_repo: 'user/portfolio-site',
    build_command: 'npm run build',
    output_directory: 'build',
  },
  {
    id: '3',
    name: 'api-backend',
    description: 'RESTful API backend for mobile application',
    status: 'error',
    last_deployment: '2024-01-15T09:45:00Z',
    created_at: '2024-01-08T16:30:00Z',
    updated_at: '2024-01-15T09:45:00Z',
    domains: ['api.paas.dev'],
    github_repo: 'user/api-backend',
    build_command: 'npm run build',
    output_directory: 'dist',
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleDeploy = async (projectId: string) => {
    try {
      toast.success('Deployment started!')
      // In a real app, you'd call the API here
    } catch (error) {
      toast.error('Failed to start deployment')
    }
  }

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        setProjects(projects.filter(p => p.id !== projectId))
        toast.success('Project deleted successfully')
      } catch (error) {
        toast.error('Failed to delete project')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your applications and deployments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(project.status)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                      )}
                    </div>
                  </div>
                  <Menu as="div" className="relative">
                    <Menu.Button className="p-1 text-gray-400 hover:text-gray-600">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Menu.Button>
                    <Transition
                      as={motion.div}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDeploy(project.id)}
                              className={clsx(
                                active ? 'bg-gray-100' : '',
                                'flex items-center w-full px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              <RocketLaunchIcon className="mr-3 h-4 w-4" />
                              Deploy
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={`/dashboard/projects/${project.id}`}
                              className={clsx(
                                active ? 'bg-gray-100' : '',
                                'flex items-center w-full px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              <FolderIcon className="mr-3 h-4 w-4" />
                              View Details
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDelete(project.id)}
                              className={clsx(
                                active ? 'bg-gray-100' : '',
                                'flex items-center w-full px-4 py-2 text-sm text-red-700'
                              )}
                            >
                              <XCircleIcon className="mr-3 h-4 w-4" />
                              Delete
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`badge ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  {project.last_deployment && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Last Deploy</span>
                      <span className="text-sm text-gray-900">
                        {formatDate(project.last_deployment)}
                      </span>
                    </div>
                  )}
                  
                  {project.domains.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Domain</span>
                      <span className="text-sm text-gray-900">
                        {project.domains[0]}
                      </span>
                    </div>
                  )}
                  
                  {project.github_repo && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Repository</span>
                      <span className="text-sm text-gray-900">
                        {project.github_repo}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleDeploy(project.id)}
                    className="flex-1 btn-primary text-sm"
                  >
                    <RocketLaunchIcon className="h-4 w-4 mr-1" />
                    Deploy
                  </button>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex-1 btn-secondary text-sm text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(project) => {
            setProjects([project, ...projects])
            setShowCreateModal(false)
            toast.success('Project created successfully!')
          }}
        />
      )}
    </div>
  )
}

function CreateProjectModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (project: Project) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    github_repo: '',
    build_command: 'npm run build',
    output_directory: 'dist',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        domains: [],
        github_repo: formData.github_repo,
        build_command: formData.build_command,
        output_directory: formData.output_directory,
      }
      
      onSuccess(newProject)
    } catch (error) {
      toast.error('Failed to create project')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field mt-1"
                placeholder="my-awesome-app"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field mt-1"
                rows={3}
                placeholder="A brief description of your project"
              />
            </div>
            
            <div>
              <label htmlFor="github_repo" className="block text-sm font-medium text-gray-700">
                GitHub Repository (Optional)
              </label>
              <input
                type="text"
                id="github_repo"
                value={formData.github_repo}
                onChange={(e) => setFormData({ ...formData, github_repo: e.target.value })}
                className="input-field mt-1"
                placeholder="username/repository"
              />
            </div>
            
            <div>
              <label htmlFor="build_command" className="block text-sm font-medium text-gray-700">
                Build Command
              </label>
              <input
                type="text"
                id="build_command"
                value={formData.build_command}
                onChange={(e) => setFormData({ ...formData, build_command: e.target.value })}
                className="input-field mt-1"
                placeholder="npm run build"
              />
            </div>
            
            <div>
              <label htmlFor="output_directory" className="block text-sm font-medium text-gray-700">
                Output Directory
              </label>
              <input
                type="text"
                id="output_directory"
                value={formData.output_directory}
                onChange={(e) => setFormData({ ...formData, output_directory: e.target.value })}
                className="input-field mt-1"
                placeholder="dist"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}