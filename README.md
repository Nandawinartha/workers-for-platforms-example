# Cloudflare PaaS - Production-Ready Platform as a Service

A comprehensive Platform as a Service (PaaS) built on Cloudflare Workers that competes with Vercel, Netlify, and Heroku. This project provides a modern, scalable platform for deploying applications with superior performance and global reach.

## 🚀 Features

### Core Platform Features
- **Serverless Functions**: Deploy serverless functions with zero configuration
- **Container Orchestration**: Deploy containers with Durable Objects for stateful applications
- **Global Edge Network**: Applications run on Cloudflare's global edge network
- **Built-in Security**: DDoS protection, WAF, and security features built-in
- **Auto-scaling**: Pay-per-use model with automatic scaling

### Developer Experience
- **Modern UI/UX**: Beautiful, responsive dashboard built with Next.js and Tailwind CSS
- **GitHub Integration**: Seamless CI/CD with GitHub webhooks and auto-deployments
- **CLI Tools**: Command-line interface for local development and deployment
- **API Documentation**: Comprehensive API documentation and developer tools
- **Real-time Analytics**: Live metrics, logging, and monitoring

### Authentication & Security
- **OAuth Integration**: GitHub OAuth for easy sign-in
- **JWT Authentication**: Secure token-based authentication
- **API Keys**: Generate and manage API keys for programmatic access
- **Rate Limiting**: Built-in rate limiting and DDoS protection
- **SSL Certificates**: Automatic SSL certificate management

### Project Management
- **Project Dashboard**: Manage multiple projects from a single interface
- **Deployment History**: Track all deployments with detailed logs
- **Custom Domains**: Add custom domains with automatic SSL
- **Environment Variables**: Manage environment variables per project
- **Database Services**: Integrated D1, KV, and R2 storage services

## 🏗️ Architecture

### Backend (Cloudflare Workers)
- **Hono Framework**: Fast, lightweight web framework for Workers
- **D1 Database**: SQLite database for persistent storage
- **Workers for Platforms**: Dynamic dispatch namespaces for multi-tenant architecture
- **Durable Objects**: Stateful services and container orchestration
- **JWT Authentication**: Secure authentication with JSON Web Tokens

### Frontend (Next.js)
- **React 18**: Modern React with server-side rendering
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **TypeScript**: Type-safe development experience
- **NextAuth.js**: Authentication library with OAuth support
- **React Query**: Data fetching and caching
- **Framer Motion**: Smooth animations and transitions

## 🛠️ Tech Stack

### Backend
- **Cloudflare Workers**: Serverless compute platform
- **Hono**: Web framework for Workers
- **D1**: Serverless SQL database
- **Workers for Platforms**: Multi-tenant architecture
- **Durable Objects**: Stateful compute

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **NextAuth.js**: Authentication
- **React Query**: Data fetching
- **Framer Motion**: Animations
- **Heroicons**: Icon library

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Cloudflare account with Workers for Platforms access
- GitHub account (for OAuth)

### Backend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create D1 database**:
   ```bash
   npx wrangler d1 create cloudflare-paas
   ```

3. **Create dispatch namespace**:
   ```bash
   npx wrangler dispatch-namespace create cloudflare-paas
   ```

4. **Set up environment variables**:
   ```bash
   # Set secrets
   echo "your-jwt-secret" | wrangler secret put JWT_SECRET
   echo "your-github-client-id" | wrangler secret put GITHUB_CLIENT_ID
   echo "your-github-client-secret" | wrangler secret put GITHUB_CLIENT_SECRET
   echo "your-dispatch-api-token" | wrangler secret put DISPATCH_NAMESPACE_API_TOKEN
   ```

5. **Update wrangler.toml**:
   - Add your D1 database ID
   - Add your dispatch namespace account ID
   - Configure your domain

6. **Deploy the backend**:
   ```bash
   npm run deploy
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Backend Deployment
```bash
# Deploy to Cloudflare Workers
npm run deploy

# View logs
npx wrangler tail
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
npm run deploy
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/github` - GitHub OAuth callback
- `GET /api/auth/verify` - Verify JWT token

### Project Management
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/deploy` - Deploy project
- `GET /api/projects/:id/deployments` - Get deployment history

### Legacy Workers API
- `GET /script` - List customer scripts
- `PUT /script/:name` - Upload/update script
- `GET /dispatch/:name` - Execute script

## 🔧 Configuration

### Environment Variables

#### Backend (.dev.vars)
```bash
DISPATCH_NAMESPACE_ACCOUNT_ID=your-account-id
DISPATCH_NAMESPACE_API_TOKEN=your-api-token
JWT_SECRET=your-jwt-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Frontend (.env.local)
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
API_BASE_URL=http://localhost:8787
```

## 🧪 Development

### Running Locally

1. **Start backend**:
   ```bash
   npm run start
   ```

2. **Start frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8787

### Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd frontend
npm test

# Run linting
npm run lint
```

## 📈 Monitoring & Analytics

- **Real-time Metrics**: Request counts, response times, error rates
- **Deployment Tracking**: Build times, success rates, rollback capabilities
- **Usage Analytics**: Bandwidth, compute time, storage usage
- **Error Monitoring**: Detailed error logs and stack traces
- **Performance Insights**: Core Web Vitals and performance metrics

## 🔒 Security Features

- **DDoS Protection**: Built-in Cloudflare DDoS protection
- **WAF**: Web Application Firewall with customizable rules
- **Rate Limiting**: Per-user and per-endpoint rate limiting
- **SSL/TLS**: Automatic SSL certificate management
- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)

## 🌍 Global Infrastructure

- **Edge Computing**: Deploy applications to 200+ cities worldwide
- **CDN**: Global content delivery network for static assets
- **DNS**: Fast, reliable DNS resolution
- **Load Balancing**: Intelligent load balancing across regions
- **Failover**: Automatic failover and disaster recovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.cloudflare-paas.com](https://docs.cloudflare-paas.com)
- **Community**: [Discord Server](https://discord.gg/cloudflare-paas)
- **Issues**: [GitHub Issues](https://github.com/your-org/cloudflare-paas/issues)
- **Email**: support@cloudflare-paas.com

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Modern UI/UX with React/Next.js
- ✅ Authentication system (OAuth, JWT)
- ✅ User dashboard with project management
- ✅ Basic deployment system
- ✅ API documentation

### Phase 2 (Next)
- 🔄 CI/CD integration with GitHub
- 🔄 Container orchestration with Durable Objects
- 🔄 Database services (D1, KV, R2) management
- 🔄 Custom domains and SSL management
- 🔄 Billing and subscription management

### Phase 3 (Future)
- ⏳ Advanced monitoring and alerting
- ⏳ Multi-region deployment
- ⏳ Enterprise features
- ⏳ Marketplace for templates
- ⏳ Advanced security features

---

**Built with ❤️ on Cloudflare Workers**