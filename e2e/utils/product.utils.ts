import { type Page, expect } from '@playwright/test';
import type { ProductInfo } from '../types/test-data.types';
import { parsePrice } from './price.utils';
import { ECOM_SELECTORS } from '../constants/selectors';

export const selectProductByPrice = async (
   page: Page,
   minPrice: number
): Promise<ProductInfo | null> => {
   const productItems = await page.locator(ECOM_SELECTORS.PRODUCT.ITEM).all();

   for (const item of productItems) {
      const priceText = await item.locator(ECOM_SELECTORS.PRODUCT.PRICE).textContent();
      const price = parsePrice(priceText);

      if (price > minPrice) {
         const name = (await item.locator(ECOM_SELECTORS.PRODUCT.TITLE).textContent()) || '';
         await item.locator(ECOM_SELECTORS.PRODUCT.TITLE).click();

         return { name, price };
      }
   }

   return null;
};

export const addProductToCart = async (page: Page) => {
   await page.click(ECOM_SELECTORS.PRODUCT.ADD_TO_CART);
   await page.waitForSelector(ECOM_SELECTORS.CART.NOTIFICATION, { state: 'visible' });
};

export const updateCartItemQuantity = async (
   page: Page,
   productName: string,
   newQuantity: number
) => {
   const productRow = page.locator(ECOM_SELECTORS.CART.ITEM_ROW).filter({ hasText: productName });
   await productRow.locator(ECOM_SELECTORS.CART.QUANTITY_INPUT).fill(newQuantity.toString());
   await page.click(ECOM_SELECTORS.CART.UPDATE_BUTTON);
};

export const removeCartItem = async (page: Page, productName: string) => {
   const productRow = page.locator(ECOM_SELECTORS.CART.ITEM_ROW).filter({ hasText: productName });
   await productRow.locator(ECOM_SELECTORS.CART.REMOVE_CHECKBOX).check();

   await page.click(ECOM_SELECTORS.CART.UPDATE_BUTTON);
};

export const getCartItemQuantity = async (page: Page, productName: string) => {
   const productRow = page.locator(ECOM_SELECTORS.CART.ITEM_ROW).filter({ hasText: productName });
   const quantity = await productRow.locator(ECOM_SELECTORS.CART.QUANTITY_INPUT).inputValue();

   return parseInt(quantity, 10);
};

export const verifyCartArithmetic = async (page: Page) => {
   const rows = await page.locator(ECOM_SELECTORS.CART.ITEM_ROW).all();
   let expectedTotal = 0;

   for (const row of rows) {
      const unitPrice = parsePrice(await row.locator(ECOM_SELECTORS.CART.UNIT_PRICE).textContent());
      const quantity = parseInt(
         await row.locator(ECOM_SELECTORS.CART.QUANTITY_INPUT).inputValue(),
         10,
      );
      const subtotal = parsePrice(await row.locator(ECOM_SELECTORS.CART.SUBTOTAL).textContent());

      expect(subtotal).toBeCloseTo(unitPrice * quantity, 2);
      expectedTotal += subtotal;
   }

   const orderTotal = parsePrice(
      await page.locator(ECOM_SELECTORS.CART.TOTAL_PRICE).textContent(),
   );
   expect(orderTotal).toBeGreaterThanOrEqual(expectedTotal);
};