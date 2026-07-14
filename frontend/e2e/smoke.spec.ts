import { test, expect } from '@playwright/test';

// Smoke suite del flujo crítico de compra (002-user-flows.md #1).
test.describe('Critical purchase flow (smoke)', () => {
  test('guest can reach the catalog from the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'NovaCommerce' })).toBeVisible();
    await page.getByRole('link', { name: 'Explorar catálogo' }).click();
    await expect(page).toHaveURL(/\/catalog/);
  });

  test('unauthenticated user is redirected to /login when visiting /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('unknown route renders the 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText('404')).toBeVisible();
  });
});
