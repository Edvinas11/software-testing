export const ECOM_SELECTORS = {
   HEADER: {
      LOGO: '.header-logo',
      MENU: '.header-menu',
      ACCOUNT: '.header-links .account',
   },

   NAV: {
      REGISTER: 'a[href="/register"]',
      LOGIN: 'a[href="/login]',
      COMPUTERS: 'a[href="computers"]',
      NOTEBOOKS: 'a[href="/notebooks"]',
      ELECTRONICS: 'a[href="/electronics"]',
      CELL_PHONES: 'a[href="/cell-phones"]',
      CART: 'a[href="/cart"]',
   },

   LOGIN: {
      EMAIL: '#Email',
      PASSWORD: '#Password',
      SUBMIT_BUTTON: 'input[value="Log in"]',
   },

   REGISTRATION: {
      GENDER_MALE: '#gender-male',
      FIRST_NAME: '#FirstName',
      LAST_NAME: '#LastName',
      EMAIL: '#Email',
      PASSWORD: '#Password',
      CONFIRM_PASSWORD: '#ConfirmPassword',
      SUBMIT_BUTTON: '#register-button',
      SUCCESS_MESSAGE: '.result',
   },

   PRODUCT: {
      ITEM: '.product-item',
      TITLE: '.product-title a',
      PRICE: '.actual-price',
      NAME_HEADING: '.product-name h1',
      ADD_TO_CART: 'input[value="Add to cart"]',
   },

   CART: {
      NOTIFICATION: '#bar-notification',
      QUANTITY_BADGE: '.cart-qty',
      ITEM_ROW: '.cart-item-row',
      QUANTITY_INPUT: '.qty-input',
      UPDATE_BUTTON: 'input[name="updatecart"]',
      REMOVE_CHECKBOX: 'input[name="removefromcart"]',
      TOTAL_PRICE: '.cart-total-right .order-total',
      TERMS_CHECKBOX: '#termsofservice',
      CHECKOUT_BUTTON: '#checkout',
   },

   BILLING: {
      COUNTRY: '#BillingNewAddress_CountryId',
      CITY: '#BillingNewAddress_City',
      ADDRESS: '#BillingNewAddress_Address1',
      ZIP_CODE: '#BillingNewAddress_ZipPostalCode',
      PHONE: '#BillingNewAddress_PhoneNumber',
      CONTINUE_BUTTON: 'input[onclick="Billing.save()"]',
      INFO_DISPLAY: '.billing-info',
   },

   SHIPPING: {
      CONTAINER: '#shipping-buttons-container',
      CONTINUE_BUTTON: 'input[onclick="Shipping.save()"]',
   },

   SHIPPING_METHOD: {
      CONTAINER: '#shipping-method-buttons-container',
      CONTINUE_BUTTON: 'input[onclick="ShippingMethod.save()"]',
   },

   PAYMENT: {
      METHOD_CONTAINER: '#payment-method-buttons-container',
      METHOD_CONTINUE_BUTTON: 'input[onclick="PaymentMethod.save()"]',
      INFO_CONTAINER: '#payment-info-buttons-container',
      INFO_CONTINUE_BUTTON: 'input[onclick="PaymentInfo.save()"]',
   },

   ORDER: {
      REVIEW_DATA: '.order-review-data',
      CART_TABLE: 'table.cart',
      CONFIRM_BUTTON: 'input[value="Confirm"]',
      COMPLETION_TITLE: '.section.order-completed .title',
      DETAILS: 'ul.details',
   },
} as const;

export const DEMOQA_SELECTORS = {
   HEADER: {
      LOGO: 'a[href="https://demoqa.com"]',
   },

   TABS: {
      ELEMENTS: 'a[href="/elements"]',
      WIDGETS: 'a[href="/widgets"]',
   },

   ELEMENTS: {
      WEB_TABLES: 'a[href="/webtables"]',
      DYNAMIC_PROPERTIES: 'a[href="/dynamic-properties"]',
   },

   WIDGETS: {
      PROGRESS_BAR: 'a[href="/progress-bar"]',
   },

   PROGRESS_BAR: {
      START_STOP_BUTTON: '#startStopButton',
      RESET_BUTTON: '#resetButton',
      PROGRESS_BAR: '[role="progressbar"]',
   },

   DYNAMIC_PROPERTIES: {
      ENABLE_AFTER_BUTTON: '#enableAfter',
      VISIBLE_AFTER_ELEMENT: '#visibleAfter',
      COLOR_CHANGE_BUTTON: '#colorChange',
   },

   AD_SECTION: '.container > div > div:nth-child(3)',

   WEB_TABLES: {
      ADD_BUTTON: '#addNewRecordButton',
      SEARCH_BOX: '#searchBox',
      TABLE: '.rt-table',
      TABLE_ROW: '.rt-tbody .rt-tr-group',
      TABLE_CELL: '.rt-td',
      DELETE_BUTTON: '[id^="delete-record-"]',
      PAGINATION: {
         NEXT_BUTTON: 'button:has-text("Next")',
         CONTAINER: '.pagination',
      },
   },

   MODAL: {
      CONTAINER: '.modal-content',
      FORM: {
         FIRST_NAME: '#firstName',
         LAST_NAME: '#lastName',
         EMAIL: '#userEmail',
         AGE: '#age',
         SALARY: '#salary',
         DEPARTMENT: '#department',
         SUBMIT_BUTTON: '#submit',
      },
   },
};

export const URL_PATTERNS = {
   REGISTER: /.*register/,
   LOGIN: /.*login/,
   COMPUTERS: /.*computers/,
   NOTEBOOKS: /.*notebooks/,
   ELECTRONICS: /.*electronics/,
   CELL_PHONES: /.*cell-phones/,
   CART: /.*cart/,
   CHECKOUT: /.*checkout/,
   ORDER_COMPLETED: /.*completed/,
   ELEMENTS: /.*elements/,
   WEB_TABLES: /.*webtables/,
   WIDGETS: /.*widgets/,
   PROGRESS_BAR: /.*progress-bar/,
   DYNAMIC_PROPERTIES: /.*dynamic-properties/,
} as const;

export const APP_CONFIG = {
   ECOM_BASE_URL: 'https://demowebshop.tricentis.com/',
   DEMOQA_BASE_URL: 'https://demoqa.com/',
   DEFAULT_COUNTRY: 'United States',
} as const;