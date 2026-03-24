import { test, expect } from '@playwright/test';

/**
 * Auth E2E Tests
 *
 * These tests verify the authentication flow end-to-end:
 * the real browser hits the real frontend, which calls the real backend API.
 * This catches bugs that unit tests miss — e.g. a broken Axios interceptor,
 * a misconfigured route guard, or a JWT that isn't being stored correctly.
 *
 * Prerequisites: frontend running on http://localhost:5173
 *                backend running on http://localhost:8000
 */

test.describe('Authentication', () => {
  /**
   * Test 1 — Successful login
   *
   * Verifies the happy path: valid credentials → redirect to Dashboard → welcome message.
   * This confirms the full auth chain works: form submission → API call → JWT stored →
   * React Router redirects → Dashboard renders the logged-in user's name.
   */
  test('successful login redirects to dashboard and shows welcome message', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for the redirect to complete and the dashboard heading to appear.
    // toBeVisible() waits automatically — no manual sleep needed.
    await expect(page.getByText('Welcome, admin')).toBeVisible();
    await expect(page).toHaveURL('/dashboard');
  });

  /**
   * Test 2 — Failed login
   *
   * Verifies that wrong credentials show an error and keep the user on the login page.
   * This confirms the backend 401 is caught, the error is surfaced in the UI,
   * and the app does NOT redirect to the dashboard on failure.
   */
  test('wrong password shows error and stays on login page', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // The error div appears with the API's error message
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page).not.toHaveURL('/dashboard');
  });

  /**
   * Test 3 — Protected route redirect
   *
   * Verifies that navigating directly to /dashboard without a token
   * redirects unauthenticated users back to the login page.
   * This tests the ProtectedRoute component — the client-side guard
   * that checks localStorage for a JWT before allowing access.
   */
  test('visiting /dashboard without a token redirects to login', async ({ page }) => {
    // Go directly to the protected route — no login first
    await page.goto('/dashboard');

    // Should land on /login, not stay on dashboard
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
});
