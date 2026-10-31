import { test, expect } from '../../src/fixtures/test-fixtures';
import { apiAdmin, buildBooking } from '../../src/data/testData';

test.describe('Restful Booker API', () => {
  test('health check returns 201 @smoke', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('auth returns a token for valid credentials', async ({ bookingClient }) => {
    const token = await bookingClient.authenticate(apiAdmin.username, apiAdmin.password);
    expect(token).toMatch(/^\w+$/);
  });

  test('auth rejects invalid credentials', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ reason: 'Bad credentials' });
  });

  test('create a booking and read it back', async ({ bookingClient }) => {
    const booking = buildBooking();
    const created = await bookingClient.create(booking);

    expect(created.bookingid).toBeGreaterThan(0);
    expect(created.booking).toEqual(booking);

    const res = await bookingClient.get(created.bookingid);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(booking);
  });

  test('filter bookings by name', async ({ bookingClient }) => {
    const booking = buildBooking();
    const { bookingid } = await bookingClient.create(booking);

    const res = await bookingClient.getIds({ firstname: booking.firstname, lastname: booking.lastname });
    expect(res.status()).toBe(200);
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(bookingid);
  });

  test('full update replaces the booking', async ({ authedBookingClient }) => {
    const { bookingid } = await authedBookingClient.create(buildBooking());
    const updated = buildBooking({ totalprice: 999, depositpaid: false, additionalneeds: 'Late checkout' });

    const res = await authedBookingClient.update(bookingid, updated);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(updated);
  });

  test('partial update changes only the given fields', async ({ authedBookingClient }) => {
    const original = buildBooking();
    const { bookingid } = await authedBookingClient.create(original);

    const res = await authedBookingClient.partialUpdate(bookingid, { totalprice: 120 });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ...original, totalprice: 120 });
  });

  test('update without a token is forbidden', async ({ bookingClient, request }) => {
    const { bookingid } = await bookingClient.create(buildBooking());
    const res = await request.put(`/booking/${bookingid}`, { data: buildBooking() });
    expect(res.status()).toBe(403);
  });

  test('delete removes the booking', async ({ authedBookingClient }) => {
    const { bookingid } = await authedBookingClient.create(buildBooking());

    const del = await authedBookingClient.delete(bookingid);
    expect(del.status()).toBe(201);

    const res = await authedBookingClient.get(bookingid);
    expect(res.status()).toBe(404);
  });
});
