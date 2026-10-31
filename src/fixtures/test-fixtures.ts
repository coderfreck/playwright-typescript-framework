import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { BookingClient } from '../api/BookingClient';
import { apiAdmin } from '../data/testData';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  bookingClient: BookingClient;
  authedBookingClient: BookingClient;
};

/**
 * Custom fixtures: tests ask for the page objects or API clients they need
 * and Playwright builds them per test.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

  bookingClient: async ({ request }, use) => use(new BookingClient(request)),
  authedBookingClient: async ({ request }, use) => {
    const client = new BookingClient(request);
    await client.authenticate(apiAdmin.username, apiAdmin.password);
    await use(client);
  },
});

export { expect } from '@playwright/test';
