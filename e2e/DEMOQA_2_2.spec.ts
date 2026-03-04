import { test, expect } from '@playwright/test';
import { navigateToHome, navigateToSection, addTableRow, generateTableRowData } from './utils';
import { APP_CONFIG, DEMOQA_SELECTORS, URL_PATTERNS } from './constants/selectors';

test("DEMOQA: Web Tables", async ({page}) => {
   // 1. Navigate to home page and verify
   await navigateToHome(page, APP_CONFIG.DEMOQA_BASE_URL, DEMOQA_SELECTORS.HEADER.LOGO);
   await navigateToSection(page, DEMOQA_SELECTORS.TABS.ELEMENTS, URL_PATTERNS.ELEMENTS);
   await navigateToSection(page, DEMOQA_SELECTORS.ELEMENTS.WEB_TABLES, URL_PATTERNS.WEB_TABLES);

   // 5. Add 8 rows to the table
  for (let i = 1; i <= 8; i++) {
    await addTableRow(page, generateTableRowData(i));
  }

  await expect(page.locator(DEMOQA_SELECTORS.WEB_TABLES.PAGINATION.CONTAINER)).toContainText(
    '1 of 2'
  );

  await page.locator(DEMOQA_SELECTORS.WEB_TABLES.PAGINATION.NEXT_BUTTON).click();
  await page.locator(DEMOQA_SELECTORS.WEB_TABLES.DELETE_BUTTON).click();
  await expect(page.locator(DEMOQA_SELECTORS.WEB_TABLES.PAGINATION.CONTAINER)).toContainText(
    '1 of 1'
  );
});