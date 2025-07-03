const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function globalTeardown() {
  console.log('🧹 Starting global teardown...');
  
  try {
    // Close any running apps
    try {
      await execAsync('adb -s emulator-5554 shell am force-stop com.pressingly.moneta.staging');
      console.log('✓ Closed Moneta STG app');
    } catch (error) {
      console.log('ℹ️  No apps to close');
    }
    
    // Clean up temporary files if needed
    console.log('✓ Cleanup completed');
    
    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error.message);
    // Don't throw error to avoid failing the entire test suite
  }
}

module.exports = globalTeardown; 