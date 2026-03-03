import { test, expect } from '@playwright/test'
import {
   generateTestUserData,
   parsePrice,
   selectProductByPrice,
   addProductToCart,
   updateCartItemQuantity,
   removeCartItem,
   getCartItemQuantity,
   registerUser,
   fillBillingAddress,
   completeCheckoutSteps,
   proceedToCheckout,
   confirmOrder,
   getOrderNumber,
   navigateToSection,
   navigateToHome,
} from './utils';
import { ECOM_SELECTORS, URL_PATTERNS, APP_CONFIG } from './constants';

test('TC-E2E-ECOM-001: End-to-End Purchase Flow for High-Value Products', async ({ page }) => {
   const testData = generateTestUserData();

   // 1. Navigate to home page and verify
   await navigateToHome(page, APP_CONFIG.ECOM_BASE_URL, ECOM_SELECTORS.HEADER.LOGO);
   await expect(page.locator(ECOM_SELECTORS.HEADER.MENU)).toBeVisible();

   // 2-8. Navigate to registration page and register a new user
   await navigateToSection(page, ECOM_SELECTORS.NAV.REGISTER, URL_PATTERNS.REGISTER);
   // Register user
   await registerUser(page, testData);
   await expect(page.locator(ECOM_SELECTORS.REGISTRATION.SUCCESS_MESSAGE)).toContainText(
      'Your registration completed'
   );
   // Verify logged in email
   await expect(page.locator(ECOM_SELECTORS.HEADER.ACCOUNT)).toContainText(testData.email);

   // 9. Navigate to Computers
   await navigateToSection(page, ECOM_SELECTORS.NAV.COMPUTERS, URL_PATTERNS.COMPUTERS);

   // 10. Open Desktops
   await navigateToSection(page, ECOM_SELECTORS.NAV.DESKTOPS, URL_PATTERNS.DESKTOPS);

   // 11. Sort by price high to low
   // await page.selectOption('select#products-orderby', 'Price: High to Low');

   // 12. Select Desktop above $900
   const desktop = await selectProductByPrice(page, 900)
   expect(desktop).not.toBeNull();
   expect(desktop!.price).toBeGreaterThan(900);

   await expect(page.locator(ECOM_SELECTORS.PRODUCT.NAME_HEADING)).toContainText(desktop!.name);

   // 13. Select required HDD option, add to cart, and verify counter (Create)
   await page.getByLabel('320 GB').check();
   await addProductToCart(page);
   await expect(page.locator(ECOM_SELECTORS.CART.QUANTITY_BADGE)).toContainText('(1)');

   // 14. Navigate to Jewelry
   await navigateToSection(page, ECOM_SELECTORS.NAV.JEWELRY, URL_PATTERNS.JEWELRY);

   // 15. Select Jewelry above $900
   const jewelry = await selectProductByPrice(page, 100)
   expect(jewelry).not.toBeNull();
   expect(jewelry!.price).toBeGreaterThan(100);

   await expect(page.locator(ECOM_SELECTORS.PRODUCT.NAME_HEADING)).toContainText(jewelry!.name);

   // 16. Add to cart and verify counter (Create)
   await addProductToCart(page);
   await expect(page.locator(ECOM_SELECTORS.CART.QUANTITY_BADGE)).toContainText('(2)');

   // 17. Open cart
   await navigateToSection(page, ECOM_SELECTORS.NAV.CART, URL_PATTERNS.CART);

   // 18. Assert both items are present
   await expect(page.locator(ECOM_SELECTORS.CART.ITEM_ROW)).toHaveCount(2);

   // 19. Update desktop quantity to 2 and verify (Update)
   await updateCartItemQuantity(page, desktop!.name, 2);

   const updatedQuantity = await getCartItemQuantity(page, desktop!.name);
   expect(updatedQuantity).toBe(2);

   // 20. Remove jewelry item and verify only desktop remains
   await removeCartItem(page, jewelry!.name);

   const remainingItems = await page.locator(ECOM_SELECTORS.CART.ITEM_ROW).count()
   expect(remainingItems).toBe(1);

   // 21-22. Accept terms and proceed to checkout
   await proceedToCheckout(page);
   await expect(page).toHaveURL(URL_PATTERNS.CHECKOUT);

   // 23. Fill billing address with generated data
   await fillBillingAddress(page, testData);

   // 24-27. Complete remaining checkout steps (shipping, payment, review)
   await completeCheckoutSteps(page);

   // 28. Confirm order
   await confirmOrder(page);

   // 29. Assert order confirmation page shows order number
   await expect(page).toHaveURL(URL_PATTERNS.ORDER_COMPLETED);
   await expect(page.locator(ECOM_SELECTORS.ORDER.COMPLETION_TITLE)).toContainText(
      'Your order has been successfully processed!'
   );

   const orderNumberText = await getOrderNumber(page);
   expect(orderNumberText).toMatch(/Order number: \d+/);
});
