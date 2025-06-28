# EcoSaver Setup Guide

## Quick Start

### 1. Environment Setup
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your actual values
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

### 4. Access the App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## MongoDB Atlas Setup

### Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account
3. Create a new cluster (free tier is fine)

### Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<cluster-name>` in your `.env.local`

### Configure Network Access
1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Save

## Production Deployment

### Environment Variables to Set
```bash
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/ecosaver?retryWrites=true&w=majority

# Optional (only needed for email links, external redirects, etc.)
# NEXT_PUBLIC_APP_URL=https://your-deployed-domain.com
```

### Platform-Specific Instructions

#### Vercel
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add both variables above
4. Redeploy

#### Netlify
1. Go to Site Settings
2. Environment Variables
3. Add both variables above
4. Redeploy

#### Railway
1. Go to your project dashboard
2. Variables tab
3. Add both variables above
4. Redeploy

## Troubleshooting

### User Creation Not Working in Production
1. ✅ Check environment variables are set in deployment platform
2. ✅ Verify MongoDB Atlas network access allows your deployment IPs
3. ✅ Check deployment logs for error messages
4. ✅ Test API endpoint directly: `POST /api/users`

### Connection Errors
- **Authentication failed**: Check username/password in MongoDB URI
- **Network timeout**: Check MongoDB Atlas network access settings
- **Database not found**: Ensure database name is correct in connection string

### Debug Tools (Development Only)
- API endpoint: `/api/debug/production` (GET/POST)
- Health check script: `node deployment-health-check.js <url>`

## Project Structure
```
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   └── page.tsx        # Main page
├── components/         # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── public/             # Static assets
```

## Features
- 🌱 Carbon footprint tracking
- 📊 Progress charts and analytics
- 🏆 Leaderboard
- 💡 Eco-friendly tips
- 🌙 Dark theme with animated gradients
- 📱 Responsive design
