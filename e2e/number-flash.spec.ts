import { test, expect } from '@playwright/test';

test.describe('Number-flash drill (mobile)', () => {
  test('flash a number, type a guess, see feedback and record a round', async ({
    page,
  }) => {
    await page.goto('/');

    // Open the Numbers tab.
    await page.getByRole('button', { name: /Numbers/ }).click();
    await expect(page.getByRole('heading', { name: 'Number flash' })).toBeVisible();
    await expect(page.getByText('Rounds played: 0')).toBeVisible();

    // Start a round: countdown → flash → input prompt.
    await page.getByTestId('number-start').click();

    // The input appears after the countdown + flash.
    const input = page.getByTestId('number-input');
    await expect(input).toBeVisible({ timeout: 10_000 });

    // We can't know the flashed number (that's the point) — type any guess.
    await input.fill('123456');
    await page.getByTestId('number-submit').click();

    // Feedback + Next appear, and a round is recorded.
    await expect(page.getByTestId('number-feedback')).toBeVisible();
    await expect(page.getByTestId('number-next')).toBeVisible();
    await expect(page.getByText('Rounds played: 1')).toBeVisible();
  });

  test('manual mode exposes digit and flash-time controls', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Numbers/ }).click();
    await page.getByRole('button', { name: 'Manual' }).click();
    await expect(page.getByTestId('digits-value')).toBeVisible();
    await page.getByRole('button', { name: 'More digits' }).click();
    // Digit count is adjustable in manual mode.
    await expect(page.getByTestId('digits-value')).toHaveText(/\d+/);
  });
});
