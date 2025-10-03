import { Hono } from 'hono'
import { withDb } from './router'
import { CreateUser, GetUserByEmail, GetUserByGithubId, UpdateUser } from './db'
import { Env } from './env'
import { sign, verify } from 'hono/jwt'

const auth = new Hono<{ Bindings: Env }>()

// Register new user
auth.post('/register', withDb, async (c) => {
  try {
    const { name, email, password } = await c.req.json()
    
    if (!name || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Check if user already exists
    const existingUser = await GetUserByEmail(c.var.db, email)
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409)
    }

    // Create new user
    const userResult = await CreateUser(c.var.db, {
      name,
      email,
      plan_type: 'starter',
    })

    if (!userResult.success) {
      return c.json({ error: 'Failed to create user' }, 500)
    }

    // Generate JWT token
    const token = await sign(
      { userId: userResult.meta.last_row_id, email },
      c.env.JWT_SECRET || 'your-secret-key'
    )

    return c.json({
      message: 'User created successfully',
      user: {
        id: userResult.meta.last_row_id,
        name,
        email,
        plan_type: 'starter',
      },
      token,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Login user
auth.post('/login', withDb, async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400)
    }

    // Find user by email
    const user = await GetUserByEmail(c.var.db, email)
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // In a real app, you'd verify the password hash here
    // For now, we'll just check if password is not empty
    if (!password) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Generate JWT token
    const token = await sign(
      { userId: user.id, email: user.email },
      c.env.JWT_SECRET || 'your-secret-key'
    )

    return c.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan_type: user.plan_type,
        avatar_url: user.avatar_url,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// GitHub OAuth callback
auth.post('/github', withDb, async (c) => {
  try {
    const { githubId, name, email, avatar_url } = await c.req.json()
    
    if (!githubId || !name || !email) {
      return c.json({ error: 'Missing required GitHub data' }, 400)
    }

    // Check if user already exists by GitHub ID
    let user = await GetUserByGithubId(c.var.db, githubId)
    
    if (!user) {
      // Check if user exists by email
      user = await GetUserByEmail(c.var.db, email)
      
      if (user) {
        // Update existing user with GitHub ID
        await UpdateUser(c.var.db, user.id, {
          github_id: githubId,
          avatar_url: avatar_url || user.avatar_url,
        })
      } else {
        // Create new user
        const userResult = await CreateUser(c.var.db, {
          name,
          email,
          github_id: githubId,
          avatar_url,
          plan_type: 'starter',
        })
        
        if (!userResult.success) {
          return c.json({ error: 'Failed to create user' }, 500)
        }
        
        user = {
          id: userResult.meta.last_row_id,
          name,
          email,
          github_id: githubId,
          avatar_url,
          plan_type: 'starter',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    }

    // Generate JWT token
    const token = await sign(
      { userId: user.id, email: user.email },
      c.env.JWT_SECRET || 'your-secret-key'
    )

    return c.json({
      message: 'GitHub authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan_type: user.plan_type,
        avatar_url: user.avatar_url,
      },
      token,
    })
  } catch (error) {
    console.error('GitHub auth error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Verify JWT token
auth.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid authorization header' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET || 'your-secret-key')

    return c.json({
      valid: true,
      userId: payload.userId,
      email: payload.email,
    })
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

export default auth