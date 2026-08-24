import { test, expect } from '@playwright/test';

test.describe('Authentication & Navigation E2E Flow', () => {
  test('redirects unauthenticated user from protected route /dashboard to auth page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/en\/auth\?redirectTo=%2Fdashboard/);
  });

  test('renders auth page correctly for unauthenticated users', async ({ page }) => {
    await page.goto('/en/auth');
    await expect(page.locator('main')).toBeVisible();
  });

  test('allows access to protected route when valid session token cookie is set', async ({ context, page }) => {
    await context.addCookies([
      {
        name: 'session_token',
        value: 'e2e-test-session-token-123',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    await page.goto('/en/dashboard');
    await expect(page).toHaveURL(/\/en\/dashboard/);
  });

  test('supports locale prefix navigation to Vietnamese auth page', async ({ page }) => {
    await page.goto('/vi/auth');
    await expect(page).toHaveURL(/\/vi\/auth/);
    await expect(page.locator('main')).toBeVisible();
  });
});
