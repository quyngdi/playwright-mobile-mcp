class WebUtils {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL with retry logic
   */
  async navigateWithRetry(url, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.goto(url, { waitUntil: 'networkidle' });
        return;
      } catch (error) {
        lastError = error;
        console.warn(`Navigation attempt ${i + 1} failed: ${error.message}`);
        if (i < maxRetries - 1) {
          await this.page.waitForTimeout(2000);
        }
      }
    }
    throw lastError;
  }

  /**
   * Wait for an element to be visible with timeout
   */
  async waitForElementVisible(selector, timeout = 30000) {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
      return true;
    } catch (error) {
      console.error(`Element not found: ${selector}`);
      return false;
    }
  }

  /**
   * Fill form fields with validation
   */
  async fillFormField(selector, value, fieldName = 'Field') {
    try {
      const element = await this.page.locator(selector);
      await element.fill(value);
      console.log(`✓ ${fieldName} filled successfully`);
    } catch (error) {
      console.error(`✗ Failed to fill ${fieldName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click element with retry logic
   */
  async clickWithRetry(selector, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.locator(selector).click();
        return;
      } catch (error) {
        lastError = error;
        console.warn(`Click attempt ${i + 1} failed: ${error.message}`);
        if (i < maxRetries - 1) {
          await this.page.waitForTimeout(1000);
        }
      }
    }
    throw lastError;
  }

  /**
   * Wait for URL to change
   */
  async waitForUrlChange(expectedUrl, timeout = 30000) {
    try {
      await this.page.waitForURL(expectedUrl, { timeout });
      return true;
    } catch (error) {
      console.error(`URL change timeout: Expected ${expectedUrl}, got ${this.page.url()}`);
      return false;
    }
  }

  /**
   * Take screenshot with timestamp
   */
  async takeTimestampedScreenshot(prefix = 'screenshot') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${prefix}-${timestamp}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
    console.log(`Screenshot saved: ${filename}`);
    return filename;
  }

  /**
   * Handle authentication forms
   */
  async performLogin(credentials) {
    try {
      // Fill email
      await this.page.getByRole('textbox', { name: /email/i }).fill(credentials.email);
      
      // Fill password
      await this.page.getByRole('textbox', { name: /password/i }).fill(credentials.password);
      
      // Click sign in button
      await this.page.getByRole('button', { name: /sign in/i }).click();
      
      console.log('✓ Login form submitted');
    } catch (error) {
      console.error('✗ Login failed:', error.message);
      throw error;
    }
  }

  /**
   * Handle dropdown selections
   */
  async selectFromDropdown(dropdownSelector, optionSelector) {
    try {
      // Open dropdown
      await this.page.locator(dropdownSelector).click();
      
      // Wait for options to appear
      await this.page.waitForTimeout(1000);
      
      // Select option
      await this.page.locator(optionSelector).click();
      
      console.log('✓ Dropdown option selected');
    } catch (error) {
      console.error('✗ Dropdown selection failed:', error.message);
      throw error;
    }
  }

  /**
   * Verify multiple elements exist
   */
  async verifyElementsExist(selectors) {
    const results = [];
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        results.push({ selector, exists: true });
        console.log(`✓ Element verified: ${selector}`);
      } catch (error) {
        results.push({ selector, exists: false, error: error.message });
        console.log(`✗ Element not found: ${selector}`);
      }
    }
    return results;
  }

  /**
   * Extract text from element
   */
  async extractTextFromElement(selector) {
    try {
      const element = this.page.locator(selector);
      const text = await element.textContent();
      return text?.trim() || '';
    } catch (error) {
      console.error(`Failed to extract text from ${selector}:`, error.message);
      return '';
    }
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { WebUtils }; 