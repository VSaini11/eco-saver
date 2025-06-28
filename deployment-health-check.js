#!/usr/bin/env node

/**
 * Deployment Health Check Script
 * Run this after deploying to verify everything works
 * 
 * Usage: node deployment-health-check.js <your-deployed-url>
 * Example: node deployment-health-check.js https://your-app.vercel.app
 */

const https = require('https');
const http = require('http');

const DEPLOYMENT_URL = process.argv[2];

if (!DEPLOYMENT_URL) {
  console.error('❌ Please provide your deployment URL');
  console.error('Usage: node deployment-health-check.js <url>');
  console.error('Example: node deployment-health-check.js https://your-app.vercel.app');
  process.exit(1);
}

console.log(`🔍 Testing deployment: ${DEPLOYMENT_URL}`);
console.log('=' * 50);

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function runHealthChecks() {
  console.log('\n1. Testing basic connectivity...');
  try {
    const response = await makeRequest(DEPLOYMENT_URL);
    if (response.status === 200) {
      console.log('✅ Site is accessible');
    } else {
      console.log(`⚠️  Site returned status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Site not accessible: ${error.message}`);
    return;
  }

  console.log('\n2. Testing production debug endpoint...');
  try {
    const debugResponse = await makeRequest(`${DEPLOYMENT_URL}/api/debug/production`);
    if (debugResponse.status === 200) {
      console.log('✅ Debug endpoint accessible');
      console.log('📊 Environment check:');
      console.log(`   - Environment: ${debugResponse.data.environment}`);
      console.log(`   - MongoDB URI set: ${debugResponse.data.envVars.mongoUri ? '✅' : '❌'}`);
      console.log(`   - App URL: ${debugResponse.data.envVars.appUrl || 'Not set'}`);
      console.log(`   - Connection status: ${debugResponse.data.connection.status}`);
      
      if (debugResponse.data.connection.error) {
        console.log(`   - Connection error: ${debugResponse.data.connection.error}`);
      }
      
      if (debugResponse.data.connection.userCount !== undefined) {
        console.log(`   - Users in database: ${debugResponse.data.connection.userCount}`);
      }
    } else {
      console.log(`❌ Debug endpoint failed: ${debugResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Debug endpoint error: ${error.message}`);
  }

  console.log('\n3. Testing user creation...');
  try {
    const userResponse = await makeRequest(`${DEPLOYMENT_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: `healthcheck-${Date.now()}@example.com`,
        name: 'Health Check User'
      })
    });
    
    if (userResponse.status === 200 && userResponse.data.success) {
      console.log('✅ User creation successful');
      console.log(`   - User ID: ${userResponse.data.data._id}`);
    } else {
      console.log(`❌ User creation failed: ${userResponse.data.error || 'Unknown error'}`);
      if (userResponse.data.debug) {
        console.log('   - Debug info:', JSON.stringify(userResponse.data.debug, null, 2));
      }
    }
  } catch (error) {
    console.log(`❌ User creation error: ${error.message}`);
  }

  console.log('\n4. Testing user creation endpoint test...');
  try {
    const testResponse = await makeRequest(`${DEPLOYMENT_URL}/api/debug/production`, {
      method: 'POST'
    });
    
    if (testResponse.status === 200 && testResponse.data.success) {
      console.log('✅ Internal user creation test passed');
    } else {
      console.log(`❌ Internal user creation test failed: ${testResponse.data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Test endpoint error: ${error.message}`);
  }

  console.log('\n' + '=' * 50);
  console.log('🎯 Next steps if tests failed:');
  console.log('1. Check your deployment platform environment variables');
  console.log('2. Verify MongoDB Atlas network access settings');
  console.log('3. Check deployment logs for detailed errors');
  console.log('4. Visit your app and check the Production Debug panel');
}

runHealthChecks().catch(console.error);
