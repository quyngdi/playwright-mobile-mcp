class MobilePage {
  constructor(mobileUtils) {
    this.mobileUtils = mobileUtils;
    
    // Mobile app selectors and coordinates based on execution results
    this.selectors = {
      navigation: {
        preferencesButton: {
          type: 'android.widget.Button',
          label: 'Preferences',
          coordinates: { x: 1200, y: 2896 }
        },
        exploreButton: {
          type: 'android.widget.Button', 
          label: 'Explore',
          coordinates: { x: 0, y: 2756 }
        },
        purchasesButton: {
          type: 'android.widget.Button',
          label: 'Purchases', 
          coordinates: { x: 480, y: 2756 }
        }
      },
      preferences: {
        approveFirstTransactionSwitch: {
          type: 'android.widget.Switch',
          label: 'Approve first transaction from a publisher',
          coordinates: { x: 720, y: 600 }
        },
        alertOrApproveSwitch: {
          type: 'android.widget.Switch',
          label: 'Alert or approve transactions exceeding',
          coordinates: { x: 28, y: 691 }
        },
        totalSpendingSwitch: {
          type: 'android.widget.Switch',
          label: 'Alert or approve transactions if total spending exceeds',
          coordinates: { x: 28, y: 873 }
        },
        spendingLimitButton: {
          type: 'android.widget.Button',
          label: 'Set spending limit for publishers',
          coordinates: { x: 28, y: 1097 }
        }
      },
      header: {
        userLabel: 'quy.nguyen',
        orgLabel: 'United Airlines'
      }
    };
  }

  // App lifecycle methods
  async launchApp(appPackage) {
    await this.mobileUtils.launchApp(appPackage);
    await this.mobileUtils.waitForAppToLoad();
  }

  async verifyAppLaunched() {
    const elements = await this.mobileUtils.getScreenElements();
    const userElement = elements.find(el => 
      el.label && el.label.includes(this.selectors.header.userLabel)
    );
    
    if (!userElement) {
      throw new Error('App not launched successfully - user element not found');
    }
    
    console.log('✓ App launched successfully with user logged in');
    return true;
  }

  async verifyOrganization(expectedOrg) {
    const elements = await this.mobileUtils.getScreenElements();
    const orgElement = elements.find(el => 
      el.label && el.label.includes(expectedOrg)
    );
    
    if (!orgElement) {
      throw new Error(`Organization ${expectedOrg} not found`);
    }
    
    console.log(`✓ Organization verified: ${expectedOrg}`);
    return true;
  }

  // Navigation methods
  async tapPreferences() {
    const coords = this.selectors.navigation.preferencesButton.coordinates;
    await this.mobileUtils.tapByCoordinates(coords.x, coords.y);
    await this.mobileUtils.waitForElement('Preferences');
  }

  async verifyPreferencesPage() {
    const expectedOptions = [
      'Approve first transaction from a publisher',
      'Alert or approve transactions exceeding',
      'Alert or approve transactions if total spending exceeds',
      'Set spending limit for publishers'
    ];
    
    const elements = await this.mobileUtils.getScreenElements();
    
    for (const option of expectedOptions) {
      const optionElement = elements.find(el => 
        el.label && el.label.includes(option)
      );
      
      if (!optionElement) {
        throw new Error(`Preferences option not found: ${option}`);
      }
      
      console.log(`✓ Found preferences option: ${option}`);
    }
    
    console.log('✓ All preferences options verified');
    return true;
  }

  // Policy interaction methods
  async toggleApproveFirstTransaction() {
    const coords = this.selectors.preferences.approveFirstTransactionSwitch.coordinates;
    await this.mobileUtils.tapByCoordinates(coords.x, coords.y);
    await this.mobileUtils.wait(1000);
  }

  async toggleAlertOrApprove() {
    const coords = this.selectors.preferences.alertOrApproveSwitch.coordinates;
    await this.mobileUtils.tapByCoordinates(coords.x, coords.y);
    await this.mobileUtils.wait(1000);
  }

  async toggleTotalSpending() {
    const coords = this.selectors.preferences.totalSpendingSwitch.coordinates;
    await this.mobileUtils.tapByCoordinates(coords.x, coords.y);
    await this.mobileUtils.wait(1000);
  }

  async tapSpendingLimit() {
    const coords = this.selectors.preferences.spendingLimitButton.coordinates;
    await this.mobileUtils.tapByCoordinates(coords.x, coords.y);
    await this.mobileUtils.wait(1000);
  }

  // Verification methods
  async verifyPolicyToggled(policyName) {
    const elements = await this.mobileUtils.getScreenElements();
    const policySwitch = elements.find(el => 
      el.type === 'android.widget.Switch' && 
      el.label && el.label.includes(policyName)
    );
    
    if (!policySwitch) {
      throw new Error(`Policy switch not found: ${policyName}`);
    }
    
    console.log(`✓ Policy switch verified: ${policyName}`);
    return true;
  }

  async verifyElementExists(elementLabel) {
    const elements = await this.mobileUtils.getScreenElements();
    const element = elements.find(el => 
      el.label && el.label.includes(elementLabel)
    );
    
    if (!element) {
      throw new Error(`Element not found: ${elementLabel}`);
    }
    
    console.log(`✓ Element verified: ${elementLabel}`);
    return true;
  }

  // Utility methods
  async takeScreenshot(filename) {
    await this.mobileUtils.takeScreenshot(filename);
  }

  async getScreenElements() {
    return await this.mobileUtils.getScreenElements();
  }

  async waitForElement(elementLabel, timeout = 30000) {
    return await this.mobileUtils.waitForElement(elementLabel, timeout);
  }

  async swipeUp() {
    await this.mobileUtils.swipe(500, 1500, 500, 500);
  }

  async swipeDown() {
    await this.mobileUtils.swipe(500, 500, 500, 1500);
  }

  async pressBack() {
    await this.mobileUtils.pressBack();
  }

  async wait(milliseconds) {
    await this.mobileUtils.wait(milliseconds);
  }

  // Custom tap methods for specific elements
  async tapByCoordinates(x, y) {
    await this.mobileUtils.tapByCoordinates(x, y);
  }

  async tapElementByLabel(label) {
    const elements = await this.mobileUtils.getScreenElements();
    const element = elements.find(el => 
      el.label && el.label.includes(label)
    );
    
    if (!element) {
      throw new Error(`Element not found: ${label}`);
    }
    
    const centerX = element.coordinates.x + element.coordinates.width / 2;
    const centerY = element.coordinates.y + element.coordinates.height / 2;
    
    await this.mobileUtils.tapByCoordinates(centerX, centerY);
  }

  // Cleanup
  async cleanup() {
    await this.mobileUtils.cleanup();
  }
}

module.exports = { MobilePage }; 