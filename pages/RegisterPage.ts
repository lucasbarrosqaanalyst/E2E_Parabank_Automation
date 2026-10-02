import { Locator, Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class RegisterPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipCodeInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly ssnInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly repeatedPasswordInput: Locator;
    readonly registerButton: Locator;
    readonly lblUserAlreadyExistsError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('[id="customer.firstName"]');
        this.lastNameInput = page.locator('[id="customer.lastName"]');
        this.addressInput = page.locator('[id="customer.address.street"]');
        this.cityInput = page.locator('[id="customer.address.city"]');
        this.stateInput = page.locator('[id="customer.address.state"]');
        this.zipCodeInput = page.locator('[id="customer.address.zipCode"]');
        this.phoneNumberInput = page.locator('[id="customer.phoneNumber"]');
        this.ssnInput = page.locator('[id="customer.ssn"]');
        this.usernameInput = page.locator('[id="customer.username"]');
        this.passwordInput = page.locator('[id="customer.password"]');
        this.repeatedPasswordInput = page.locator('[id="repeatedPassword"]');
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.lblUserAlreadyExistsError = page.locator('[id="customer.username.errors"]');
    }

    // Access the page where the tests will be done
    async goTo(){
        await this.page.goto('https://parabank.parasoft.com/parabank/register.htm');
    }

    // Fill the registration form with random data using faker.js library
    async fillRegistrationForm() {
        await this.firstNameInput.fill(faker.person.firstName());
        await this.lastNameInput.fill(faker.person.lastName());
        await this.addressInput.fill(faker.location.streetAddress());
        await this.cityInput.fill(faker.location.city());
        await this.stateInput.fill(faker.location.state());
        await this.zipCodeInput.fill(faker.location.zipCode());
        await this.phoneNumberInput.fill(faker.phone.number());
        await this.ssnInput.fill(faker.string.numeric(9));
    }

    // Fill the credentials fields with the provided username and password
    async fillCredentials(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.repeatedPasswordInput.fill(password);
    }

    // Submit the registration form with button click
    async submitForm() {
        await this.registerButton.click();
    }

    // Error must be visible when the username already exists in the system
    async isErrorVisible(){
        return await this.lblUserAlreadyExistsError.isVisible();
    }

    // Verify that the registration was successful by checking the welcome message and success message
    async verifyRegistrationSuccess(username: string) {
        const headerText = await this.page.getByRole('heading', { name: `Welcome ${username}` }).textContent();
        const successMessage = await this.page.getByText('Your account was created').textContent();
        if(headerText && successMessage){
            await expect(headerText).toBe(`Welcome ${username}`);
            await expect(successMessage).toBe('Your account was created successfully. You are now logged in.');
        }
    }

}