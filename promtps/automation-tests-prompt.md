# Generate Automation Tests from MCP Test Case Execution Results

## Task

Analyze the execution results from `results/execution-results.json`. For each **successfully executed** test file, generate a corresponding JavaScript automation test. The generation process must use both the original Markdown test file for context and the JSON results for technical details.

## Current Project Structure

```
playwright-mobile-mcp-demo/
├── manual-test-cases/           # Manual test cases (.md files)
├── results/                     # MCP execution results
├── screenshots/                 # Automated test screenshots
├── automation-tests/            # Generated automation tests (to be created)
│   ├── tests/                   # Test files
│   ├── utils/                   # Utility functions(if have)
│   └── config/                  # Test configuration(if have)
├── mcp-config.json             # MCP automation configuration
├── package.json                # Node.js dependencies
```

## Script Generation Instructions
After run the test case by Playwright MCP and Mobile MCP. Use the `restuls/execution-results.json` to generate the test scripts and store to `automation-tests/tests/` folder

### 1. Analysis and Context Gathering
- **Read Execution Results**: Load and parse `results/execution-results.json`.
- **Identify Successful Tests**: Filter for test files where `status` is `SUCCESS`.
- **For each successful test file**:
    - **Read the Original Test File**: Use the `filePath` from the JSON to read the corresponding `.md` test file (e.g., `manual-test-cases/onboarding-test-case.md`). This file provides the high-level test intent, descriptions, and human-readable steps.
    - **Use Execution Data for Details**: Use the `automationContext` from the JSON as the source of truth for technical details needed for the script, such as URLs, app package names, selectors, and device IDs.

### 2. Code Generation Phase

#### Combined Automation Tests (Playwright + Mobile MCP)
- Generate **one** JavaScript test file for each successful source Markdown file.
- The test file must combine web (Playwright) and mobile (Mobile MCP) steps into a single, sequential test case.
- Adhere to project conventions:
  - Include test case IDs in test names (e.g., `TC-001`).
  - Use descriptive test names that reflect the test case.
  - Implement proper setup and teardown for web and mobile sessions.
- Save generated files to `automation-tests/tests/`.
- Use the naming convention: `[original-md-filename].spec.js`.

#### Mobile Configuration Requirements
**CRITICAL**: You **MUST** follow these proven configuration patterns to avoid mobile automation failures.
- **Dynamic Environment Detection**: Determine the mobile app environment from the `appPackage` in the `automationContext`.
- **Device Configuration**: Use the `deviceId` from execution results (e.g., 'emulator-5554').
- **App Package**: Extract from automationContext (e.g., 'com.pressingly.moneta.staging').
- **Coordinate-Based Interactions**: Use exact coordinates from successful executions.

#### Common Utilities
Create utility functions in `automation-tests/utils/` that needed:
eg. 
- `webUtils.js` - MCP web automation helpers (iframe handling, form interactions)
- `mobileUtils.js` - MCP mobile automation helpers (device management, app interactions)
- `configUtils.js` - Environment and configuration management

### 3. Project Structure Creation

Create the automation test directory structure:

```
playwright-mobile-mcp-demo/
├── manual-test-cases/           # Manual test cases (.md files)
├── results/                     # MCP execution results
├── screenshots/                 # Automated test screenshots
├── automation-tests/            # Generated automation tests (to be created)
|   |__ pages/                   # Page locators/objects for website and mobile
│   ├── tests/                   # Test files
│   ├── utils/                   # Utility functions
│   └── config/                  # Test configuration
├── playwright-config.json       # MCP automation configuration
├── package.json                 # Node.js dependencies
```

### 4. Execution Steps

1. **Analyze**: Load `results/execution-results.json` and for each successful result, read the corresponding `.md` file.
2. **Create Structure**: Set up the automation-tests directory structure.
3. **Generate**: Create combined Playwright and Mobile MCP test scripts using the provided template.
4. **Create Utilities**: Generate utility files for common operations.
5. **Update Metadata**: Create `test-mappings.json` to track the mapping between `.md` files and their generated automation scripts.
6. **Summarize**: Provide a summary of all generated files.

## Expected Output

### Files to be Created:
- `automation-tests/tests/onboarding-test-case.spec.js` (Combined web + mobile test)

### Success Criteria:
- All successful MCP test executions converted to automation tests
- Proper framework usage (Playwright for web, Mobile MCP integration for mobile)
- Cross-platform verification code handling(website, mobile)
- Reusable utility functions created
- Comprehensive metadata tracking for test management

## Notes
- Only generate automation tests for **successfully executed** MCP test steps
- Maintain the original test step intent while adapting to automation framework syntax
- Ensure generated code follows MCP integration patterns
- Include proper error handling and screenshot capture
- Generate tests that can run independently and integrate with existing MCP infrastructure

## Critical MCP Integration Requirements

**MUST FOLLOW** these patterns for successful MCP integration:

1. **Web Automation**: Use Playwright with proper handling for website
2. **Mobile Automation**: Integrate with Mobile MCP using device IDs and app packages from execution results
4. **Dynamic Configuration**: Use environment detection based on app packages and URLs from execution context
5. **Screenshot Management**: Capture screenshots at key points for test verification and debugging
6. **Dependencies**: Install all dependencies and configuration that can run playwright and appium to run on local with simulator/emulator
7. **README**: Create a comprehensive README.md to guide how to run the test script on local combining playwright and appium

**DO NOT** Use hardcoded values. Always derive configuration from the execution results and test context. 