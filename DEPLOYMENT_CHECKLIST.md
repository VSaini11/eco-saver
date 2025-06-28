# Pre-Deployment Checklist

## ✅ Before Deploying

### Code Preparation
- [ ] All changes committed to git
- [ ] `.env.local.example` is up to date
- [ ] Debug components removed from production
- [ ] No console.logs with sensitive data

### Environment Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0 or specific IPs)
- [ ] Connection string tested locally

### Deployment Platform Setup
- [ ] **MONGODB_URI** environment variable set
- [ ] **NEXT_PUBLIC_APP_URL** environment variable set to production URL
- [ ] Environment variables match your local `.env.local` (but with production URL)

## ✅ After Deploying

### Verification Steps
- [ ] Site loads without errors
- [ ] User registration form appears
- [ ] User creation works (try creating a test user)
- [ ] Data persists after refresh
- [ ] All forms work (transport, diet, water, electricity)
- [ ] Charts display data correctly

### If User Creation Fails
1. Check deployment platform logs
2. Verify environment variables are set correctly
3. Test MongoDB connection from deployment platform
4. Check MongoDB Atlas network access
5. Use debug endpoint: `https://your-domain.com/api/debug/production`

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "MongoDB URI not defined" | Set MONGODB_URI in deployment platform |
| "Authentication failed" | Check username/password in MongoDB URI |
| "Network timeout" | Add 0.0.0.0/0 to MongoDB Atlas network access |
| "User creation fails silently" | Check deployment logs for errors |
| "localhost:3000 redirect" | Update NEXT_PUBLIC_APP_URL to production URL |

## Platform-Specific Notes

### Vercel
- Environment variables: Project Settings → Environment Variables
- Logs: Functions tab → View logs
- Redeploy after env var changes

### Netlify  
- Environment variables: Site Settings → Environment Variables
- Logs: Functions tab → Function logs
- Clear cache and redeploy after changes

### Railway
- Environment variables: Project → Variables
- Logs: Deployments → View logs
- Auto-redeploys on env var changes
