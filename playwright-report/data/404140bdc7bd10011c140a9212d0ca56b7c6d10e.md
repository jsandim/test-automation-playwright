# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenarios.test.ts >> Scenario 1 - Login >> Login with valid credentials
- Location: tests\scenarios.test.ts:27:9

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#flash')
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 4

- You logged into a secure area!
+
+             Your username is invalid!
+             ×
+           

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#flash')
    9 × locator resolved to <div id="flash" data-alert="" class="flash error">…</div>
      - unexpected value "
            Your username is invalid!
            ×
          "

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - text:  Your username is invalid!
    - link "×" [ref=e5] [cursor=pointer]:
      - /url: "#"
  - generic [ref=e6]:
    - link "Fork me on GitHub":
      - /url: https://github.com/tourdedave/the-internet
      - img "Fork me on GitHub" [ref=e7] [cursor=pointer]
    - generic [ref=e9]:
      - heading "Login Page" [level=2] [ref=e10]
      - heading "This is where you can log into the secure area. Enter tomsmith for the username and SuperSecretPassword! for the password. If the information is wrong you should see error messages." [level=4] [ref=e11]:
        - text: This is where you can log into the secure area. Enter
        - emphasis [ref=e12]: tomsmith
        - text: for the username and
        - emphasis [ref=e13]: SuperSecretPassword!
        - text: for the password. If the information is wrong you should see error messages.
      - generic [ref=e14]:
        - generic [ref=e16]:
          - generic [ref=e17] [cursor=pointer]: Username
          - textbox "Username" [ref=e18]
        - generic [ref=e20]:
          - generic [ref=e21] [cursor=pointer]: Password
          - textbox "Password" [ref=e22]
        - button " Login" [ref=e23] [cursor=pointer]:
          - generic [ref=e24]:  Login
  - generic [ref=e26]:
    - separator [ref=e27]
    - generic [ref=e28]:
      - text: Powered by
      - link "Elemental Selenium" [ref=e29] [cursor=pointer]:
        - /url: http://elementalselenium.com/
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // --- SCENARIO 1: Data-Driven Login ---
  4  | const loginCredentials = [
  5  |   {
  6  |     case: 'valid credentials',
  7  |     username: 'tomsmith7',
  8  |     password: 'SuperSecretPassword!',
  9  |     expectedFlash: 'You logged into a secure area!',
  10 |   },
  11 |   {
  12 |     case: 'invalid username',
  13 |     username: 'wronguser',
  14 |     password: 'SuperSecretPassword!',
  15 |     expectedFlash: 'Your username is invalid!',
  16 |   },
  17 |   {
  18 |     case: 'invalid password',
  19 |     username: 'tomsmith',
  20 |     password: 'wrongpassword',
  21 |     expectedFlash: 'Your password is invalid!',
  22 |   },
  23 | ];
  24 | 
  25 | test.describe('Scenario 1 - Login', () => {
  26 |   for (const { case: testName, username, password, expectedFlash } of loginCredentials) {
  27 |     test(`Login with ${testName}`, async ({ page }) => {
  28 |       await page.goto('/login');
  29 | 
  30 |       await page.locator('#username').fill(username);
  31 |       await page.locator('#password').fill(password);
  32 |       await page.locator('button[type="submit"]').click();
  33 | 
  34 |       // Assert the flash message contains the expected text
  35 |       const flashMessage = page.locator('#flash');
  36 |       await expect(flashMessage).toBeVisible();
> 37 |       await expect(flashMessage).toContainText(expectedFlash);
     |                                  ^ Error: expect(locator).toContainText(expected) failed
  38 |     });
  39 |   }
  40 | });
  41 | 
  42 | // --- SCENARIO 2: Dynamic Content ---
  43 | test.describe('Scenario 2 - Dynamic Content', () => {
  44 |   test('Wait for dynamically loaded element', async ({ page }) => {
  45 |     await page.goto('/dynamic_loading/1');
  46 | 
  47 |     // Click the start button
  48 |     await page.locator('#start button').click();
  49 | 
  50 |     // The loading bar appears and takes a few seconds. 
  51 |     // Playwright's .toBeVisible() automatically polls until the timeout is reached.
  52 |     const finishText = page.locator('#finish h4');
  53 |     await expect(finishText).toBeVisible({ timeout: 10000 }); // Explicit timeout for CI safety
  54 |     await expect(finishText).toHaveText('Hello World!');
  55 |   });
  56 | });
  57 | 
  58 | // --- SCENARIO 3: Form Inputs ---
  59 | test.describe('Scenario 3 - Form Inputs', () => {
  60 |   test('Interact with checkboxes and assert state changes', async ({ page }) => {
  61 |     await page.goto('/checkboxes');
  62 | 
  63 |     const checkbox1 = page.locator('input[type="checkbox"]').nth(0);
  64 |     const checkbox2 = page.locator('input[type="checkbox"]').nth(1);
  65 | 
  66 |     // Assert initial state (Checkbox 1 is unchecked, Checkbox 2 is checked)
  67 |     await expect(checkbox1).not.toBeChecked();
  68 |     await expect(checkbox2).toBeChecked();
  69 | 
  70 |     // Interact: Check the first, uncheck the second
  71 |     await checkbox1.check();
  72 |     await checkbox2.uncheck();
  73 | 
  74 |     // Assert new state
  75 |     await expect(checkbox1).toBeChecked();
  76 |     await expect(checkbox2).not.toBeChecked();
  77 |   });
  78 | });
```