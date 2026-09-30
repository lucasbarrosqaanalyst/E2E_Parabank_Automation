import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { faker } from '@faker-js/faker';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');


test('Register at Parabank', async ({ page }) => {
  const MAX_RETRIES = 3;
  const password = faker.internet.password();
  const registerPage = new RegisterPage(page);
  
  for(let i=0; i<MAX_RETRIES; i++){
    let username = faker.internet.username();
    await registerPage.goTo();
    await registerPage.fillRegistrationForm();
    await registerPage.fillCredentials(username, password);
    await registerPage.submitForm();
    await page.waitForLoadState('networkidle');

    if(await registerPage.isErrorVisible()){
      continue;
    } 

    await registerPage.verifyRegistrationSuccess(username);
    await page.context().storageState({ path: authFile });
    break;

  }
  
});

// test('Open a new bank account', async ({ page }) => {
//   await page.getByRole('link', { name: 'Open New Account' }).click();
//   await page.getByRole('heading', { name: 'Open New Account' }).click();
  
//   await page.getByRole('heading', { name: 'Open New Account' }).click();
//   await page.getByRole('button', { name: 'Open New Account' }).click();
//   await page.getByRole('heading', { name: 'Account Opened!' }).click();
//   await page.getByText('Congratulations, your account').click();
//   await page.getByText('Your new account number: 18783').click();  
// });


// test('Transfer funds', async ({ page }) => {
//   await page.getByRole('link', { name: 'Transfer Funds' }).click();
//   await page.getByRole('heading', { name: 'Transfer Funds' }).click();
//   await page.locator('#amount').click();
//   await page.locator('#amount').fill('1000');
//   await page.locator('#toAccountId').selectOption('18783');
//   await page.getByRole('button', { name: 'Transfer' }).click();
//   await page.getByRole('heading', { name: 'Transfer Complete!' }).click();
//   await page.getByText('$1000.00 has been transferred').click();
//   await page.getByText('See Account Activity for more').click();
// });

