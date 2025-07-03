const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function globalSetup() {
  console.log('🚀 Starting global setup...');
  
  try {
    // Check if Android emulator is running
    const { stdout } = await execAsync('adb devices');
    if (!stdout.includes('emulator-5554')) {
      console.warn('⚠️  Android emulator not found. Please ensure emulator-5554 is running.');
      console.log('   Run: emulator -avd YourAVDName -no-snapshot-load -no-snapshot-save');
    } else {
      console.log('✓ Android emulator is running');
    }
    
    // Check if required app is installed
    try {
      const { stdout: packages } = await execAsync('adb -s emulator-5554 shell pm list packages | grep moneta');
      if (packages.includes('com.pressingly.moneta.staging')) {
        console.log('✓ Moneta STG app is installed');
      } else {
        console.warn('⚠️  Moneta STG app not found. Please install the app first.');
      }
    } catch (error) {
      console.warn('⚠️  Could not check app installation status');
    }
    
    // Create screenshots directory
    const fs = require('fs');
    const path = require('path');
    const screenshotsDir = path.join(__dirname, '../../screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
      console.log('✓ Screenshots directory created');
    }
    
    // Create test-results directory
    const testResultsDir = path.join(__dirname, '../test-results');
    if (!fs.existsSync(testResultsDir)) {
      fs.mkdirSync(testResultsDir, { recursive: true });
      console.log('✓ Test results directory created');
    }
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error.message);
    throw error;
  }
}

module.exports = globalSetup; 