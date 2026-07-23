import { test, expect } from '@playwright/test';

test.describe('SpeedRead — core flows (mobile)', () => {
  test('read a library passage, take the quiz, and see it on the dashboard', async ({
    page,
  }) => {
    await page.goto('/');

    // Library loads with the first passage.
    await expect(page.getByRole('heading', { name: 'SpeedRead' })).toBeVisible();
    await page.getByTestId('start-how-eyes-read').click();

    // Reader: bump the speed up fast so the test runs quickly, then play.
    await expect(page.getByTestId('wpm-value')).toBeVisible();
    for (let i = 0; i < 25; i++) {
      await page.getByRole('button', { name: 'Faster' }).click();
    }
    await page.getByTestId('play-toggle').click();

    // Wait for the reading to finish and reveal the Continue button.
    await expect(page.getByTestId('continue-btn')).toBeVisible({ timeout: 60_000 });
    await page.getByTestId('continue-btn').click();

    // Quiz: answer every question by clicking the first option of each.
    await expect(page.getByTestId('submit-quiz')).toBeVisible();
    const questions = page.getByTestId('quiz-question');
    const count = await questions.count();
    for (let i = 0; i < count; i++) {
      await questions.nth(i).getByRole('button').first().click();
    }
    await page.getByTestId('submit-quiz').click();

    // Results show the effective WPM headline.
    await expect(page.getByRole('heading', { name: /Session complete/ })).toBeVisible();
    await expect(page.getByText('Effective WPM (understood)')).toBeVisible();

    // Progress dashboard now has one session recorded.
    await page.getByRole('button', { name: 'View progress' }).click();
    await expect(page.getByRole('heading', { name: 'Your progress' })).toBeVisible();
    await expect(page.getByText('Latest effective WPM')).toBeVisible();
    await expect(page.getByText('Sessions', { exact: true })).toBeVisible();
  });

  test('paste-your-own text tracks raw speed without a quiz', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Paste text' }).click();
    await page
      .getByTestId('custom-text')
      .fill('The quick brown fox jumps over the lazy dog again and again today.');
    await page.getByTestId('start-custom').click();

    // Reader appears; speed up and play to the end.
    await expect(page.getByTestId('wpm-value')).toBeVisible();
    for (let i = 0; i < 25; i++) {
      await page.getByRole('button', { name: 'Faster' }).click();
    }
    await page.getByTestId('play-toggle').click();

    await expect(page.getByTestId('continue-btn')).toBeVisible({ timeout: 60_000 });
    await page.getByTestId('continue-btn').click();

    // Goes straight to results (no quiz) and shows the "no quiz" note.
    await expect(page.getByRole('heading', { name: /Session complete/ })).toBeVisible();
    await expect(page.getByText(/Pasted text has no quiz/)).toBeVisible();
  });
});
