# Cursor AI Agent Prompt: Execute Test Steps from Markdown Files

## Task

Read through all Markdown (`.md`) files located in the `manual-test-cases` directory. For each file, sequentially perform the test steps described within. Execute the steps in the order they appear in each file, and process the files one by one.

## Instructions

1. List all `.md` files in the `manual-test-cases` directory.
2. For each file:
    - Read and parse the test steps.
    - Execute each step in the order provided.
    - Log the result of each step (success/failure, and any relevant output).
3. After all files are processed:
    - Provide a summary report of the test execution results.
    - **Save detailed execution results** to `restuls/execution-results.json`. **This is the only correct location.**
    - **Ensure the output is one single JSON object** that follows the detailed structure specified in the "Execution Result Format" section, including the full `testFiles` array and `summary` object. Do not create simplified or alternative JSON files.
    - **Save automation context** with selectors and paths for each successful test step.

> **Note:**
> - **Crucial**: Before execution, verify that `playwright-mcp` and `mobile MCPs` are available. If they are not, notify the user immediately and **stop the process**. Do not attempt to use alternative methods or generate stubbed results.
> - Use `playwright-mcp` for all steps involving website/browser automation.
> - Use `mobile MCPs` (Appium, mobile-mcp or mobile-automation) for all steps involving mobile app automation.
> - Ensure that each test step is executed in isolation and that the environment is reset as needed between files to avoid state leakage.

## Execution Learnings & Best Practices

Based on previous executions, keep the following in mind to improve robustness and avoid common pitfalls:

- **Selector Specificity**: Generic selectors (e.g., `a:has-text('2')`) can be ambiguous. Always use more specific, contextual selectors (e.g., `.button a:has-text('2')`, `#program`) to ensure you are targeting the correct element.
- **Handling Dynamic Content**: Content that loads asynchronously after an action (e.g., clicking a tab) requires explicit waits. Do not assume content is present immediately. Implement a polling mechanism or a wait strategy to ensure elements are available before interacting with them.
- **`page.evaluate` Context**: Code inside `page.evaluate()` runs in the browser's context, not Playwright's Node.js context.
    - **Do Not Use Playwright Selectors**: Playwright-specific selectors like `:has-text()` or `getByRole()` are **not valid** in `document.querySelector()` within `page.evaluate()`.
    - **Use Standard Browser APIs**: For text-based selection, use `Array.from(document.querySelectorAll('...')).some(el => el.innerText.includes('...'))`.
    - **Robust Visibility Checks**: `offsetParent === null` can be unreliable. For a more robust visibility check in the browser, use the element's bounding box: `const rect = element.getBoundingClientRect(); rect.width > 0 && rect.height > 0;`.
- **Flaky Link Clicks**: If clicking a link proves to be unreliable or flaky, switch to a more robust strategy: extract the `href` attribute from the anchor element and then perform a direct `page.navigate()` to that URL.
- **Test Step vs. Reality**: The test steps in the markdown files may not perfectly match the application's current state (e.g., button text, page headings, URL structures). Adapt to the application's actual behavior, use the correct selectors/assertions, and **note the discrepancy** in the execution results. Do not fail a test if the intent is met but the details are slightly different.
- **Mobile Emulation**: Simply setting a viewport may not be enough to trigger a mobile layout. If the site doesn't respond as expected, try setting a mobile-specific user-agent string in addition to the viewport dimensions.

## Execution Result Format

Save execution results to `restuls/execution-results.json`:

