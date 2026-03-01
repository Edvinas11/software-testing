import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'https://demowebshop.tricentis.com';
const PRICE_THRESHOLD = 900;

interface ProductMatch {
  name: string;
  price: number;
  index: number;
}

async function findProductAboveThreshold(
  page: Page,
  threshold: number
): Promise<ProductMatch> {
  const items = page.locator('.item-box');
  const count = await items.count();

  for (let i = 0; i < count; i++) {
    const priceEl = items.nth(i).locator('.actual-price');
    if ((await priceEl.count()) === 0) continue;

    const raw = (await priceEl.textContent()) ?? '0';
    const price = parseFloat(raw.replace(/[^0-9.]/g, ''));

    if (price > threshold) {
      const name =
        (await items.nth(i).locator('.product-title a').textContent())?.trim() ?? '';
      return { name, price, index: i };
    }
  }

  throw new Error(`No product found above $${threshold}`);
}

async function selectProductAttributes(page: Page): Promise<void> {
  const selects = page.locator('.product-essential select');
  const selectCount = await selects.count();

  for (let i = 0; i < selectCount; i++) {
    const options = selects.nth(i).locator('option');
    const optCount = await options.count();
    for (let j = 0; j < optCount; j++) {
      const val = await options.nth(j).getAttribute('value');
      if (val && val !== '0' && val !== '') {
        await selects.nth(i).selectOption(val);
        break;
      }
    }
  }

  await page.evaluate(() => {
    const radios = document.querySelectorAll<HTMLInputElement>(
      '.product-essential input[type="radio"]'
    );
    const groups = new Map<string, HTMLInputElement[]>();
    radios.forEach((r) => {
      if (!groups.has(r.name)) groups.set(r.name, []);
      groups.get(r.name)!.push(r);
    });
    groups.forEach((list) => {
      if (!list.some((r) => r.checked)) {
        list[0].click();
      }
    });
  });
}

