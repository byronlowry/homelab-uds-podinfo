/**
 * Copyright 2026 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test, expect } from '@playwright/test';

test('authenticated homepage returns 200', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL('https://podinfo.uds.dev/');
});

test('authenticated application API returns Podinfo metadata', async ({ request }) => {
  const response = await request.get('/api/info');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await response.json();
  expect(body).toEqual(expect.objectContaining({
    hostname: expect.any(String),
    version: expect.any(String),
  }));
});

for (const endpoint of ['/healthz', '/readyz']) {
  test(`${endpoint} returns 200 through authenticated ingress`, async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(200);
  });
}
