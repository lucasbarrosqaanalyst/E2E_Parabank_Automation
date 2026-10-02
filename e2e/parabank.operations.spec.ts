import { test, expect } from '@playwright/test';
import { OpenNewAccountPage } from '../pages/OpenNewAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { faker } from '@faker-js/faker';

let newAccountId: string | null = null;
let fromAccountId: string | null = null;

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
  if (newAccountId === null || newAccountId === undefined) {
    throw new Error('New account ID was not found');
  }
  const transferPage = new TransferFundsPage(page);
  await transferPage.goTo();
  let transferAmount = '1000';
  fromAccountId = await transferPage.getFromAccountId();
  if (fromAccountId === null || fromAccountId === undefined) {
    throw new Error('Origin account ID was not found');
  }
  await transferPage.fillTransferDetails(transferAmount, newAccountId);
  await page.waitForLoadState('networkidle');
  await transferPage.submitTransferForm();
  await transferPage.verifyTransferSuccess(transferAmount, fromAccountId, newAccountId);
});