test.describe('E-Commerce End-to-End Purchase Flow', () => {
  test('TC-E2E-ECOM-001: Purchase high-value products with dynamic price selection', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const uniqueEmail = `testuser_${Date.now()}@qa.com`;
    const password = 'VerySecurePassword123@';

    // ── Step 1: Navigate to Home ────────────────────────────────────────
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Demo Web Shop/);

    // ── Steps 2-8: Register new user ────────────────────────────────────
    await page.getByRole('link', { name: 'Register' }).first().click();
    await page.locator('#gender-male').check();
    await page.locator('#FirstName').fill('Test');
    await page.locator('#LastName').fill('User');
    await page.locator('#Email').fill(uniqueEmail);
    await page.locator('#Password').fill(password);
    await page.locator('#ConfirmPassword').fill(password);
    await page.locator('#register-button').click();

    // ✅ Verification 1: Registration completed
    await expect(page.locator('.result')).toContainText(
      'Your registration completed'
    );
    await page.getByRole('button', { name: 'Continue' }).click();

    // ── Steps 9-12: Navigate to Desktops & dynamic selection ────────────
    await page.goto(`${BASE_URL}/desktops`);
    await expect(page.locator('h1')).toHaveText('Desktops');

    const desktop = await findProductAboveThreshold(page, PRICE_THRESHOLD);

    // ✅ Verification 2 (arithmetic): Desktop price exceeds threshold
    expect(desktop.price).toBeGreaterThan(PRICE_THRESHOLD);

    await page
      .locator('.item-box')
      .nth(desktop.index)
      .locator('.product-title a')
      .click();

    await selectProductAttributes(page);

    // ── Step 13: Add desktop to cart (Create) ───────────────────────────
    await page.locator('.add-to-cart-button').click();

    // ✅ Verification 3: Product added notification
    const notification = page.locator('.bar-notification.success');
    await expect(notification).toContainText('has been added');
    await notification.locator('.close').click();

    // ── Steps 14-16: Navigate to Jewelry & dynamic selection ────────────
    await page.goto(`${BASE_URL}/jewelry`);
    await expect(page.locator('h1')).toHaveText('Jewelry');

    const jewelry = await findProductAboveThreshold(page, PRICE_THRESHOLD);

    // ✅ Verification 4 (arithmetic): Jewelry price exceeds threshold
    expect(jewelry.price).toBeGreaterThan(PRICE_THRESHOLD);

    await page
      .locator('.item-box')
      .nth(jewelry.index)
      .locator('.product-title a')
      .click();

    await selectProductAttributes(page);
    await page.locator('.add-to-cart-button').click();
    await expect(page.locator('.bar-notification.success')).toContainText(
      'has been added'
    );
    await page.locator('.bar-notification .close').click();

    // ── Step 17-18: View Cart (Read) ────────────────────────────────────
    await page.goto(`${BASE_URL}/cart`);

    const cartRows = page.locator('.cart tbody tr');
    // ✅ Verification 5: Cart contains exactly 2 items
    await expect(cartRows).toHaveCount(2);

    // ── Step 19: Update desktop quantity to 3 (Update) ──────────────────
    const desktopRow = cartRows.filter({ hasText: desktop.name });
    await desktopRow.locator('.qty-input').fill('3');
    await page.locator('input[name="updatecart"]').click();

    // Read the unit price and subtotal after update
    const unitPriceText = await desktopRow
      .locator('.product-unit-price')
      .textContent();
    const unitPrice = parseFloat(unitPriceText?.trim() ?? '0');

    const subTotalText = await desktopRow
      .locator('.product-subtotal')
      .textContent();
    const subTotal = parseFloat(subTotalText?.trim() ?? '0');

    // ✅ Verification 6 (arithmetic): sub-total = unit price × 3
    expect(subTotal).toBeCloseTo(unitPrice * 3, 2);

    // ── Step 20: Remove jewelry (Delete) ────────────────────────────────
    const jewelryRow = cartRows.filter({ hasText: jewelry.name });
    await jewelryRow.locator('input[name="removefromcart"]').check();
    await page.locator('input[name="updatecart"]').click();

    // ✅ Verification 7: Only 1 item remains after removal
    await expect(page.locator('.cart tbody tr')).toHaveCount(1);

    // ── Steps 21-35: Checkout flow ──────────────────────────────────────
    await page.locator('#termsofservice').check();
    await page.locator('#checkout').click();

    // Billing Address
    await page.locator('#billing-buttons-container').waitFor({ state: 'visible' });
    await page
      .locator('#BillingNewAddress_CountryId')
      .selectOption({ label: 'Lithuania' });
    await page.locator('#BillingNewAddress_City').fill('Vilnius');
    await page.locator('#BillingNewAddress_Address1').fill('Verkiu g. 1');
    await page
      .locator('#BillingNewAddress_ZipPostalCode')
      .fill('11111');
    await page
      .locator('#BillingNewAddress_PhoneNumber')
      .fill('37011111111');
    await page.locator('input[onclick="Billing.save()"]').click();

    // Shipping Address
    await page
      .locator('#shipping-buttons-container')
      .waitFor({ state: 'visible' });
    await page.locator('input[onclick="Shipping.save()"]').click();

    // Shipping Method
    await page
      .locator('#shipping-method-buttons-container')
      .waitFor({ state: 'visible' });
    await page.locator('input[onclick="ShippingMethod.save()"]').click();

    // Payment Method
    await page
      .locator('#payment-method-buttons-container')
      .waitFor({ state: 'visible' });
    await page.locator('input[onclick="PaymentMethod.save()"]').click();

    // Payment Information
    await page
      .locator('#payment-info-buttons-container')
      .waitFor({ state: 'visible' });
    await page.locator('input[onclick="PaymentInfo.save()"]').click();

    // Confirm Order
    await page
      .locator('#confirm-order-buttons-container')
      .waitFor({ state: 'visible' });
    await page.locator('input[onclick="ConfirmOrder.save()"]').click();

    // ✅ Verification 8: Order confirmation with order number
    const orderCompleted = page.locator('.section.order-completed');
    await expect(orderCompleted).toBeVisible();
    await expect(orderCompleted.locator('.title strong')).toContainText(
      'Your order has been successfully processed!'
    );
    await expect(orderCompleted.locator('.details')).toContainText(
      'Order number'
    );
  });
});
