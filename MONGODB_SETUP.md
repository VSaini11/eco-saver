# EcoSaver Tracker - MongoDB Setup Guide

## MongoDB Integration

This project uses MongoDB to store all daily carbon footprint data, user information, and statistics.

### Features

1. **Automatic Data Persistence**: All form data is automatically saved to MongoDB after a short delay
2. **Daily Data Loading**: Previous day's data is automatically loaded when you visit the app
3. **User Statistics**: Real-time calculation of weekly averages and monthly totals
4. **Data History**: Complete history of all your carbon footprint entries

### MongoDB Setup Options

#### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition**:
   - Download from: https://www.mongodb.com/try/download/community
   - Follow installation instructions for your operating system

2. **Start MongoDB Service**:
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify Connection**:
   ```bash
   mongosh
   # Should connect to mongodb://localhost:27017
   ```

#### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**: Sign up at https://cloud.mongodb.com
2. **Create Cluster**: Choose free tier (M0)
3. **Get Connection String**: Replace `<username>`, `<password>`, and cluster details
4. **Update .env.local**: Use the Atlas connection string

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/ecosaver

# For MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecosaver?retryWrites=true&w=majority

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Collections

The app automatically creates these collections:

1. **users**: User profiles with statistics
   - email, name, totalFootprint, weeklyAverage, monthlyTotal
   
2. **footprints**: Daily carbon footprint entries
   - userId, date, transport, electricity, diet, water, total

### Key Features

#### Auto-Save Functionality
- Data is saved automatically 2 seconds after any change
- No need to manually click "Save" for individual form entries
- Real-time updates to user statistics

#### Daily Data Persistence
- When you return to the app, it loads your current day's data
- Seamless continuation of data entry
- Historical data visualization

#### Enhanced User Experience
- Loading states while fetching data
- Error handling for connection issues
- Visual feedback for saved data

### API Endpoints

- `POST /api/users` - Create or get user
- `GET /api/users?email=<email>` - Get user by email
- `POST /api/footprint` - Save daily footprint data
- `GET /api/footprint?userId=<id>` - Get footprint history
- `GET /api/footprint?userId=<id>&today=true` - Get today's data

### Running the Application

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Start MongoDB** (if using local installation)

3. **Run Development Server**:
   ```bash
   pnpm dev
   ```

4. **Open Application**: Navigate to http://localhost:3000

### Troubleshooting

#### Common Issues

1. **"MongoServerError: connect ECONNREFUSED"**
   - Ensure MongoDB service is running
   - Check MONGODB_URI in .env.local

2. **"Invalid connection string"**
   - Verify MongoDB Atlas connection string
   - Ensure username/password are URL-encoded

3. **"Database connection timeout"**
   - Check internet connection (for Atlas)
   - Verify firewall settings

#### Development Tips

- Use MongoDB Compass for visual database inspection
- Check browser console for detailed error messages
- Monitor network tab for API request/response details

### Data Backup

For production use, consider implementing:
- Regular database backups
- Data export functionality
- User data privacy controls
