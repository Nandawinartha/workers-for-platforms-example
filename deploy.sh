#!/bin/bash

# Cloudflare PaaS Deployment Script
# This script helps you deploy the Cloudflare PaaS platform

set -e

echo "🚀 Cloudflare PaaS Deployment Script"
echo "====================================="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Please install it first:"
    echo "   npm install -g wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "❌ You are not logged in to Cloudflare. Please run:"
    echo "   wrangler login"
    exit 1
fi

echo "✅ Wrangler CLI is installed and you are logged in"

# Create D1 database if it doesn't exist
echo "📦 Setting up D1 database..."
if ! wrangler d1 list | grep -q "cloudflare-paas"; then
    echo "Creating D1 database..."
    wrangler d1 create cloudflare-paas
    echo "✅ D1 database created"
else
    echo "✅ D1 database already exists"
fi

# Create dispatch namespace if it doesn't exist
echo "📦 Setting up dispatch namespace..."
if ! wrangler dispatch-namespace list | grep -q "cloudflare-paas"; then
    echo "Creating dispatch namespace..."
    wrangler dispatch-namespace create cloudflare-paas
    echo "✅ Dispatch namespace created"
else
    echo "✅ Dispatch namespace already exists"
fi

# Update wrangler.toml with database ID
echo "📝 Updating wrangler.toml..."
DB_ID=$(wrangler d1 list | grep "cloudflare-paas" | awk '{print $2}')
if [ ! -z "$DB_ID" ]; then
    sed -i "s/database_id = \"\"/database_id = \"$DB_ID\"/" wrangler.toml
    echo "✅ Database ID updated in wrangler.toml"
fi

# Set up secrets
echo "🔐 Setting up secrets..."
echo "Please provide the following secrets:"

read -p "JWT Secret (press Enter to generate): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT Secret: $JWT_SECRET"
fi

read -p "GitHub Client ID: " GITHUB_CLIENT_ID
read -p "GitHub Client Secret: " GITHUB_CLIENT_SECRET
read -p "Dispatch Namespace API Token: " DISPATCH_API_TOKEN

# Set secrets
echo "$JWT_SECRET" | wrangler secret put JWT_SECRET
echo "$GITHUB_CLIENT_ID" | wrangler secret put GITHUB_CLIENT_ID
echo "$GITHUB_CLIENT_SECRET" | wrangler secret put GITHUB_CLIENT_SECRET
echo "$DISPATCH_API_TOKEN" | wrangler secret put DISPATCH_NAMESPACE_API_TOKEN

echo "✅ Secrets configured"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy the worker
echo "🚀 Deploying to Cloudflare Workers..."
wrangler deploy

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Set up your frontend: cd frontend && npm install"
echo "2. Configure frontend environment variables"
echo "3. Deploy frontend to Vercel/Netlify"
echo ""
echo "Your backend is now live at: https://cloudflare-paas.your-subdomain.workers.dev"
echo ""
echo "For more information, see the README.md file."