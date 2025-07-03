const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class MobileUtils {
  constructor() {
    this.deviceId = null;
    this.appPackage = null;
    this.mcpConnected = false;
  }

  /**
   * Initialize mobile device connection
   */
  async initializeDevice(deviceId) {
    try {
      this.deviceId = deviceId;
      
      // Check if device is available
      const { stdout } = await execAsync('adb devices');
      if (!stdout.includes(deviceId)) {
        throw new Error(`Device ${deviceId} not found`);
      }
      
      console.log(`✓ Mobile device ${deviceId} initialized`);
      this.mcpConnected = true;
    } catch (error) {
      console.error('✗ Failed to initialize mobile device:', error.message);
      throw error;
    }
  }

  /**
   * Launch mobile app
   */
  async launchApp(appPackage) {
    try {
      this.appPackage = appPackage;
      
      // First, try to launch with the main activity
      console.log(`🚀 Launching app: ${appPackage}`);
      
      // Get the main activity for the app
      const launchableCommand = `adb -s ${this.deviceId} shell cmd package resolve-activity --brief ${appPackage} | tail -n 1`;
      
      try {
        const { stdout } = await execAsync(launchableCommand);
        const mainActivity = stdout.trim();
        
        if (mainActivity && !mainActivity.includes('No activity found')) {
          const launchCommand = `adb -s ${this.deviceId} shell am start -n "${mainActivity}" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER`;
          await execAsync(launchCommand);
          console.log(`✓ App launched with activity: ${mainActivity}`);
        } else {
          throw new Error('Main activity not found');
        }
      } catch (activityError) {
        // Fallback to generic launch
        console.log('⚠️  Falling back to generic app launch');
        const fallbackCommand = `adb -s ${this.deviceId} shell monkey -p ${appPackage} -c android.intent.category.LAUNCHER 1`;
        await execAsync(fallbackCommand);
        console.log(`✓ App launched using monkey command`);
      }
      
      // Wait for app to load and stabilize
      await this.wait(5000);
      
      // Verify app is in foreground
      const isInForeground = await this.verifyAppInForeground();
      if (!isInForeground) {
        console.log('⚠️  App not in foreground, attempting to bring to front');
        // Try to bring app to foreground
        const bringToFrontCommand = `adb -s ${this.deviceId} shell am start -n ${appPackage}/.MainActivity -f 0x10200000`;
        await execAsync(bringToFrontCommand);
        await this.wait(3000);
      }
      
      console.log(`✓ App ${appPackage} launched successfully`);
      
    } catch (error) {
      console.error('✗ Failed to launch app:', error.message);
      throw error;
    }
  }

  /**
   * Verify app is in foreground
   */
  async verifyAppInForeground() {
    try {
      const command = `adb -s ${this.deviceId} shell dumpsys window | grep -E 'mCurrentFocus'`;
      const { stdout } = await execAsync(command);
      
      const isInForeground = stdout.includes(this.appPackage);
      console.log(`📱 App foreground status: ${isInForeground ? 'YES' : 'NO'}`);
      
      if (!isInForeground) {
        console.log(`   Current focus: ${stdout.trim()}`);
      }
      
      return isInForeground;
    } catch (error) {
      console.log('⚠️  Could not verify app foreground status');
      return false;
    }
  }

  /**
   * Get screen elements from real device UI dump
   */
  async getScreenElements(forceRefresh = false) {
    try {
      if (forceRefresh) {
        // Clear any cached dump first
        try {
          await execAsync(`adb -s ${this.deviceId} shell rm /sdcard/window_dump.xml`);
        } catch (e) {
          // File might not exist, ignore
        }
      }
      
      // Dump UI hierarchy to device storage
      const dumpCommand = `adb -s ${this.deviceId} shell uiautomator dump --compressed=false`;
      await execAsync(dumpCommand);
      
      // Small delay to ensure file is written
      await this.wait(500);
      
      // Pull the UI dump file from device
      const pullCommand = `adb -s ${this.deviceId} shell cat /sdcard/window_dump.xml`;
      const { stdout } = await execAsync(pullCommand);
      
      if (!stdout || stdout.trim().length === 0) {
        console.log('⚠️  Empty UI dump, trying alternative method');
        // Try alternative dump method
        const altCommand = `adb -s ${this.deviceId} exec-out uiautomator dump /dev/fd/1`;
        const { stdout: altStdout } = await execAsync(altCommand);
        return this.parseUIElements(altStdout);
      }
      
      // Parse the actual UI dump XML
      return this.parseUIElements(stdout);
    } catch (error) {
      console.error('✗ Failed to get screen elements:', error.message);
      // Fallback to coordinate-based interaction
      return [];
    }
  }

  /**
   * Parse UI elements from actual XML dump
   */
  parseUIElements(xmlContent) {
    if (!xmlContent) {
      return [];
    }

    const elements = [];
    
    try {
      // Extract elements using regex (simplified XML parsing)
      const nodePattern = /<node[^>]*>/g;
      const matches = xmlContent.match(nodePattern) || [];
      
      matches.forEach(match => {
        const element = this.extractElementInfo(match);
        if (element) {
          elements.push(element);
        }
      });
      
      console.log(`✓ Found ${elements.length} UI elements on screen`);
      return elements;
    } catch (error) {
      console.error('✗ Failed to parse UI elements:', error.message);
      return [];
    }
  }

  /**
   * Extract element information from XML node
   */
  extractElementInfo(nodeString) {
    try {
      const classMatch = nodeString.match(/class="([^"]*)"/);
      const textMatch = nodeString.match(/text="([^"]*)"/);
      const contentDescMatch = nodeString.match(/content-desc="([^"]*)"/);
      const boundsMatch = nodeString.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
      
      if (!boundsMatch) return null;
      
      const x = parseInt(boundsMatch[1]);
      const y = parseInt(boundsMatch[2]);
      const x2 = parseInt(boundsMatch[3]);
      const y2 = parseInt(boundsMatch[4]);
      
      const text = textMatch ? textMatch[1] : '';
      const contentDesc = contentDescMatch ? contentDescMatch[1] : '';
      const label = text || contentDesc;
      
      // Skip elements without meaningful labels
      if (!label && !classMatch) return null;
      
      return {
        type: classMatch ? classMatch[1] : 'unknown',
        text: text,
        label: label,
        contentDesc: contentDesc,
        coordinates: {
          x: x,
          y: y,
          width: x2 - x,
          height: y2 - y,
          centerX: Math.floor((x + x2) / 2),
          centerY: Math.floor((y + y2) / 2)
        }
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Tap by coordinates
   */
  async tapByCoordinates(x, y) {
    try {
      const command = `adb -s ${this.deviceId} shell input tap ${x} ${y}`;
      await execAsync(command);
      console.log(`✓ Tapped at coordinates (${x}, ${y})`);
      
      // Wait for tap to register
      await this.wait(1000);
    } catch (error) {
      console.error(`✗ Failed to tap at (${x}, ${y}):`, error.message);
      throw error;
    }
  }

  /**
   * Wait for element to appear
   */
  async waitForElement(elementText, timeout = 30000) {
    const startTime = Date.now();
    let attemptCount = 0;
    
    while (Date.now() - startTime < timeout) {
      attemptCount++;
      const elements = await this.getScreenElements();
      
      const found = elements.some(el => 
        (el.label && el.label.toLowerCase().includes(elementText.toLowerCase())) ||
        (el.text && el.text.toLowerCase().includes(elementText.toLowerCase())) ||
        (el.contentDesc && el.contentDesc.toLowerCase().includes(elementText.toLowerCase()))
      );
      
      if (found) {
        console.log(`✓ Element found: ${elementText} (attempt ${attemptCount})`);
        return true;
      }
      
      console.log(`⏳ Waiting for element: ${elementText} (attempt ${attemptCount})`);
      await this.wait(2000);
    }
    
    console.log(`✗ Element not found within timeout: ${elementText}`);
    return false;
  }

  /**
   * Find elements by text content
   */
  async findElementsByText(searchText) {
    const elements = await this.getScreenElements();
    return elements.filter(el => 
      (el.label && el.label.toLowerCase().includes(searchText.toLowerCase())) ||
      (el.text && el.text.toLowerCase().includes(searchText.toLowerCase())) ||
      (el.contentDesc && el.contentDesc.toLowerCase().includes(searchText.toLowerCase()))
    );
  }

  /**
   * Log all visible elements (for debugging)
   */
  async logAllElements() {
    const elements = await this.getScreenElements();
    console.log(`\n📱 Screen Elements (${elements.length} total):`);
    elements.forEach((el, index) => {
      const label = el.label || el.text || el.contentDesc || 'No text';
      console.log(`  ${index + 1}. ${el.type}: "${label}" at (${el.coordinates.centerX}, ${el.coordinates.centerY})`);
    });
    console.log('');
  }

  /**
   * Tap on an element by finding it with text content
   */
  async tapByText(searchText) {
    try {
      const elements = await this.findElementsByText(searchText);
      
      if (elements.length === 0) {
        throw new Error(`No element found with text: ${searchText}`);
      }
      
      if (elements.length > 1) {
        console.log(`⚠️  Multiple elements (${elements.length}) found with text: ${searchText}, using first one`);
      }
      
      const element = elements[0];
      const x = element.coordinates.centerX;
      const y = element.coordinates.centerY;
      
      console.log(`🎯 Tapping on "${searchText}" at (${x}, ${y})`);
      await this.tapByCoordinates(x, y);
      
      return true;
    } catch (error) {
      console.error(`✗ Failed to tap by text "${searchText}":`, error.message);
      return false;
    }
  }

  /**
   * Check if element exists by text
   */
  async elementExistsByText(searchText) {
    const elements = await this.findElementsByText(searchText);
    return elements.length > 0;
  }

  /**
   * Debug current app and screen state
   */
  async debugCurrentState() {
    console.log('\n🔍 DEBUG: Current Device State');
    
    try {
      // Check current activity
      const activityCommand = `adb -s ${this.deviceId} shell dumpsys window | grep -E 'mCurrentFocus'`;
      const { stdout: activity } = await execAsync(activityCommand);
      console.log(`   Current Focus: ${activity.trim()}`);
      
      // Check running apps
      const runningCommand = `adb -s ${this.deviceId} shell dumpsys activity activities | grep -E 'Running activities'`;
      try {
        const { stdout: running } = await execAsync(runningCommand);
        console.log(`   Running: ${running.trim()}`);
      } catch (e) {
        console.log('   Running: Could not determine');
      }
      
      // Check if our app is running
      const ourAppCommand = `adb -s ${this.deviceId} shell ps | grep ${this.appPackage}`;
      try {
        const { stdout: ourApp } = await execAsync(ourAppCommand);
        console.log(`   Our App Process: ${ourApp ? 'RUNNING' : 'NOT FOUND'}`);
      } catch (e) {
        console.log('   Our App Process: NOT FOUND');
      }
      
      // Get screen resolution
      const resCommand = `adb -s ${this.deviceId} shell wm size`;
      const { stdout: resolution } = await execAsync(resCommand);
      console.log(`   Screen: ${resolution.trim()}`);
      
    } catch (error) {
      console.log(`   Debug failed: ${error.message}`);
    }
    
    console.log('🔍 END DEBUG\n');
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(filename) {
    try {
      const command = `adb -s ${this.deviceId} shell screencap -p > ${filename}`;
      await execAsync(command);
      console.log(`✓ Screenshot saved: ${filename}`);
    } catch (error) {
      console.error('✗ Failed to take screenshot:', error.message);
      throw error;
    }
  }

  /**
   * Wait for app to load
   */
  async waitForAppToLoad(maxAttempts = 5) {
    console.log('⏳ Waiting for app to fully load...');
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`   Attempt ${attempt}/${maxAttempts}: Checking app state...`);
      
      // Wait for app initialization
      await this.wait(3000);
      
      // Check if app is in foreground
      const isInForeground = await this.verifyAppInForeground();
      
      if (isInForeground) {
        // Check if we have meaningful UI elements
        const elements = await this.getScreenElements();
        const meaningfulElements = elements.filter(el => 
          el.label || el.text || el.contentDesc
        );
        
        console.log(`   Found ${elements.length} total elements, ${meaningfulElements.length} with content`);
        
        if (meaningfulElements.length > 5) {
          console.log('✓ App loaded with sufficient UI content');
          return true;
        } else {
          console.log(`   Insufficient UI content, retrying... (attempt ${attempt}/${maxAttempts})`);
        }
      } else {
        console.log(`   App not in foreground, retrying... (attempt ${attempt}/${maxAttempts})`);
      }
      
      if (attempt < maxAttempts) {
        // Try to reactivate the app
        try {
          const reactivateCommand = `adb -s ${this.deviceId} shell am start -n ${this.appPackage}/.MainActivity -f 0x10200000`;
          await execAsync(reactivateCommand);
          console.log('   🔄 Attempted to reactivate app');
        } catch (error) {
          console.log('   ⚠️  Failed to reactivate app');
        }
      }
    }
    
    console.log('⚠️  App may not be fully loaded, continuing anyway');
    return false;
  }

  /**
   * Swipe gesture
   */
  async swipe(startX, startY, endX, endY, duration = 1000) {
    try {
      const command = `adb -s ${this.deviceId} shell input swipe ${startX} ${startY} ${endX} ${endY} ${duration}`;
      await execAsync(command);
      console.log(`✓ Swiped from (${startX}, ${startY}) to (${endX}, ${endY})`);
    } catch (error) {
      console.error('✗ Failed to swipe:', error.message);
      throw error;
    }
  }

  /**
   * Type text
   */
  async typeText(text) {
    try {
      const command = `adb -s ${this.deviceId} shell input text "${text}"`;
      await execAsync(command);
      console.log(`✓ Typed text: ${text}`);
    } catch (error) {
      console.error('✗ Failed to type text:', error.message);
      throw error;
    }
  }

  /**
   * Press back button
   */
  async pressBack() {
    try {
      const command = `adb -s ${this.deviceId} shell input keyevent 4`;
      await execAsync(command);
      console.log('✓ Back button pressed');
    } catch (error) {
      console.error('✗ Failed to press back:', error.message);
      throw error;
    }
  }

  /**
   * Wait utility
   */
  async wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Cleanup mobile session
   */
  async cleanup() {
    try {
      if (this.appPackage && this.deviceId) {
        const command = `adb -s ${this.deviceId} shell am force-stop ${this.appPackage}`;
        await execAsync(command);
        console.log('✓ Mobile session cleaned up');
      }
    } catch (error) {
      console.error('✗ Failed to cleanup mobile session:', error.message);
    }
  }
}

module.exports = { MobileUtils }; 