// MongoDB Connection Test
// Run this to test your MongoDB connection

import { connectToDatabase } from '../lib/mongodb'

async function testConnection() {
  console.log('Testing MongoDB connection...')
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set')
  
  try {
    const { db } = await connectToDatabase()
    console.log('✅ MongoDB connection successful!')
    
    // Test database operations
    const collections = await db.listCollections().toArray()
    console.log('📋 Available collections:', collections.map(c => c.name))
    
    // Test a simple operation
    const testResult = await db.admin().ping()
    console.log('🏓 Ping result:', testResult)
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      
      if (error.message.includes('ECONNREFUSED')) {
        console.log('💡 Troubleshooting tips:')
        console.log('1. Check if your IP address is whitelisted in MongoDB Atlas')
        console.log('2. Verify your MongoDB Atlas cluster is running')
        console.log('3. Check your internet connection')
        console.log('4. Verify the connection string is correct')
      }
      
      if (error.message.includes('authentication failed')) {
        console.log('💡 Authentication issue:')
        console.log('1. Check your username and password in the connection string')
        console.log('2. Verify the database user has proper permissions')
      }
    }
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testConnection()
}

export default testConnection
