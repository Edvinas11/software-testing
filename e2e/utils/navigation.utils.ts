import type { Page } from '@playwright/test';

export const navigateToSection = async (page: Page, linkSelector: string, urlPattern: RegExp) => {
   await page.click(linkSelector);
   await page.waitForURL(urlPattern);
};

export const navigateToHome = async (page: Page, baseUrl: string, logoSelector: string) => {
   await page.goto(baseUrl);
   await page.waitForSelector(logoSelector, { state: 'visible' });
};