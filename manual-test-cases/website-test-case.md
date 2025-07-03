## Test Case ID
TC-001-Moneta-Pass-Onboarding

## Test Objective
Verify that admin users can navigate to the MO Core Admin page, search user and give user the QR code to onboard mPass

## Prerequisites
- Valid account credentials (email: test@pressingly.net, password: Coderpush@123)

## Test Steps:
1. **Navigate to MO Core Admin website**
   - Open browser and go to `https://mo-admin.dev.pressingly.net/`
   - Verify that the homepage loads successfully

2. **Sign In to the account**
   - Enter email: test@pressingly.net
   - Enter password: Coderpush@123
   - Click on the Sign in
   - Verify that sign-in is successful and the user is logged in

3. **Navigate to STG United Airlines Org**
   - Click on the environment dropdown at top left menu and select `[STG] US Airlines` environment
   - Verify that `[STG] US Airlines` environment is selected at the environment selector

4. **Search user and verify the QR code**
   - Select Users tab and search the email `quy.nguyen@coderpush.com`
   - Click on the User ID in the table row of that user
   - Verify that the QR code in the `Onboard Device` section is displayed