import { test, expect } from '@playwright/test';
import {
  loadTestUsersFromFile,
  navigateToHome,
  navigateToSection,
  loginUser,
  selectProductByPrice,
  addProductToCart,
  proceedToCheckout,
  completeCheckoutSteps,
  confirmOrder,
  getOrderNumber,
  clearCart,
} from './utils';
import { ECOM_SELECTORS, URL_PATTERNS, APP_CONFIG } from './constants';

const testUsers = loadTestUsersFromFile();

for (const userData of testUsers) {
   test.describe(`ECOM_4_!: Data-Driven Purchase - ${userData.email}`, () => {
      test.beforeEach(async ({ page }) => {
         await navigateToHome(page, APP_CONFIG.ECOM_BASE_URL, ECOM_SELECTORS.HEADER.LOGO);
         await navigateToSection(page, ECOM_SELECTORS.NAV.LOGIN, URL_PATTERNS.LOGIN);
         await loginUser(page, userData);
         await expect(page.locator(ECOM_SELECTORS.HEADER.ACCOUNT)).toContainText(userData.email);
         await expect(page.locator(ECOM_SELECTORS.CART.QUANTITY_BADGE)).toContainText('(0)');
       });

       test.afterEach(async ({ page }) => {
         await clearCart(page);
         await page.click(ECOM_SELECTORS.NAV.LOGOUT);
         await page.waitForURL(APP_CONFIG.ECOM_BASE_URL);
         await expect(page.locator(ECOM_SELECTORS.HEADER.ACCOUNT)).not.toBeVisible();
       });

       test('purchase notebook and cell phone, complete checkout', async ({ page }) => {
         // Step 1: Navigate to Notebooks and add a notebook >$900
         await navigateToSection(page, ECOM_SELECTORS.NAV.COMPUTERS, URL_PATTERNS.COMPUTERS);
         await navigateToSection(page, ECOM_SELECTORS.NAV.NOTEBOOKS, URL_PATTERNS.NOTEBOOKS);
   
         const notebook = await selectProductByPrice(page, 900);
         expect(notebook).not.toBeNull();
         expect(notebook!.price).toBeGreaterThan(900);
         await expect(page.locator(ECOM_SELECTORS.PRODUCT.NAME_HEADING)).toContainText(notebook!.name);
   
         await addProductToCart(page);
         await expect(page.locator(ECOM_SELECTORS.CART.QUANTITY_BADGE)).toContainText('(1)');
   
         // Step 2: Navigate to Cell Phones and add a phone >$90
         await navigateToSection(page, ECOM_SELECTORS.NAV.ELECTRONICS, URL_PATTERNS.ELECTRONICS);
         await navigateToSection(page, ECOM_SELECTORS.NAV.CELL_PHONES, URL_PATTERNS.CELL_PHONES);
   
         const cellPhone = await selectProductByPrice(page, 90);
         expect(cellPhone).not.toBeNull();
         expect(cellPhone!.price).toBeGreaterThan(90);
         await expect(page.locator(ECOM_SELECTORS.PRODUCT.NAME_HEADING)).toContainText(
           cellPhone!.name
         );
   
         await addProductToCart(page);
         await expect(page.locator(ECOM_SELECTORS.CART.QUANTITY_BADGE)).toContainText('(2)');
   
         // Step 3: Proceed through checkout using billing data from the file
         await navigateToSection(page, ECOM_SELECTORS.NAV.CART, URL_PATTERNS.CART);
         await proceedToCheckout(page);
         await expect(page).toHaveURL(URL_PATTERNS.CHECKOUT);
   
         await completeCheckoutSteps(page);
   
         await expect(page.locator(ECOM_SELECTORS.BILLING.INFO_DISPLAY)).toContainText(userData.city);
         await expect(page.locator(ECOM_SELECTORS.BILLING.INFO_DISPLAY)).toContainText(
           userData.address
         );
         await expect(page.locator(ECOM_SELECTORS.ORDER.CART_TABLE)).toContainText(notebook!.name);
   
         await confirmOrder(page);
   
         await expect(page).toHaveURL(URL_PATTERNS.ORDER_COMPLETED);
         await expect(page.locator(ECOM_SELECTORS.ORDER.COMPLETION_TITLE)).toContainText(
           'Your order has been successfully processed!'
         );

         const orderNumberText = await getOrderNumber(page);
         expect(orderNumberText).toMatch(/Order number: \d+/);
      });
   });
}