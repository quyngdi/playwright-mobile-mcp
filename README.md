# Playwright Mobile MCP Demo - Automation Test Suite

This project demonstrates end-to-end test automation combining **Playwright MCP** for web automation and **Mobile MCP** integration for mobile app testing. The test suite was generated from successful MCP test executions and provides a complete automation framework for both web and mobile platforms.

**Official MCP Integration:**
- **Playwright MCP**: [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- **Mobile MCP**: [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp)

## 🚀 Features

- **Combined Web & Mobile Testing**: Seamless integration between Playwright and Mobile MCP
- **Generated from MCP Results**: Test scripts automatically generated from successful MCP executions
- **Page Object Pattern**: Organized, maintainable test code structure
- **Cross-Platform Support**: Web (Chrome, Firefox, Safari) and Mobile (Android) testing
- **Screenshot Capture**: Automatic screenshots for debugging and verification
- **Comprehensive Reporting**: HTML, JSON, and JUnit test reports
- **Environment Management**: Support for multiple test environments (Dev, Staging, Production)

## 📁 Project Structure

```
playwright-mobile-mcp-demo/
├── manual-test-cases/           # Original manual test cases
├── restuls/                     # MCP execution results
├── automation-tests/            # Generated automation tests
│   ├── tests/                   # Test files
│   │   ├── website-test-case.spec.js
│   │   └── mobile-test-case.spec.js
│   ├── pages/                   # Page Object classes
│   │   ├── moAdminPage.js
│   │   └── mobilePage.js
│   ├── utils/                   # Utility functions
│   │   ├── webUtils.js
│   │   ├── mobileUtils.js
│   │   └── configUtils.js
│   ├── config/                  # Test configuration
│   │   ├── playwright.config.js
│   │   ├── globalSetup.js
│   │   └── globalTeardown.js
│   └── test-mappings.json       # Test case mappings
├── screenshots/                 # Test screenshots
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🛠️ Prerequisites

### System Requirements
- **Node.js**: Version 16.0.0 or higher
- **Android Studio**: For Android emulator
- **ADB (Android Debug Bridge)**: For mobile device communication
- **Git**: For version control
- **Cursor IDE**: For MCP integration (recommended)

### MCP Setup
This project requires **Playwright MCP** and **Mobile MCP** to be properly configured.

#### 1. Playwright MCP Setup
The Playwright MCP provides browser automation capabilities through the Model Context Protocol.

**Official Repository**: [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)

**Installation**:
```bash
# Install Playwright MCP server
npm install -g @playwright/mcp-server

# Or install locally
npm install @playwright/mcp-server
```

**Configuration**:
Create or update your MCP configuration file (usually in Cursor settings):
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

#### 2. Mobile MCP Setup
The Mobile MCP provides mobile device automation through Appium integration.

**Official Repository**: [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp)

**Installation**:
```bash
# Install Appium and mobile MCP
npm install -g appium
npm install -g @appium/mobile-mcp

# Install required drivers
appium driver install uiautomator2
```

**Configuration**:
Add mobile MCP to your MCP configuration:
```json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@0.0.19"]
    }
  }
}
```

#### 3. Verify MCP Setup
```bash
# Test Playwright MCP
npx playwright --version

# Test Mobile MCP
appium --version
adb version
```

### Mobile Setup
1. **Install Android Studio**
2. **Create Android Virtual Device (AVD)**:
   - Open Android Studio
   - Go to Tools → AVD Manager
   - Create a new virtual device (recommended: Pixel 4, API 30+)
   - Name it appropriately (the tests expect `emulator-5554`)

3. **Install Moneta STG App**:
   ```bash
   # Install the APK on your emulator
   adb -s emulator-5554 install /path/to/moneta-staging.apk
   ```

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/quyngdi/playwright-mobile-mcp.git
cd playwright-mobile-mcp-demo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Playwright
```bash
npm run setup
```

This command will:
- Install Playwright browsers
- Install system dependencies
- Set up the test environment

### 4. Setup MCP Components
```bash
# Install MCP dependencies
npm run setup:mcp

# Start Appium server for mobile MCP
npm run start:appium

# Verify MCP setup
npm run verify:mcp
```

### 5. Verify Mobile Setup
```bash
# Check if emulator is running
npm run check:devices

# Check if Moneta apps are installed
npm run check:apps

# Test MCP connections
npm run test:mcp
```

## 🏃‍♂️ Running Tests

### Start Android Emulator
```bash
# Start your Android emulator first
emulator -avd YourAVDName -no-snapshot-load -no-snapshot-save
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Types
```bash
# Web tests only
npm run test:website

# Mobile tests only
npm run test:mobile
```

### Run Tests with UI Mode
```bash
npm run test:ui
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```

## 📊 Test Reports

### View HTML Report
```bash
npm run report
```

### Report Locations
- **HTML Report**: `automation-tests/test-results/html-report/`
- **JSON Results**: `automation-tests/test-results/results.json`
- **JUnit XML**: `automation-tests/test-results/results.xml`
- **Screenshots**: `screenshots/`

## 🧪 Test Cases

### TC-001: Website Test Case
**Objective**: Verify admin users can navigate to MO Core Admin, search user, and verify QR code

**Steps**:
1. Navigate to MO Core Admin website
2. Sign in with admin credentials
3. Select STG United Airlines environment
4. Search for user and verify QR code display

**Key Technologies**: Playwright, Web Automation

### TC-002: Mobile Test Case
**Objective**: Verify users can navigate to Preferences in mobile app to configure policies

