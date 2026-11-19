/**
 * Copyright 2026 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test as setup, expect } from '@playwright/test';
import { authFile } from './playwright.config';

setup('authenticate through UDS Core', async ({ page, context }) => {
  const requireExternalCredentials =
    process.env.UDS_REQUIRE_EXTERNAL_CREDENTIALS === 'true';
  const username = process.env.UDS_TEST_USERNAME ?? 'doug';
  const password = process.env.UDS_TEST_PASSWORD ?? 'unicorn123!@#UN';

  if (
    requireExternalCredentials &&
    (!process.env.UDS_TEST_USERNAME || !process.env.UDS_TEST_PASSWORD)
  ) {
    throw new Error(
      'UDS_TEST_USERNAME and UDS_TEST_PASSWORD are required for staging tests',
    );
  }

  await page.goto('/');
  await expect(page).toHaveURL(/https:\/\/sso\.uds\.dev\//);

  await page.getByLabel('Username or email').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('https://podinfo.uds.dev/');

  const cookies = await context.cookies();
  const keycloakCookie = cookies.find(
    (cookie) => cookie.name === 'KEYCLOAK_SESSION',
  );

  expect(keycloakCookie).toBeDefined();
  expect(keycloakCookie?.value).not.toBe('');
  expect(keycloakCookie?.domain).toContain('sso.');

  await page.context().storageState({ path: authFile });
  await expect(page).toHaveURL('https://podinfo.uds.dev/');
});
