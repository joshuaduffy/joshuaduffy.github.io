import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Joshua Duffy/);
});

test('about link', async ({ page }) => {
  await page.goto('/');

  // Click the about link.
  await page.getByRole('link', { name: 'About' }).click();

  // Expects page to have a heading with the name of About.
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
});