**Steps**:
1. Launch Moneta STG mobile app
2. Navigate to Preferences page
3. Toggle policy settings

**Key Technologies**: Mobile MCP, Android Automation

## ⚙️ Configuration

### Environment Variables
```bash
# Set test environment
export NODE_ENV=staging    # staging, production, development

# Set CI mode
export CI=true            # Enables headless mode

# Set device ID (if different)
export DEVICE_ID=emulator-5554

# MCP Configuration
export MCP_PLAYWRIGHT_PORT=3001
export MCP_MOBILE_PORT=4723
export APPIUM_HOME=~/.appium
export PLAYWRIGHT_BROWSERS_PATH=~/.cache/ms-playwright
```

### MCP Configuration
The project relies on MCP (Model Context Protocol) for automation. Ensure your `cursor-settings.json` or IDE configuration includes:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@0.0.19"]
    }
  }
}
```

For detailed setup instructions, refer to:
- **Playwright MCP**: [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- **Mobile MCP**: [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp)

### Test Configuration
Edit `automation-tests/config/playwright.config.js` to customize:
- Browser settings
- Timeouts
- Retry logic
- Reporting options

### Mobile Configuration
Edit `automation-tests/utils/configUtils.js` to customize:
- Device settings
- App packages
- Coordinates
- Timeouts

## 🔧 Troubleshooting

### Common Issues

#### 1. MCP Connection Issues
```bash
Error: MCP server not available
```
**Solution**:
- Verify MCP servers are running: `npm run verify:mcp`
- Check MCP configuration in Cursor settings
- Restart Cursor IDE
- Ensure all MCP dependencies are installed
- Refer to official documentation: [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)

#### 2. Playwright MCP Not Working
```bash
Error: playwright-mcp command not found
```
**Solution**:
- Install Playwright MCP: `npm install -g @playwright/mcp-server`
- Verify installation: `npx playwright --version`
- Check MCP server configuration
- Follow setup guide: [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)

#### 3. Mobile MCP Connection Failed
```bash
Error: Mobile automation failed
```
**Solution**:
- Start Appium server: `npm run start:appium`
- Verify mobile MCP: `appium --version`
- Check device connection: `adb devices`
- Ensure mobile MCP is configured in Cursor
- Refer to mobile MCP documentation: [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp)

#### 4. Emulator Not Found
```bash
Error: Device emulator-5554 not found
```
**Solution**:
- Ensure Android emulator is running
- Check device ID with `adb devices`
- Update device ID in configuration if needed

#### 2. App Not Installed
```bash
Error: App not launched successfully
```
**Solution**:
- Install Moneta STG app: `adb -s emulator-5554 install /path/to/app.apk`
- Verify installation: `npm run check:apps`

#### 3. Web Login Issues
```bash
Error: Login failed
```
**Solution**:
- Verify credentials in `configUtils.js`
- Check if website is accessible
- Ensure environment is correct

#### 4. Element Not Found
```bash
Error: Element not found: selector
```
**Solution**:
- Take screenshot for debugging
- Update selectors if UI has changed
- Check if page has fully loaded

### Debug Commands
```bash
# MCP Debug Commands
# Check MCP server status
curl -X POST http://localhost:3001/health    # Playwright MCP
curl -X POST http://localhost:4723/status    # Mobile MCP

# Check MCP configuration
cat ~/.cursor/mcp-settings.json

# Test MCP connections
npm run test:mcp

# Check ADB connection
adb devices

# Check running apps
adb -s emulator-5554 shell dumpsys window windows | grep -E 'mCurrentFocus'

# Take manual screenshot
adb -s emulator-5554 shell screencap -p > debug-screenshot.png

# View app logs
adb -s emulator-5554 logcat | grep moneta

# Check Appium server
curl -X GET http://localhost:4723/wd/hub/sessions
```

## 📝 Development

### Adding New Tests
1. Create new test file in `automation-tests/tests/`
2. Follow existing patterns and use page objects
3. Add configuration to `test-mappings.json`
4. Update this README if needed

### Updating Page Objects
- Web: Update `automation-tests/pages/moAdminPage.js`
- Mobile: Update `automation-tests/pages/mobilePage.js`

### Code Style
```bash
# Run linting
npm run lint

# Format code
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Run the full test suite
5. Submit a pull request

## 📞 Support

For issues and questions:
- **GitHub Issues**: [Create an issue](https://github.com/quyngdi/playwright-mobile-mcp.git/issues)
- **Documentation**: Check this README and inline code comments
- **MCP Documentation**: Refer to MCP-specific documentation

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Official MCP Resources

### Playwright MCP
- **GitHub Repository**: [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- **NPM Package**: [@playwright/mcp-server](https://www.npmjs.com/package/@playwright/mcp-server)
- **Documentation**: Follow the official repository for detailed setup and usage instructions

### Mobile MCP
- **GitHub Repository**: [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp)
- **NPM Package**: [@appium/mobile-mcp](https://www.npmjs.com/package/@appium/mobile-mcp)
- **Documentation**: Refer to the official repository for mobile automation setup

### MCP Protocol
- **Official MCP Documentation**: For understanding the Model Context Protocol
- **Cursor IDE Integration**: For MCP server configuration and setup

## 🙏 Acknowledgments

- **Playwright Team**: For the excellent web automation framework
- **Microsoft**: For developing and maintaining [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- **Mobile MCP Team**: For mobile automation integration via [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp)
- **MCP Protocol Team**: For the Model Context Protocol foundation
- **Test Team**: For creating comprehensive test cases

---

**Happy Testing! 🧪✨** 