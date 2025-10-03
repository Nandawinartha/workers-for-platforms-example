import { Hono } from 'hono'
import { withDb, withCustomer } from './router'
import { 
  CreateProject, 
  GetProjectsByCustomer, 
  GetProjectById, 
  UpdateProject, 
  DeleteProject,
  CreateDeployment,
  GetDeploymentsByProject,
  UpdateDeployment
} from './db'
import { Env } from './env'

const projects = new Hono<{ Bindings: Env }>()

// Get all projects for the authenticated user
projects.get('/', withDb, withCustomer, async (c) => {
  try {
    const projects = await GetProjectsByCustomer(c.var.db, c.var.customer.id)
    return c.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return c.json({ error: 'Failed to fetch projects' }, 500)
  }
})

// Get a specific project
projects.get('/:id', withDb, withCustomer, async (c) => {
  try {
    const projectId = c.req.param('id')
    const project = await GetProjectById(c.var.db, projectId)
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    // Check if user owns this project
    if (project.customer_id !== c.var.customer.id) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
    
    return c.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    return c.json({ error: 'Failed to fetch project' }, 500)
  }
})

// Create a new project
projects.post('/', withDb, withCustomer, async (c) => {
  try {
    const { name, description, github_repo, build_command, output_directory } = await c.req.json()
    
    if (!name) {
      return c.json({ error: 'Project name is required' }, 400)
    }
    
    const projectResult = await CreateProject(c.var.db, {
      name,
      description,
      customer_id: c.var.customer.id,
      github_repo,
      build_command,
      output_directory,
    })
    
    if (!projectResult.success) {
      return c.json({ error: 'Failed to create project' }, 500)
    }
    
    const project = await GetProjectById(c.var.db, projectResult.meta.last_row_id)
    
    return c.json({ 
      message: 'Project created successfully',
      project 
    }, 201)
  } catch (error) {
    console.error('Create project error:', error)
    return c.json({ error: 'Failed to create project' }, 500)
  }
})

// Update a project
projects.put('/:id', withDb, withCustomer, async (c) => {
  try {
    const projectId = c.req.param('id')
    const updates = await c.req.json()
    
    // Check if project exists and user owns it
    const project = await GetProjectById(c.var.db, projectId)
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    if (project.customer_id !== c.var.customer.id) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
    
    const updateResult = await UpdateProject(c.var.db, projectId, updates)
    
    if (!updateResult.success) {
      return c.json({ error: 'Failed to update project' }, 500)
    }
    
    const updatedProject = await GetProjectById(c.var.db, projectId)
    
    return c.json({ 
      message: 'Project updated successfully',
      project: updatedProject 
    })
  } catch (error) {
    console.error('Update project error:', error)
    return c.json({ error: 'Failed to update project' }, 500)
  }
})

// Delete a project
projects.delete('/:id', withDb, withCustomer, async (c) => {
  try {
    const projectId = c.req.param('id')
    
    // Check if project exists and user owns it
    const project = await GetProjectById(c.var.db, projectId)
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    if (project.customer_id !== c.var.customer.id) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
    
    const deleteResult = await DeleteProject(c.var.db, projectId)
    
    if (!deleteResult.success) {
      return c.json({ error: 'Failed to delete project' }, 500)
    }
    
    return c.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    return c.json({ error: 'Failed to delete project' }, 500)
  }
})

// Deploy a project
projects.post('/:id/deploy', withDb, withCustomer, async (c) => {
  try {
    const projectId = c.req.param('id')
    const { commit_hash, commit_message } = await c.req.json()
    
    // Check if project exists and user owns it
    const project = await GetProjectById(c.var.db, projectId)
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    if (project.customer_id !== c.var.customer.id) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
    
    // Create deployment record
    const deploymentResult = await CreateDeployment(c.var.db, {
      project_id: projectId,
      status: 'building',
      commit_hash,
      commit_message,
    })
    
    if (!deploymentResult.success) {
      return c.json({ error: 'Failed to create deployment' }, 500)
    }
    
    // Update project status
    await UpdateProject(c.var.db, projectId, {
      status: 'building',
      last_deployment: new Date().toISOString(),
    })
    
    // In a real implementation, you would trigger the actual deployment here
    // For now, we'll simulate a successful deployment after a delay
    
    setTimeout(async () => {
      try {
        await UpdateDeployment(c.var.db, deploymentResult.meta.last_row_id, {
          status: 'success',
          duration: 45,
          url: `https://${project.name}.paas.dev`,
        })
        
        await UpdateProject(c.var.db, projectId, {
          status: 'active',
        })
      } catch (error) {
        console.error('Deployment completion error:', error)
        await UpdateDeployment(c.var.db, deploymentResult.meta.last_row_id, {
          status: 'error',
          logs: 'Deployment failed due to internal error',
        })
        
        await UpdateProject(c.var.db, projectId, {
          status: 'error',
        })
      }
    }, 5000) // Simulate 5 second deployment
    
    const deployment = await GetDeploymentsByProject(c.var.db, projectId, 1)
    
    return c.json({ 
      message: 'Deployment started',
      deployment: deployment[0] 
    }, 202)
  } catch (error) {
    console.error('Deploy project error:', error)
    return c.json({ error: 'Failed to start deployment' }, 500)
  }
})

// Get project deployments
projects.get('/:id/deployments', withDb, withCustomer, async (c) => {
  try {
    const projectId = c.req.param('id')
    const limit = parseInt(c.req.query('limit') || '10')
    
    // Check if project exists and user owns it
    const project = await GetProjectById(c.var.db, projectId)
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    if (project.customer_id !== c.var.customer.id) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
    
    const deployments = await GetDeploymentsByProject(c.var.db, projectId, limit)
    
    return c.json({ deployments })
  } catch (error) {
    console.error('Get deployments error:', error)
    return c.json({ error: 'Failed to fetch deployments' }, 500)
  }
})

export default projects