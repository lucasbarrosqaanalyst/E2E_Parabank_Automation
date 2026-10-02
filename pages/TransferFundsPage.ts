import { Locator, Page, expect } from '@playwright/test';

export class TransferFundsPage {
    readonly page: Page;
    readonly transferFundsLink: Locator;
    readonly amountInput: Locator;
    readonly fromAccountId: Locator;
    readonly toAccountSelect: Locator;
    readonly transferButton: Locator;
    readonly transferCompleteHeading: Locator;
    readonly transferSuccessMessage: Locator;
 
    constructor(page: Page) {
        this.page = page;
        this.transferFundsLink = page.locator('.services').getByRole('link', { name: 'Transfer Funds' });
        this.amountInput = page.locator('[id="amount"]');
        this.fromAccountId = page.locator('[id="fromAccountId"]');
        this.toAccountSelect = page.locator('[id="toAccountId"]');
        this.transferButton = page.getByRole('button', { name: 'Transfer' });
        this.transferCompleteHeading = page.getByRole('heading', { name: 'Transfer Complete!' });
        this.transferSuccessMessage = page.getByText(/has been transferred from account/);
    }

    // Method: Access the transfer funds page where the tests will be done
    async goTo(){
        await this.transferFundsLink.click();
    }

    // Method: Fill in the transfer form including amount and to account
    async fillTransferDetails(amount: string, toAccountId: string) {
        await this.amountInput.fill(amount);
        await this.fromAccountId.selectOption({index:0});
        await this.toAccountSelect.selectOption(toAccountId);
    }

    // Method: Click the button to submit the transfer form
    async submitTransferForm() {
        await this.transferButton.click();
    }

    // Method: Get the selected origin account ID from the dropdown
    async getFromAccountId() {
        return await this.fromAccountId.locator('option:checked').textContent();
    }

    // Method: Verify that the transfer was successful by checking for the presence of the success message and the transfer details
    async verifyTransferSuccess(amount: string, fromAccountId: string, toAccountId: string) {
        await expect(this.transferCompleteHeading).toBeVisible();
        await expect(this.transferSuccessMessage).toContainText(`$${amount}.00 has been transferred from account ${fromAccountId} to account ${toAccountId}`);
    }

}