```json
{
  "executionId": "exec-2025-01-18-14-30",
  "timestamp": "2025-01-18T14:30:00Z",
  "testFiles": [
    {
      "fileName": "simple_demo_1.md",
      "filePath": "qualityops/nlp_tests/test_steps/pre_dev/simple_demo_1.md",
      "status": "SUCCESS",
      "totalSteps": 6,
      "successfulSteps": 6,
      "failedSteps": 0,
      "steps": [
        {
          "stepNumber": 1,
          "description": "Launch a web browser",
          "type": "web",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "playwright-mcp",
            "browser": "chromium",
            "action": "launch"
          }
        },
        {
          "stepNumber": 2,
          "description": "Navigate to https://www.google.com",
          "type": "web",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "playwright-mcp",
            "url": "https://www.google.com",
            "action": "navigate",
            "selectors": {
              "searchBox": "[name='q']",
              "searchButton": "[name='btnK']",
              "logo": "img[alt='Google']"
            }
          }
        },
        {
          "stepNumber": 3,
          "description": "Verify that the Google homepage loads successfully",
          "type": "web",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "playwright-mcp",
            "action": "verify",
            "verificationElements": [
              "img[alt='Google']",
              "[name='q']"
            ]
          }
        },
        {
          "stepNumber": 4,
          "description": "Ensure the mobile device or emulator is powered on and ready",
          "type": "mobile",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "mobile-automation",
            "deviceId": "emulator-5554",
            "platform": "Android",
            "action": "device_check"
          }
        },
        {
          "stepNumber": 5,
          "description": "Locate and launch the Moneta STG app on the device",
          "type": "mobile",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "mobile-automation",
            "appPackage": "com.pressingly.moneta.staging",
            "action": "launch_app",
            "deviceId": "emulator-5554"
          }
        },
        {
          "stepNumber": 6,
          "description": "Verify that the Moneta STG app opens to the main screen",
          "type": "mobile",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "mobile-automation",
            "action": "verify",
            "verificationElements": [
              "//android.widget.TextView[@text='Welcome']",
              "//android.widget.Button[@resource-id='com.pressingly.moneta.staging:id/login_button']"
            ]
          }
        }
      ]
    },
    {
      "fileName": "simple_demo_2.md",
      "filePath": "qualityops/nlp_tests/test_steps/pre_dev/simple_demo_2.md",
      "status": "SUCCESS",
      "totalSteps": 6,
      "successfulSteps": 6,
      "failedSteps": 0,
      "steps": [
        {
          "stepNumber": 1,
          "description": "Launch a web browser",
          "type": "web",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "playwright-mcp",
            "browser": "chromium",
            "action": "launch"
          }
        },
        {
          "stepNumber": 2,
          "description": "Navigate to https://claude.ai",
          "type": "web",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "playwright-mcp",
            "url": "https://claude.ai",
            "action": "navigate",
            "selectors": {
              "loginButton": "button[data-testid='login-button']",
              "signupLink": "a[href='/signup']",
              "logo": "img[alt='Claude']"
            }
          }
        },
        {
          "stepNumber": 3,
          "description": "Verify that the Claude AI homepage loads successfully",
          "type": "web",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "playwright-mcp",
            "action": "verify",
            "verificationElements": [
              "img[alt='Claude']",
              "button[data-testid='login-button']"
            ]
          }
        },
        {
          "stepNumber": 4,
          "description": "Ensure the mobile device or emulator is powered on and ready",
          "type": "mobile",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "mobile-automation",
            "deviceId": "emulator-5554",
            "platform": "Android",
            "action": "device_check"
          }
        },
        {
          "stepNumber": 5,
          "description": "Locate and launch the Moneta SBX app on the device",
          "type": "mobile",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "mobile-automation",
            "appPackage": "com.pressingly.moneta.sandbox",
            "action": "launch_app",
            "deviceId": "emulator-5554"
          }
        },
        {
          "stepNumber": 6,
          "description": "Verify that the Moneta SBX app opens to the main screen",
          "type": "mobile",
          "status": "SUCCESS",
          "automationContext": {
            "tool": "mobile-automation",
            "action": "verify",
            "verificationElements": [
              "//android.widget.TextView[@text='Welcome']",
              "//android.widget.Button[@resource-id='com.pressingly.moneta.sandbox:id/login_button']"
            ]
          }
        }
      ]
    }
  ],
  "summary": {
    "totalTestFiles": 2,
    "successfulTestFiles": 2,
    "failedTestFiles": 0,
    "totalSteps": 12,
    "successfulSteps": 12,
    "failedSteps": 0,
    "successRate": "100%"
  }
}
```

## Automation Context Guidelines

When executing test cases, capture the following automation context:

### Web Steps (playwright-mcp):
- **URLs**: Exact URLs navigated to
- **Selectors**: CSS selectors, data-testid attributes, accessibility roles
- **Actions**: navigate, click, type, verify, screenshot
- **Elements**: Key page elements discovered (buttons, inputs, links)

### Mobile Steps (mobile-automation):
- **App Packages**: Full package names (e.g., com.pressingly.moneta.staging)
- **Device Info**: Device ID, platform, version
- **Actions**: launch_app, tap, swipe, verify, screenshot
- **Elements**: XPath selectors, resource-ids, accessibility labels
- **Coordinates**: Touch coordinates if used

### General Context:
- **Errors**: Detailed error messages for failed steps
