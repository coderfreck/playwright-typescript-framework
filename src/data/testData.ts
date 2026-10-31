/** Where the setup project saves the logged-in session for UI tests. */
export const STORAGE_STATE = '.auth/standard-user.json';

export const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

/** Public demo accounts published on the saucedemo.com login page. */
export const users = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
} as const;

export const customer = {
  firstName: 'Vaibhav',
  lastName: 'Asthana',
  postalCode: '211001',
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
} as const;

export type ProductName = (typeof products)[keyof typeof products];

/** Default admin credentials documented by restful-booker. */
export const apiAdmin = {
  username: process.env.API_USERNAME ?? 'admin',
  password: process.env.API_PASSWORD ?? 'password123',
};

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

/** Builds a unique booking so parallel runs never collide. */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return {
    firstname: `QA-${suffix}`,
    lastname: 'Automation',
    totalprice: 250,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
