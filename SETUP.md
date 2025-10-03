# Cloudflare PaaS Setup Guide

This guide will help you set up and deploy the Cloudflare PaaS platform.

## Prerequisites

- Node.js 18 or higher
- Cloudflare account with Workers for Platforms access
- GitHub account (for OAuth integration)
- Git

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd cloudflare-paas
npm install
```

### 2. Set Up Cloudflare Resources

Run the deployment script to automatically set up all required resources:

```bash
./deploy.sh
```

This script will:
- Create a D1 database
- Create a dispatch namespace
- Update wrangler.toml with the correct IDs
- Set up all required secrets
- Deploy the backend

### 3. Manual Setup (Alternative)

If you prefer to set up manually:

#### Create D1 Database
```bash
npx wrangler d1 create cloudflare-paas
```

#### Create Dispatch Namespace
```bash
npx wrangler dispatch-namespace create cloudflare-paas
```

#### Update wrangler.toml
- Add your D1 database ID
- Add your dispatch namespace account ID

#### Set Secrets
```bash
echo "your-jwt-secret" | wrangler secret put JWT_SECRET
echo "your-github-client-id" | wrangler secret put GITHUB_CLIENT_ID
echo "your-github-client-secret" | wrangler secret put GITHUB_CLIENT_SECRET
echo "your-dispatch-api-token" | wrangler secret put DISPATCH_NAMESPACE_API_TOKEN
```

### 4. Set Up Frontend

```bash
cd frontend
npm install
```

Create environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
API_BASE_URL=http://localhost:8787
```

### 5. Run Development Servers

Backend:
```bash
npm run dev
```

Frontend (in another terminal):
```bash
cd frontend
npm run dev
```

## GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: Cloudflare PaaS
   - Homepage URL: http://localhost:3000 (for development)
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. Copy the Client ID and Client Secret

## Environment Variables Reference

### Backend (.dev.vars)
```bash
DISPATCH_NAMESPACE_ACCOUNT_ID=your-cloudflare-account-id
DISPATCH_NAMESPACE_API_TOKEN=your-cloudflare-api-token
JWT_SECRET=your-jwt-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Frontend (.env.local)
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
API_BASE_URL=http://localhost:8787
```

## Deployment

### Backend Deployment
```bash
npm run deploy
```

### Frontend Deployment

#### Vercel
```bash
cd frontend
npx vercel
```

#### Netlify
```bash
cd frontend
npm run build
# Upload dist folder to Netlify
```

## Troubleshooting

### Common Issues

1. **Database not found**: Make sure the D1 database ID is correctly set in wrangler.toml
2. **Dispatch namespace error**: Verify the namespace exists and the account ID is correct
3. **Authentication issues**: Check that GitHub OAuth credentials are correct
4. **CORS errors**: Ensure API_BASE_URL in frontend matches your backend URL

### Getting Help

- Check the logs: `npx wrangler tail`
- Verify secrets: `wrangler secret list`
- Test API endpoints: Use curl or Postman

## Production Considerations

1. **Domain Setup**: Configure custom domains in Cloudflare
2. **SSL Certificates**: Automatic SSL is handled by Cloudflare
3. **Monitoring**: Set up Cloudflare Analytics and Workers Analytics
4. **Backup**: Regular D1 database backups
5. **Security**: Review and update secrets regularly

## Next Steps

After successful setup:

1. Create your first project
2. Deploy a sample application
3. Set up custom domains
4. Configure monitoring and alerts
5. Set up billing (if applicable)

For more detailed information, see the main README.md file.