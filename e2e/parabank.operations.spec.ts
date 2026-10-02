import { test, expect } from '@playwright/test';
import { OpenNewAccountPage } from '../pages/OpenNewAccountPage';
import { faker } from '@faker-js/faker';

let newAccountId;
let fromAccountId;

test.beforeEach(async ({ page }) => {
  // Navigate to the login page and log in with valid credentials
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
});


test('Open a new bank account', async ({ page }) => {
  const accountPage = new OpenNewAccountPage(page);
  await accountPage.goTo();
  await accountPage.selectAccountType('1');
  await page.waitForLoadState('networkidle');
  await accountPage.submitAccountForm();
  newAccountId = await accountPage.getNewAccountId();
  if (newAccountId === null) {
    throw new Error('New account ID was not found');
  }
  await accountPage.verifyAccountCreation(newAccountId);
});


test('Transfer funds', async ({ page }) => {
  await page.getByRole('link', { name: 'Transfer Funds' }).click();
  await page.getByRole('heading', { name: 'Transfer Funds' }).click();
  await page.locator('#amount').click();
  await page.locator('#amount').fill('1000');
  await page.locator('#toAccountId').selectOption('18783');
  await page.getByRole('button', { name: 'Transfer' }).click();
  await page.getByRole('heading', { name: 'Transfer Complete!' }).click();
  await page.getByText('$1000.00 has been transferred').click();
  await page.getByText('See Account Activity for more').click();
});

