import { test, expect } from '@playwright/test';

test('Open web shop home page', async ({ page }) => {
   await page.goto('https://demowebshop.tricentis.com/');

   await expect(page).toHaveTitle(/Demo Web Shop/);
});