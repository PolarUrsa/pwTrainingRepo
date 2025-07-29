import { test, expect } from '../fixtures/pageFixture'
import { getUserCredentials } from '../utils/getUserCredentials'

test.describe('Login with valid, and invalid user and password combinations', ()=> {

    test('Petstore login scenario with demo user', async({petStoreLoginPage}) => {
        const {username, password} = getUserCredentials('demo')        
        await petStoreLoginPage.navigateToUrl()
        await petStoreLoginPage.submitLogin(username,password,true)
    })

    test('Petstore login scenario with admin user', async({petStoreLoginPage})=> {
        const {username, password} = getUserCredentials('admin')
        await petStoreLoginPage.navigateToUrl()
        await petStoreLoginPage.submitLogin(username, password,true)
    })

     test('Petstore login scenario with invalid username and password', async({petStoreLoginPage})=> {
        const {username, password} = getUserCredentials('invalidUserAndPass')
        await petStoreLoginPage.navigateToUrl()
        await petStoreLoginPage.submitLogin(username, password,false)
    })

     test('Petstore login scenario with invalid username and valid password', async({petStoreLoginPage})=> {
        const {username, password} = getUserCredentials('invalidUsername')
        await petStoreLoginPage.navigateToUrl()
        await petStoreLoginPage.submitLogin(username, password,false)
    })

    test('Petstore login scenario with valid username and invalid password', async({petStoreLoginPage})=> {
        const {username, password} = getUserCredentials('invalidPassword')
        await petStoreLoginPage.navigateToUrl()
        await petStoreLoginPage.submitLogin(username, password,false)
    })
})

test.describe('Home page validations', ()=>{
    test.beforeEach(async({petStoreHomePage,petStoreLoginPage})=>{
        
        const {username, password} = getUserCredentials('admin')
        await petStoreLoginPage.navigateToUrl()
        await petStoreLoginPage.submitLogin(username, password,true)
    })

    test('Validate add card view function', async({petStoreHomePage})=>{        
        await petStoreHomePage.clickOnNavbarPetsButton()
        await petStoreHomePage.clickOnPetsMenuDropdown()
        await petStoreHomePage.addCardView('Card')
    })

    test('Validate add pet function', async({petStoreHomePage})=>{        
        await petStoreHomePage.clickOnNavbarPetsButton()
        await petStoreHomePage.clickOnPetsMenuDropdown()
        await petStoreHomePage.addPet("Cujo","dog","Saint Bernard","cujo.jpg")
        await petStoreHomePage.petTableValidation('Cujo')
    })

    test('Validate search pet function', async({petStoreHomePage})=>{
        await petStoreHomePage.clickOnNavbarPetsButton()
        await petStoreHomePage.clickOnPetsMenuDropdown()
        await petStoreHomePage.clickOnFindPetButton()
        await petStoreHomePage.findPetBySpecificAttribute('Status')
    })
})