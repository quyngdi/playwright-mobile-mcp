const { test, expect } = require('@playwright/test');
const { WebUtils } = require('../utils/webUtils');
const { ConfigUtils } = require('../utils/configUtils');

test.describe('TC-001-Moneta-Pass-Onboarding', () => {
  let webUtils;
  let page;

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    webUtils = new WebUtils(page);
    
    // Enable screenshots for debugging
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.afterEach(async ({ page }) => {
    await page?.close();
  });

  test('TC-001: Verify admin users can navigate to MO Core Admin page, search user and give user the QR code to onboard mPass', async () => {
    const config = ConfigUtils.getWebConfig();
    
    // Step 1: Navigate to MO Core Admin website
    console.log('Step 1: Navigate to MO Core Admin website');
    await page.goto('https://mo-admin.dev.pressingly.net/');
    
    // Verify that the homepage loads successfully
    await expect(page).toHaveTitle('MO Core Admin');
    await expect(page.getByRole('heading', { name: 'MO Core Admin' })).toBeVisible();
    
    // Take screenshot for verification
    await page.screenshot({ path: 'screenshots/01-homepage-loaded.png' });
    console.log('✓ Homepage loaded successfully');

    // Step 2: Sign In to the account
    console.log('Step 2: Sign In to the account');
    
    // Enter email
    await page.getByRole('textbox', { name: 'Email' }).fill('test@pressingly.net');
    
    // Enter password
    await page.getByRole('textbox', { name: 'Password' }).fill('Coderpush@123');
    
    // Click Sign in button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for login to complete and verify successful login
    await page.waitForURL('https://mo-admin.dev.pressingly.net/');
    await expect(page.getByRole('heading', { name: 'Welcome to MO Core Admin' })).toBeVisible();
    
    // Take screenshot for verification
    await page.screenshot({ path: 'screenshots/02-login-successful.png' });
    console.log('✓ Sign-in successful and user is logged in');

    // Step 3: Navigate to STG United Airlines Org
    console.log('Step 3: Navigate to STG United Airlines Org');
    
    // Click on environment dropdown
    await page.getByRole('combobox').click();
    
    // Select STG US Airlines environment
    await page.getByRole('option', { name: '[STG] US Airlines Staging' }).click();
    
    // Verify environment is selected
    await expect(page.getByRole('combobox').getByText('[STG] US Airlines')).toBeVisible();
    
    // Take screenshot for verification
    await page.screenshot({ path: 'screenshots/03-environment-selected.png' });
    console.log('✓ [STG] US Airlines environment selected');

    // Step 4: Search user and verify the QR code
    console.log('Step 4: Search user and verify the QR code');
    
    // Navigate to Users tab
    await page.getByRole('link', { name: 'Users', exact: true }).click();
    
    // Wait for users page to load
    await page.waitForURL('**/users');
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    
    // Click on the specific user ID (the user quy.nguyen@coderpush.com should be visible)
    await page.getByRole('button', { name: '516e6462f1b6' }).click();
    
    // Wait for user details page to load
    await page.waitForURL('**/users/1e286130-102b-4311-8086-516e6462f1b6');
    
    // Verify user details page
    await expect(page.getByRole('heading', { name: 'quy.nguyen@coderpush.com' })).toBeVisible();
    
    // Verify QR code section is displayed
    await expect(page.getByRole('heading', { name: 'Onboard Device' })).toBeVisible();
    await expect(page.locator('img[alt="QR Code"]')).toBeVisible();
    
    // Take screenshot for verification
    await page.screenshot({ path: 'screenshots/04-qr-code-verified.png' });
    console.log('✓ QR code in the Onboard Device section is displayed');
    
    console.log('🎉 All test steps completed successfully!');
  });
}); 