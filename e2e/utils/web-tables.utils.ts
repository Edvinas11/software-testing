import type { Page } from '@playwright/test';
import { DEMOQA_SELECTORS } from '../constants/selectors';

export interface TableRowData {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  salary: string;
  department: string;
}

export const addTableRow = async (page: Page, rowData: TableRowData) => {
  await page.click(DEMOQA_SELECTORS.WEB_TABLES.ADD_BUTTON);
  await page.waitForSelector(DEMOQA_SELECTORS.MODAL.CONTAINER, { state: 'visible' });

  await page.fill(DEMOQA_SELECTORS.MODAL.FORM.FIRST_NAME, rowData.firstName);
  await page.fill(DEMOQA_SELECTORS.MODAL.FORM.LAST_NAME, rowData.lastName);
  await page.fill(DEMOQA_SELECTORS.MODAL.FORM.EMAIL, rowData.email);
  await page.fill(DEMOQA_SELECTORS.MODAL.FORM.AGE, rowData.age);
  await page.fill(DEMOQA_SELECTORS.MODAL.FORM.SALARY, rowData.salary);
  await page.fill(DEMOQA_SELECTORS.MODAL.FORM.DEPARTMENT, rowData.department);

  await page.click(DEMOQA_SELECTORS.MODAL.FORM.SUBMIT_BUTTON);
  await page.waitForSelector(DEMOQA_SELECTORS.MODAL.CONTAINER, { state: 'hidden' });
};

export const generateTableRowData = (index: number): TableRowData => ({
  firstName: `TestFirst${index}`,
  lastName: `TestLast${index}`,
  age: `${20 + index}`,
  email: `test${index}@example.com`,
  salary: `${50000 + index * 1000}`,
  department: `Department${index}`,
});