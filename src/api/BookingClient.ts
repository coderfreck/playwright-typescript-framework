import { type APIRequestContext, type APIResponse, expect } from '@playwright/test';
import type { Booking } from '../data/testData';

export interface CreatedBooking {
  bookingid: number;
  booking: Booking;
}

/** Thin wrapper around the restful-booker REST API. */
export class BookingClient {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  async authenticate(username: string, password: string): Promise<string> {
    const res = await this.request.post('/auth', { data: { username, password } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.token, 'auth token should be returned').toBeTruthy();
    this.token = body.token as string;
    return this.token;
  }

  private authHeaders(): Record<string, string> {
    if (!this.token) throw new Error('Call authenticate() before using protected endpoints');
    return { Cookie: `token=${this.token}` };
  }

  getIds(params?: Record<string, string>): Promise<APIResponse> {
    return this.request.get('/booking', { params });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async create(booking: Booking): Promise<CreatedBooking> {
    const res = await this.request.post('/booking', { data: booking });
    expect(res.status()).toBe(200);
    return (await res.json()) as CreatedBooking;
  }

  update(id: number, booking: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.authHeaders() });
  }

  partialUpdate(id: number, fields: Partial<Booking>): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: fields, headers: this.authHeaders() });
  }

  delete(id: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeaders() });
  }
}
