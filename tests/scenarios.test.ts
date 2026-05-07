import { test, expect } from '@playwright/test';

// --- SCENARIO 1: Data-Driven Login ---
const loginCredentials = [
  {
    case: 'valid credentials',
    username: 'tomsmith',
    password: 'SuperSecretPassword!',
    expectedFlash: 'You logged into a secure area!',
  },
  {
    case: 'invalid username',
    username: 'wronguser',
    password: 'SuperSecretPassword!',
    expectedFlash: 'Your username is invalid!',
  },
  {
    case: 'invalid password',
    username: 'tomsmith',
    password: 'wrongpassword',
    expectedFlash: 'Your password is invalid!',
  },
];

test.describe('Scenario 1 - Login', () => {
  for (const { case: testName, username, password, expectedFlash } of loginCredentials) {
    test(`Login with ${testName}`, async ({ page }) => {
      await page.goto('/login');

      await page.locator('#username').fill(username);
      await page.locator('#password').fill(password);
      await page.locator('button[type="submit"]').click();

      // Assert the flash message contains the expected text
      const flashMessage = page.locator('#flash');
      await expect(flashMessage).toBeVisible();
      await expect(flashMessage).toContainText(expectedFlash);
    });
  }
});

// --- SCENARIO 2: Dynamic Content ---
test.describe('Scenario 2 - Dynamic Content', () => {
  test('Wait for dynamically loaded element', async ({ page }) => {
    await page.goto('/dynamic_loading/1');

    // Click the start button
    await page.locator('#start button').click();

    // The loading bar appears and takes a few seconds. 
    // Playwright's .toBeVisible() automatically polls until the timeout is reached.
    const finishText = page.locator('#finish h4');
    await expect(finishText).toBeVisible({ timeout: 10000 }); // Explicit timeout for CI safety
    await expect(finishText).toHaveText('Hello World!');
  });
});

// --- SCENARIO 3: Form Inputs ---
test.describe('Scenario 3 - Form Inputs', () => {
  test('Interact with checkboxes and assert state changes', async ({ page }) => {
    await page.goto('/checkboxes');

    const checkbox1 = page.locator('input[type="checkbox"]').nth(0);
    const checkbox2 = page.locator('input[type="checkbox"]').nth(1);

    // Assert initial state (Checkbox 1 is unchecked, Checkbox 2 is checked)
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).toBeChecked();

    // Interact: Check the first, uncheck the second
    await checkbox1.check();
    await checkbox2.uncheck();

    // Assert new state
    await expect(checkbox1).toBeChecked();
    await expect(checkbox2).not.toBeChecked();
  });
});