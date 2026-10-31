import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { users, PASSWORD, STORAGE_STATE } from '../src/data/testData';

/** Logs in once and saves the session so UI tests can skip the login screen. */
setup('authenticate as standard user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard, PASSWORD);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: STORAGE_STATE });
});
