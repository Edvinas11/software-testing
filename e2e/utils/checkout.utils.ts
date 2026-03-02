import type { Page } from '@playwright/test';
import type { BillingAddress } from '../types/test-data.types';
import { ECOM_SELECTORS, URL_PATTERNS } from '../constants/selectors';
import { navigateToSection } from './navigation.utils';

export const fillBillingAddress = async (page: Page, billingData: BillingAddress) => {
   await page.selectOption(ECOM_SELECTORS.BILLING.COUNTRY, { label: billingData.country });
   await page.fill(ECOM_SELECTORS.BILLING.CITY, billingData.city);
   await page.fill(ECOM_SELECTORS.BILLING.ADDRESS, billingData.address);
   await page.fill(ECOM_SELECTORS.BILLING.ZIP_CODE, billingData.zipCode);
   await page.fill(ECOM_SELECTORS.BILLING.PHONE, billingData.phone);
};

export const completeCheckoutSteps = async (page: Page) => {
   await page.click(ECOM_SELECTORS.BILLING.CONTINUE_BUTTON);
   await page.waitForSelector(ECOM_SELECTORS.SHIPPING.CONTAINER);

   await page.click(ECOM_SELECTORS.SHIPPING.CONTINUE_BUTTON);
   await page.waitForSelector(ECOM_SELECTORS.SHIPPING_METHOD.CONTAINER);

   await page.click(ECOM_SELECTORS.SHIPPING_METHOD.CONTINUE_BUTTON);
   await page.waitForSelector(ECOM_SELECTORS.PAYMENT.METHOD_CONTAINER);

   await page.click(ECOM_SELECTORS.PAYMENT.METHOD_CONTINUE_BUTTON);
   await page.waitForSelector(ECOM_SELECTORS.PAYMENT.INFO_CONTAINER);

   await page.click(ECOM_SELECTORS.PAYMENT.INFO_CONTINUE_BUTTON);
};

export const proceedToCheckout = async (page: Page) => {
   await page.check(ECOM_SELECTORS.CART.TERMS_CHECKBOX);
   await page.click(ECOM_SELECTORS.CART.CHECKOUT_BUTTON);
};

export const clearCart = async (page: Page) => {
   await navigateToSection(page, ECOM_SELECTORS.NAV.CART, URL_PATTERNS.CART);
   const removeCheckboxes = page.locator(ECOM_SELECTORS.CART.REMOVE_CHECKBOX);
   const count = await removeCheckboxes.count();

   if (count === 0) {
      return;
   }

   await removeCheckboxes.evaluateAll((checkboxes: HTMLInputElement[]) =>
      checkboxes.forEach((cb) => (cb.checked = true))
   );
   await page.click(ECOM_SELECTORS.CART.UPDATE_BUTTON);
   await page.waitForSelector(ECOM_SELECTORS.CART.ITEM_ROW, { state: 'detached' });
};

export const confirmOrder = async (page: Page) => {
   await page.waitForSelector(ECOM_SELECTORS.ORDER.REVIEW_DATA);
   await page.click(ECOM_SELECTORS.ORDER.CONFIRM_BUTTON);
};

export const getOrderNumber = async (page: Page) =>
   (await page.locator(ECOM_SELECTORS.ORDER.DETAILS).textContent()) || '';