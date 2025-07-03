const fs = require('fs');
const path = require('path');

class ConfigUtils {
  static getWebConfig() {
    return {
      baseUrl: 'https://mo-admin.dev.pressingly.net/',
      credentials: {
        email: 'test@pressingly.net',
        password: 'Coderpush@123'
      },
      timeouts: {
        navigation: 30000,
        element: 10000,
        login: 15000
      },
      browser: {
        headless: process.env.CI === 'true',
        viewport: { width: 1920, height: 1080 },
        slowMo: 100
      }
    };
  }

  static getMobileConfig() {
    return {
      deviceId: 'emulator-5554',
      platform: 'Android',
      appPackage: 'com.pressingly.moneta.staging',
      appActivity: '.MainActivity',
      timeouts: {
        app_launch: 30000,
        element_wait: 10000,
        tap_delay: 1000
      },
      coordinates: {
        preferences_button: { x: 1200, y: 2896 },
        policy_toggle: { x: 720, y: 600 }
      }
    };
  }

  static getEnvironmentConfig() {
    const env = process.env.NODE_ENV || 'staging';
    
    const configs = {
      staging: {
        web: {
          baseUrl: 'https://mo-admin.dev.pressingly.net/',
          environment: '[STG] US Airlines'
        },
        mobile: {
          appPackage: 'com.pressingly.moneta.staging'
        }
      },
      production: {
        web: {
          baseUrl: 'https://mo-admin.pressingly.net/',
          environment: '[PROD] US Airlines'
        },
        mobile: {
          appPackage: 'com.pressingly.moneta'
        }
      },
      development: {
        web: {
          baseUrl: 'https://mo-admin.dev.pressingly.net/',
          environment: '[DEV] US Airlines'
        },
        mobile: {
          appPackage: 'com.pressingly.moneta.dev'
        }
      }
    };

    return configs[env] || configs.staging;
  }

  static loadExecutionResults() {
    try {
      const resultsPath = path.join(__dirname, '../../restuls/execution-results.json');
      const resultsData = fs.readFileSync(resultsPath, 'utf8');
      return JSON.parse(resultsData);
    } catch (error) {
      console.error('Failed to load execution results:', error.message);
      return null;
    }
  }

  static getTestConfig(testFileName) {
    const executionResults = this.loadExecutionResults();
    if (!executionResults) return null;

    const testFile = executionResults.testFiles.find(
      file => file.fileName === testFileName
    );

    if (!testFile) return null;

    // Extract configuration from automation context
    const config = {
      testId: testFile.fileName.replace('.md', ''),
      steps: testFile.steps.map(step => ({
        stepNumber: step.stepNumber,
        description: step.description,
        type: step.type,
        automationContext: step.automationContext
      }))
    };

    return config;
  }

  static getDeviceCapabilities() {
    return {
      android: {
        platformName: 'Android',
        deviceName: 'emulator-5554',
        app: null, // Will be set dynamically
        appPackage: null, // Will be set dynamically
        appActivity: '.MainActivity',
        noReset: true,
        fullReset: false,
        newCommandTimeout: 300000,
        automationName: 'UiAutomator2'
      },
      ios: {
        platformName: 'iOS',
        deviceName: 'iPhone Simulator',
        app: null, // Will be set dynamically
        bundleId: null, // Will be set dynamically
        noReset: true,
        fullReset: false,
        newCommandTimeout: 300000,
        automationName: 'XCUITest'
      }
    };
  }

  static getScreenshotConfig() {
    return {
      enabled: true,
      path: 'screenshots',
      onFailure: true,
      onSuccess: false,
      format: 'png',
      quality: 90
    };
  }

  static getReportingConfig() {
    return {
      reporter: 'html',
      outputDir: 'test-results',
      open: 'never',
      video: 'retain-on-failure',
      screenshot: 'only-on-failure'
    };
  }

  static validateConfig(config) {
    const required = ['baseUrl', 'credentials'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }
    
    return true;
  }

  static getTestData() {
    return {
      users: {
        admin: {
          email: 'test@pressingly.net',
          password: 'Coderpush@123',
          role: 'admin'
        },
        testUser: {
          email: 'quy.nguyen@coderpush.com',
          userId: '516e6462f1b6',
          fullUserId: '1e286130-102b-4311-8086-516e6462f1b6'
        }
      },
      environments: {
        staging: '[STG] US Airlines',
        development: '[DEV] US Airlines',
        production: '[PROD] US Airlines'
      }
    };
  }
}

module.exports = { ConfigUtils }; 