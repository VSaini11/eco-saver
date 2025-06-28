# Production Deployment Debug - User Creation Issue

## CURRENT ISSUE: User creation works locally but not in production

### Quick Diagnosis Steps:

1. **Visit your deployed app** - You should now see a "Production Debug" panel at the top
2. **Check the debug panel** - It will show:
   - Environment variables status
   - MongoDB connection status
   - User count in database
   - Option to test user creation

### Most Common Fixes:

#### 1. Environment Variables Missing
**Problem**: MONGODB_URI not set in production
**Fix**: Add to your deployment platform:

**For Vercel:**
```bash
# In Vercel Dashboard → Settings → Environment Variables
MONGODB_URI=mongodb+srv://vaibhavsaini709:Qo3xaK0VBCmZGbl0@cluster0.hmvwdyv.mongodb.net/ecosaver?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**For Netlify:**
```bash
# In Netlify Dashboard → Site Settings → Environment Variables  
MONGODB_URI=mongodb+srv://vaibhavsaini709:Qo3xaK0VBCmZGbl0@cluster0.hmvwdyv.mongodb.net/ecosaver?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
```

#### 2. MongoDB Atlas Network Access
**Problem**: Production server IP not allowed
**Fix**:
1. Go to MongoDB Atlas Dashboard
2. Navigate to "Network Access" 
3. Click "Add IP Address"
4. Add `0.0.0.0/0` (allows all IPs) **OR** your deployment platform's IPs
5. Save changes

#### 3. Production URL Issue  
**Problem**: App URL still set to localhost
**Fix**: Update `NEXT_PUBLIC_APP_URL` to your actual deployment URL

### Advanced Debugging:

#### Test API Directly:
```bash
# Test with curl or Postman
curl -X POST https://your-domain.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

#### Check Deployment Logs:
- **Vercel**: Functions tab → View logs
- **Netlify**: Functions tab → Logs  
- **Railway**: Deployments → View logs

### Manual Test Script:
If debug panel shows issues, run this in your browser console on the deployed site:

```javascript
// Test user creation manually
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'debug@test.com', name: 'Debug User' })
})
.then(res => res.json())
.then(data => console.log('User creation result:', data))
.catch(err => console.error('Error:', err))
```
