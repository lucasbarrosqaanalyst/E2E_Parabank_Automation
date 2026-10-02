import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { faker } from '@faker-js/faker';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');


test('Register at Parabank', async ({ page }) => {
  const MAX_RETRIES = 3;
  const password = faker.internet.password();
  const registerPage = new RegisterPage(page);
  
  for(let i=0; i <= MAX_RETRIES; i++){
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
