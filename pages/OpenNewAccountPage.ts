import { Locator, Page, expect } from '@playwright/test';

export class OpenNewAccountPage {
    readonly page: Page;
    readonly openNewAccountLink: Locator;
    readonly accountTypeSelect: Locator;
    readonly openNewAccountButton: Locator;
    readonly newAccountId: Locator;
    readonly accountOpenedHeading: Locator;
    readonly successMessage: Locator;
    readonly newAccountMessage: Locator;
 
    constructor(page: Page) {
        this.page = page;
        this.openNewAccountLink = page.locator('#leftPanel').getByRole('link', { name: 'Open New Account' });
        this.accountTypeSelect = page.locator('[id="type"]');
        this.openNewAccountButton = page.getByRole('button', { name: 'Open New Account' });
        this.newAccountId = page.locator('[id="newAccountId"]');
        this.accountOpenedHeading = page.getByRole('heading', { name: 'Account Opened' });
        this.successMessage = page.getByText('Congratulations, your account is now open.');
        this.newAccountMessage = page.locator('[id="OpenAccountResult"]');
    }

    // Method: Access the page where the tests will be done
    async goTo(){
        await this.openNewAccountLink.click();
    }

    // Method: Select the account type from the dropdown menu
    async selectAccountType(accountType: string) {
        await this.accountTypeSelect.selectOption(accountType);
    }

    // Method: Click the button to submit the form and open a new account
    async submitAccountForm() {
        await this.openNewAccountButton.click();
    }

    // Method: Get the new account ID from the page after the account is opened
    async getNewAccountId() {
        return await this.newAccountId.textContent();
    }

    // Method: Verify that the account was created successfully by checking for the presence of the success message and the new account ID
    async verifyAccountCreation(newAccountId: string) {
        await expect(this.accountOpenedHeading).toBeVisible();
        await expect(this.successMessage).toBeVisible();
        const newAccountMessageText = await this.newAccountMessage.textContent();
        await expect(newAccountMessageText).toContain(newAccountId);
    }

}

