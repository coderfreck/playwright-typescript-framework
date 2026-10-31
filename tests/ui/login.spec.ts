import { test, expect } from '../../src/fixtures/test-fixtures';
import { users, PASSWORD } from '../../src/data/testData';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in @smoke', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard, PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked-out user sees an error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut, PASSWORD);
    await loginPage.expectError('Sorry, this user has been locked out.');
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(users.standard, 'wrong_password');
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  const requiredFields = [
    { case: 'empty username', username: '', password: PASSWORD, error: 'Username is required' },
    { case: 'empty password', username: users.standard, password: '', error: 'Password is required' },
  ];

  for (const { case: name, username, password, error } of requiredFields) {
    test(`validation: ${name}`, async ({ loginPage }) => {
      await loginPage.login(username, password);
      await loginPage.expectError(error);
    });
  }

  test('protected page redirects to login when signed out', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });
});
