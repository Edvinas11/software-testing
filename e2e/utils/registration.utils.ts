import type { Page } from '@playwright/test';
import type { UserRegistrationData } from '../types/test-data.types';
import { ECOM_SELECTORS } from '../constants/selectors';

export const registerUser = async (page: Page, userData: UserRegistrationData) => {
   await page.click(ECOM_SELECTORS.REGISTRATION.GENDER_MALE);
   await page.fill(ECOM_SELECTORS.REGISTRATION.FIRST_NAME, userData.firstName);
   await page.fill(ECOM_SELECTORS.REGISTRATION.LAST_NAME, userData.lastName);
   await page.fill(ECOM_SELECTORS.REGISTRATION.EMAIL, userData.email);
   await page.fill(ECOM_SELECTORS.REGISTRATION.PASSWORD, userData.password);
   await page.fill(ECOM_SELECTORS.REGISTRATION.CONFIRM_PASSWORD, userData.password);

   await page.click(ECOM_SELECTORS.REGISTRATION.SUBMIT_BUTTON);
};

export const loginUser = async (page: Page, userData: Pick<UserRegistrationData, 'email' | 'password'>) => {
   await page.fill(ECOM_SELECTORS.LOGIN.EMAIL, userData.email);
   await page.fill(ECOM_SELECTORS.LOGIN.PASSWORD, userData.password);
   await page.click(ECOM_SELECTORS.LOGIN.SUBMIT_BUTTON);
};