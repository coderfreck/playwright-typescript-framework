import { type Locator, type Page, expect } from '@playwright/test';
import type { ProductName } from '../data/testData';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('.title');
    this.items = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('.product_sort_container');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async goto() {
    await this.page.goto('/inventory.html');
    await expect(this.title).toHaveText('Products');
  }

  private item(product: ProductName): Locator {
    return this.items.filter({ hasText: product });
  }

  async addToCart(product: ProductName) {
    await this.item(product).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(product: ProductName) {
    await this.item(product).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async getNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
