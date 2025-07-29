import { test as base } from '@playwright/test';
import { PetStoreLoginPage } from '../page/petStoreLoginPage'
import { PetStoreHomePage } from '../page/petStoreHomePage'

type PageFixture = {
  petStoreLoginPage: PetStoreLoginPage;
  petStoreHomePage: PetStoreHomePage;
};

export const test = base.extend<PageFixture>({
  petStoreLoginPage: async ({ page }, use) => {
    const loginPage = new PetStoreLoginPage(page);
    await use(loginPage);
  },
  petStoreHomePage: async ({ page }, use) => {
    const dashboardPage = new PetStoreHomePage(page);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
