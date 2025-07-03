class MOAdminPage {
  constructor(page) {
    this.page = page;
    
    // Login page selectors
    this.selectors = {
      login: {
        emailInput: 'textbox[name="Email"]',
        passwordInput: 'textbox[name="Password"]',
        signInButton: 'button[name="Sign in"]',
        loginForm: 'form',
        pageTitle: 'heading[name="MO Core Admin"]'
      },
      dashboard: {
        welcomeTitle: 'heading[name="Welcome to MO Core Admin"]',
        environmentDropdown: 'combobox',
        environmentOption: 'option[name="[STG] US Airlines Staging"]',
        selectedEnvironment: 'text=[STG] US Airlines',
        usersLink: 'link[name="Users"]',
        usersTab: 'link[name="Users"]'
      },
      users: {
        usersPageTitle: 'heading[name="Users"]',
        searchInput: 'textbox[placeholder="Search email..."]',
        userIdButton: 'button[name="516e6462f1b6"]',
        userTable: 'table'
      },
      userDetails: {
        userEmail: 'heading[name="quy.nguyen@coderpush.com"]',
        onboardDeviceSection: 'heading[name="Onboard Device"]',
        qrCodeImage: 'img[alt="QR Code"]',
        userInfoSection: 'heading[name="User Information"]'
      }
    };
  }

  // Login methods
  async navigateToLogin() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email, password) {
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for navigation to complete
    await this.page.waitForURL('/');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginSuccess() {
    await this.page.waitForSelector(this.selectors.dashboard.welcomeTitle);
    const welcomeTitle = await this.page.locator(this.selectors.dashboard.welcomeTitle);
    await expect(welcomeTitle).toBeVisible();
  }

  // Environment selection methods
  async selectEnvironment(environmentName) {
    await this.page.getByRole('combobox').click();
    await this.page.getByRole('option', { name: environmentName }).click();
    
    // Wait for environment change to complete
    await this.page.waitForTimeout(2000);
  }

  async verifyEnvironmentSelected(environmentName) {
    const environmentText = await this.page.locator(`text=${environmentName}`);
    await expect(environmentText).toBeVisible();
  }

  // Users page methods
  async navigateToUsers() {
    await this.page.getByRole('link', { name: 'Users', exact: true }).click();
    await this.page.waitForURL('**/users');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyUsersPageLoaded() {
    await this.page.waitForSelector(this.selectors.users.usersPageTitle);
    const usersTitle = await this.page.locator(this.selectors.users.usersPageTitle);
    await expect(usersTitle).toBeVisible();
  }

  async searchUser(email) {
    const searchInput = await this.page.locator(this.selectors.users.searchInput);
    await searchInput.fill(email);
    await this.page.waitForTimeout(1000);
  }

  async clickUserById(userId) {
    await this.page.getByRole('button', { name: userId }).click();
    await this.page.waitForLoadState('networkidle');
  }

  // User details methods
  async verifyUserDetailsPage(userEmail) {
    await this.page.waitForSelector(`heading[name="${userEmail}"]`);
    const userEmailHeading = await this.page.locator(`heading[name="${userEmail}"]`);
    await expect(userEmailHeading).toBeVisible();
  }

  async verifyQRCodeSection() {
    const onboardSection = await this.page.locator(this.selectors.userDetails.onboardDeviceSection);
    await expect(onboardSection).toBeVisible();
    
    const qrCodeImage = await this.page.locator(this.selectors.userDetails.qrCodeImage);
    await expect(qrCodeImage).toBeVisible();
  }

  async verifyUserInformation() {
    const userInfoSection = await this.page.locator(this.selectors.userDetails.userInfoSection);
    await expect(userInfoSection).toBeVisible();
  }

  // Utility methods
  async takeScreenshot(filename) {
    await this.page.screenshot({ path: `screenshots/${filename}`, fullPage: true });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async getCurrentURL() {
    return this.page.url();
  }

  async verifyPageTitle(expectedTitle) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }
}

module.exports = { MOAdminPage }; 