import { test, expect } from '../../src/fixtures/test-fixtures';
import { customer, products, STORAGE_STATE } from '../../src/data/testData';

// Reuse the session saved by the setup project instead of logging in every test.
test.use({ storageState: STORAGE_STATE });

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('sort by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('cart badge tracks added and removed items', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(products.bikeLight);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});

test.describe('Checkout', () => {
  test('complete an order end to end @smoke', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.boltTShirt);
    await inventoryPage.openCart();

    await cartPage.expectLoaded();
    expect(await cartPage.getItemNames()).toEqual([products.backpack, products.boltTShirt]);
    await cartPage.checkout();

    await checkoutPage.fillCustomerInfo(customer);
    const { itemTotal, tax, total } = await checkoutPage.getSummary();
    expect(itemTotal).toBeCloseTo(29.99 + 15.99, 2);
    expect(total).toBeCloseTo(itemTotal + tax, 2);

    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('customer information is required', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.continueButton.click();
    await expect(checkoutPage.error).toContainText('First Name is required');
  });
});
