import {By, Key, Builder, Select, until} from 'selenium-webdriver';
import {expect} from 'chai';
import * as path from 'path';



const webSite = "https://www.automationexercise.com/"
const upload = path.resolve("files/Binks.jpg")
const orderConfirmation = "ORDER PLACED!"

const contactUsDetails = {
    email: "Qa@Email.qa",
    first_name: "John",
    subject: "Testing subject",
    message: "This is a message",
};

const accountDetails = {
    account_name: "Qa Name",
    email: "Qa@Email.qa",
    password: "Password",
    dob: {
        day: "4",
        month: "8",
        year: "2001"
    },
    first_name: "John",
    last_name: "Smith",
    company: "Personal",
    address: "21 Grove Street",
    country: "Canada",
    state: "Hungry",
    city: "Capitol City",
    zipcode: "0sh 14a",
    mobile_number: "0123 456789",
    paymentDetails: {
        card_number: "5400437018685973",
        card_cvc: "008",
        card_expiry_month: "04",
        card_expiry_year: "2030"
    }

};
const createUser = async (browser) => {
    
    //Moves browser window 
    await browser.manage().window().setRect({x: 10, y: -1440 });
    
    //Navigate to the webpage
    await browser.get(webSite);
    
    //Is there a consent pop up, if there is select consent to close
    const isConsentPopupVisible = await browser.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
    if (isConsentPopupVisible) await browser.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

    //Select "Signup/Login"
    await browser.findElement(By.className("fa fa-lock", Key.RETURN)).click()
    
    //Is signup form visible
    const isSignupVisible = await browser.findElement(By.className("signup-form")).isDisplayed();

    if (isSignupVisible) {
        //Enter Name and Email
        await browser.findElement(By.xpath("//div[@class='signup-form']/form/input[2]")).sendKeys(accountDetails.account_name)
        await browser.findElement(By.xpath("//div[@class='signup-form']/form/input[3]")).sendKeys(accountDetails.email)
    };

    //Find submit button and click
    await browser.findElement(By.xpath("//div[@class='signup-form']/form/button", Key.RETURN)).click()

    //Is login-form visible
    const isLoginPageVisible = await browser.findElement(By.className("login-form")).isDisplayed()
    
    //Chai assert if it's not
    expect(isLoginPageVisible).to.equal(true);

    //Enter account information//

    //Array for gender options
    const genderRadio = ["//span/input[@id='id_gender1']", "//span/input[@id='id_gender2']"]
    //RNG for gender options
    const rngGenderRadio = Math.floor(Math.random() * genderRadio.length);
    //Select gender option
    await browser.findElement(By.xpath(genderRadio[rngGenderRadio])).click();

    //Password
    await browser.findElement(By.id("password")).sendKeys(accountDetails.password);

    
    //Array for dob dropdowns
    const dobDropdown = {
        days: accountDetails.dob.day,
        months: accountDetails.dob.month,
        years: accountDetails.dob.year
    }
    
    for (const [key, value] of Object.entries(dobDropdown)){
        const dropdown = await browser.findElement(By.id(key));
        const select = new Select(dropdown);
        await select.selectByValue(value);
    };

    //Sign up for the newsletter and special offers
    await browser.findElement(By.id("newsletter")).click();
    await browser.findElement(By.id("optin")).click();

    //Fill in personal details
    await browser.findElement(By.id("first_name")).sendKeys(accountDetails.first_name);
    await browser.findElement(By.id("last_name")).sendKeys(accountDetails.last_name);
    await browser.findElement(By.id("company")).sendKeys(accountDetails.company);
    await browser.findElement(By.id("address1")).sendKeys(accountDetails.address);
    await browser.findElement(By.id("state")).sendKeys(accountDetails.state);
    await browser.findElement(By.id("city")).sendKeys(accountDetails.city);
    await browser.findElement(By.id("zipcode")).sendKeys(accountDetails.zipcode);
    await browser.findElement(By.id("mobile_number")).sendKeys(accountDetails.mobile_number);

    //Submit account information
    await browser.findElement(By.className("btn btn-default")).click();

    //Check if account was created succesfully
    const afterAccCreation = await browser.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();

    expect(afterAccCreation).to.equal("ACCOUNT CREATED!");

    //Click continue
    await browser.findElement(By.className("btn btn-primary")).click();

    await adHandler(browser);
    
    const pageLoadCheck = await browser.findElement(By.className("fa fa-user"))
    await browser.wait(until.elementIsVisible(pageLoadCheck), 3000)

    //Check login user name
    const userNameTextCheck = await browser.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[10]/a/b")).getText()

    expect(userNameTextCheck).to.equal(accountDetails.account_name);
    return;
};

const userLogin = async (browser) => {

    //Moves browser window 
    await browser.manage().window().setRect({x: 10, y: -1440 });

    //Navigate to the webpage
    await browser.get(webSite);
    
    //Is there a consent pop up, if there is select consent to close
    const isConsentPopupVisible = await browser.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
    if (isConsentPopupVisible) await browser.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

    //Select "Signup/Login"
    await browser.findElement(By.className("fa fa-lock", Key.RETURN)).click()
    
    //Is signup form visible
    const isLoginVisible = await browser.findElement(By.className("login-form")).isDisplayed();

    if (isLoginVisible) {
        //Enter Email and password
        await browser.findElement(By.xpath("//div[@class='login-form']/form/input[2]")).sendKeys(accountDetails.email)
        await browser.findElement(By.xpath("//div[@class='login-form']/form/input[3]")).sendKeys(accountDetails.password)
    };

    //Find submit button and click
    await browser.findElement(By.xpath("//div[@class='login-form']/form/button", Key.RETURN)).click()

    //Check login user name
    const userNameTextCheck = await browser.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[10]/a/b")).getText()

    expect(userNameTextCheck).to.equal(accountDetails.account_name);
    return;
};

const adHandler = async(browser) => {
    let iframes = await browser.findElements(By.xpath("//iframe"));

    for (let iframe of iframes) {
        try {
            await browser.switchTo().frame(iframe);
            await browser.findElement(By.id("dismiss-button")).click();
            await browser.switchTo().defaultContent();
        } catch (error) {
            await browser.switchTo().parentFrame();
            continue;
        };
    };
};

describe("Tests_for_Website_functionality", () => {

    const homeArr = ["btn btn-success", "fa fa-home"]

    it("Succesfully uses the Contact Us form and navigates to home using the button in page body", async () => {

        //Launch Browswer    
        let driver = new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });
        
        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Click contact us link
        await driver.findElement(By.className("fa fa-envelope")).click();

        //Is contact us form visible
        let isContactUsFormVisible = await driver.findElement(By.id("contact-us-form")).isDisplayed();

        //Chai assert to check if contact us form is visible
        expect(isContactUsFormVisible).to.equal(true);

        //Send form information
        await driver.findElement(By.xpath("//input[@class='form-control'][@name='name']")).sendKeys(contactUsDetails.first_name);
        await driver.findElement(By.xpath("//input[@class='form-control'][@name='email']")).sendKeys(contactUsDetails.email);
        await driver.findElement(By.xpath("//input[@class='form-control'][@name='subject']")).sendKeys(contactUsDetails.subject);
        await driver.findElement(By.xpath("//textarea[@class='form-control'][@name='message']")).sendKeys(contactUsDetails.message);
        await driver.findElement(By.xpath("//input[@class='form-control'][@name='upload_file']")).sendKeys(upload);
        await driver.findElement(By.xpath("//input[@class='btn btn-primary pull-left submit_form']")).click();

        //Select alert
        let alert = await driver.switchTo().alert();

        //Confirm alert text
        let alertText = await alert.getText();
        expect(alertText).to.equal("Press OK to proceed!")
        
        //Accept alert
        await alert.accept();

        //Is success message visible
        let isSuccessMessageVisible = await driver.findElement(By.className("status alert alert-success")).isDisplayed()

        //Chai assert to confirm success message
        expect(isSuccessMessageVisible).to.equal(true);

        //Click home Button in page body
        await driver.findElement(By.className(homeArr[0])).click();

        //Confirm home page is loaded
        let logoIsVisible = await driver.findElement(By.className("logo pull-left")).isDisplayed();
        expect(logoIsVisible).to.equal(true);

        //Close browser
        await driver.close()
    });

    it("Succesfully uses the Contact Us form and navigates to home using the button in navigation bar", async () => {

        //Launch Browswer    
        let driver = new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Click contact us link
        await driver.findElement(By.className("fa fa-envelope")).click();

        //Is contact us form visible
        let isContactUsFormVisible = await driver.findElement(By.id("contact-us-form")).isDisplayed();

        //Chai assert to check if contact us form is visible
        expect(isContactUsFormVisible).to.equal(true);

        //Send form information
        await driver.findElement(By.xpath("//input[@class='form-control'][@name='name']")).sendKeys(contactUsDetails.first_name);
        await driver.findElement(By.xpath("//input[@class='form-control'][@name='email']")).sendKeys(contactUsDetails.email);
        await driver.findElement(By.xpath("//input[@class='form-control'][@name='subject']")).sendKeys(contactUsDetails.subject);
        await driver.findElement(By.xpath("//textarea[@class='form-control'][@name='message']")).sendKeys(contactUsDetails.message);
        await driver.findElement(By.xpath("//input[@class='form-control'][@name='upload_file']")).sendKeys(upload);
        await driver.findElement(By.xpath("//input[@class='btn btn-primary pull-left submit_form']")).click();

        //Select alert
        let alert = await driver.switchTo().alert();

        //Confirm alert text
        let alertText = await alert.getText();
        expect(alertText).to.equal("Press OK to proceed!")
        
        //Accept alert
        await alert.accept();

        //Is success message visible
        let isSuccessMessageVisible = await driver.findElement(By.className("status alert alert-success")).isDisplayed()

        //Chai assert to confirm success message
        expect(isSuccessMessageVisible).to.equal(true);

        //Click home Button in page body
        await driver.findElement(By.className(homeArr[1])).click();

        //Confirm home page is loaded
        let logoIsVisible = await driver.findElement(By.className("logo pull-left")).isDisplayed();
        expect(logoIsVisible).to.equal(true);

        //Close browser
        await driver.close()
    });

    it("Sucessfully navigates to the test cases page", async () => {
        //Launch Browswer    
        let driver = new Builder().forBrowser("chrome").build();
        
        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });
        
        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to test cases page
        await driver.findElement(By.xpath("//div[@class='item active']/div/a[@class='test_cases_list']")).click();

        //Confirm test case page is visible
        let isTestCasePageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isTestCasePageVisible).to.equal(true);

        await driver.close();
    });

    it("Sucessfully navigates to the products page and views the first product", async () => {

        //Launch browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        let isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Product information
        let productName = await driver.findElement(By.xpath("//div[@class='features_items']/div[@class='col-sm-4'][1]/div/div/div/p")).getText()
        let productPrice = await driver.findElement(By.xpath("//div[@class='features_items']/div[@class='col-sm-4'][1]/div/div/div/h2")).getText()

        //View first product
        await driver.findElement(By.xpath("//div[@class='features_items']/div[@class='col-sm-4'][1]/div/div[@class='choose']")).click();

        await adHandler(driver)

        //Product page information
        let productDetailsName = await driver.findElement(By.xpath("//div[@class='product-information']/h2")).getText()
        let productDetailsPrice = await driver.findElement(By.xpath("//div[@class='product-information']/span/span")).getText()

        //Check if its the correct product
        expect(productName).to.equal(productDetailsName);
        expect(productPrice).to.equal(productDetailsPrice);

        //Close browser
        await driver.close();
    });

    it("Sucessfully uses the search function to find a product", async ()=> {

        //Launch Browswer    
        const driver = new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });
        
        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Gather product name information
        const getProductName = async (browser) =>{
            const products = await browser.findElements(By.xpath("//div[@class='productinfo text-center']/p"));
            const rngProduct = Math.floor(Math.random() * products.length);
            const productName = await products[rngProduct].getText();
            console.log(productName);
            return productName;
        };
        const returnedProductName = await getProductName(driver)

        //Search for random product 
        await driver.findElement(By.id("search_product")).sendKeys(returnedProductName);
        await driver.findElement(By.id("submit_search")).click();
        
        //Product page information
        const productNameConfirm = await driver.findElement(By.xpath("//div[@class='productinfo text-center']/p")).getText();

        expect(productNameConfirm).to.equal(returnedProductName);

        //Close browser
        await driver.close();
    });

    it("Successfully uses the subscribe for recent updates function", async () => {
        //Launch Browswer    
        let driver = new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });
        
        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Find and scroll to the subscribe box
        const subscribeBox = await driver.findElement(By.id("susbscribe_email"));
        await driver.actions().scroll(0,0,0,200, subscribeBox).perform();

        //Enter email information
        await driver.findElement(By.id("susbscribe_email")).sendKeys(contactUsDetails.email);
        await driver.findElement(By.id("subscribe")).click();

        //confirm subscription
        const subscribeConfirm = await driver.findElement(By.className("alert-success alert")).isDisplayed();
        expect(subscribeConfirm).to.equal(true);

        //Close browser
        await driver.close()
    });

    it("Successfully uses the subscribe for recent updates function on the cart page", async () => {
        //Launch Browswer    
        let driver = new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });
        
        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Click on the cart link
        await driver.findElement(By.className("fa fa-shopping-cart")).click();

        //Verify it's the correct page
        const cartUrl = await driver.getCurrentUrl();
        expect(cartUrl).to.include("view_cart");

        //Find and scroll to the subscribe box
        const subscribeBoxScroll = await driver.findElement(By.xpath("//div[@class='single-widget']/h2"));
        await driver.actions().scroll(0,0,0,200, subscribeBoxScroll).perform();

        //Find and scroll to the subscribe box
        const subscribeBox = await driver.findElement(By.id("susbscribe_email"));
        await driver.actions().scroll(0,0,0,200, subscribeBox).perform();

        //Enter email information
        await driver.findElement(By.id("susbscribe_email")).sendKeys(contactUsDetails.email);
        await driver.findElement(By.id("subscribe")).click();

        //confirm subscription
        const subscribeConfirm = await driver.findElement(By.className("alert-success alert")).isDisplayed();
        expect(subscribeConfirm).to.equal(true);

        //Close browser
        await driver.close()
    });

    it("Sucessfully navigates to the products page and adds products to the cart", async () => {

        //Launch browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Putting the products into the cart
        //first product
        //Creating variables to store product name and price, this will be used to confirm the correct products have been sent to the cart
        const firstProductName = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/p")).getText();
        const firstProductPrice = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/a[@class='btn btn-default add-to-cart']")).click();

        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();

        //Second product
        const secondProductName = await driver.findElement(By.xpath("//div[@class ='features_items']/div[3]//div[@class='productinfo text-center']/p")).getText();
        const secondProductPrice = await driver.findElement(By.xpath("//div[@class ='features_items']/div[3]//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.xpath("//div[@class ='features_items']/div[3]//div[@class='productinfo text-center']/a[@class='btn btn-default add-to-cart']")).click();

        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();

        //Navigate to the cart
        await driver.findElement(By.className("fa fa-shopping-cart")).click();

        //Confirm that products are correct
        const firstCartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const firstCartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const firstCartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();

        const secondCartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[2]/td[2]/h4/a")).getText();
        const secondCartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[2]/td[3]/p")).getText();
        const secondCartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[2]/td[4]/button")).getText();
        
        expect(firstCartItemName).to.equal(firstProductName);
        expect(firstCartItemPrice).to.equal(firstProductPrice);
        expect(firstCartItemQuantity).to.equal("1");
        expect(secondCartItemName).to.equal(secondProductName);
        expect(secondCartItemPrice).to.equal(secondProductPrice);
        expect(secondCartItemQuantity).to.equal("1");

        //Close browser
        await driver.close();
    });

    it("Sucessfully navigates to the product details page, specify a quantity and adds product to the cart", async () => {

        //Launch browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Putting the products into the cart
        //Creating variables to store product name and price, this will be used to confirm the correct products have been sent to the cart
        const productName = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/p")).getText();
        const productPrice = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.className("nav nav-pills nav-justified")).click();

        //Function to handle ads nested in iframes
        await adHandler(driver);
        
        //Clear default quantity and replace with 4
        await driver.findElement(By.xpath("//input[@name='quantity']")).clear();
        await driver.findElement(By.xpath("//input[@name='quantity']")).sendKeys("4");

        //Add product to cart
        await driver.findElement(By.className("btn btn-default cart")).click();
        
        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();
        
        //Navigate to the cart page
        await driver.findElement(By.className("fa fa-shopping-cart")).click();
        

        //Confirm that products are correct
        const cartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();
        
        expect(cartItemName).to.equal(productName);
        expect(cartItemPrice).to.equal(productPrice);
        expect(cartItemQuantity).to.equal("4");

        //Close browser
        await driver.close();
    });

    it("Sucessfully register a new account while at the check out, then go through the purchase flow", async () => {

        //Launch browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Putting the products into the cart
        //Creating variables to store product name and price, this will be used to confirm the correct products have been sent to the cart
        const productName = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/p")).getText();
        const productPrice = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.className("nav nav-pills nav-justified")).click();

        //Function to handle ads nested in iframes
        await adHandler(driver);
        
        //Clear default quantity and replace with 4
        await driver.findElement(By.xpath("//input[@name='quantity']")).clear();
        await driver.findElement(By.xpath("//input[@name='quantity']")).sendKeys("1");

        //Add product to cart
        await driver.findElement(By.className("btn btn-default cart")).click();
        
        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();
        
        //Navigate to the cart page
        await driver.findElement(By.className("fa fa-shopping-cart")).click();

        //Confirm that products are correct
        const cartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();
        
        expect(cartItemName).to.equal(productName);
        expect(cartItemPrice).to.equal(productPrice);
        expect(cartItemQuantity).to.equal("1");

        //Select "Signup/Login"
        await driver.findElement(By.className("fa fa-lock", Key.RETURN)).click()
        
        //Is signup form visible
        const isSignupVisible = await driver.findElement(By.className("signup-form")).isDisplayed();

        if (isSignupVisible) {
            //Enter Name and Email
            await driver.findElement(By.xpath("//div[@class='signup-form']/form/input[2]")).sendKeys(accountDetails.account_name)
            await driver.findElement(By.xpath("//div[@class='signup-form']/form/input[3]")).sendKeys(accountDetails.email)
        };

        //Find submit button and click
        await driver.findElement(By.xpath("//div[@class='signup-form']/form/button", Key.RETURN)).click()

        //Is login-form visible
        const isLoginPageVisible = await driver.findElement(By.className("login-form")).isDisplayed()
        
        //Chai assert if it's not
        expect(isLoginPageVisible).to.equal(true);

        //Enter account information//

        //Array for gender options
        const genderRadio = ["//label[@for='id_gender1']", "//label[@for='id_gender2']"]
        //RNG for gender options
        const rngGenderRadio = Math.floor(Math.random() * genderRadio.length);
        //Select gender option
        const namePrefixChoice = await driver.findElement(By.xpath(genderRadio[rngGenderRadio])).getText();
        await driver.findElement(By.xpath(genderRadio[rngGenderRadio])).click();

        //Password
        await driver.findElement(By.id("password")).sendKeys(accountDetails.password);

        //Array for dob dropdowns
        const dobDropdown = {
            days: accountDetails.dob.day,
            months: accountDetails.dob.month,
            years: accountDetails.dob.year
        }
        
        for (const [key, value] of Object.entries(dobDropdown)){
            const dropdown = await driver.findElement(By.id(key));
            const select = new Select(dropdown);
            await select.selectByValue(value);
        };

        //Sign up for the newsletter and special offers
        await driver.findElement(By.id("newsletter")).click();
        await driver.findElement(By.id("optin")).click();

        //Fill in personal details
        await driver.findElement(By.id("first_name")).sendKeys(accountDetails.first_name);
        await driver.findElement(By.id("last_name")).sendKeys(accountDetails.last_name);
        await driver.findElement(By.id("company")).sendKeys(accountDetails.company);
        await driver.findElement(By.id("address1")).sendKeys(accountDetails.address);
        await driver.findElement(By.id("state")).sendKeys(accountDetails.state);
        await driver.findElement(By.id("city")).sendKeys(accountDetails.city);
        await driver.findElement(By.id("zipcode")).sendKeys(accountDetails.zipcode);
        await driver.findElement(By.id("mobile_number")).sendKeys(accountDetails.mobile_number);

        //Submit account information
        await driver.findElement(By.className("btn btn-default")).click();

        //Check if account was created succesfully
        const afterAccCreation = await driver.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();

        expect(afterAccCreation).to.equal("ACCOUNT CREATED!");

        //Click continue
        await driver.findElement(By.className("btn btn-primary")).click();

        await adHandler(driver);
        
        const pageLoadCheck = await driver.findElement(By.className("fa fa-user"))
        await driver.wait(until.elementIsVisible(pageLoadCheck), 3000)

        //Check login user name
        const userNameTextCheck = await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[10]/a/b")).getText()

        expect(userNameTextCheck).to.equal(accountDetails.account_name);

        //Navigate to the cart page
        await driver.findElement(By.className("fa fa-shopping-cart")).click();
        
        //Click Proceed to checkout
        await driver.findElement(By.className("btn btn-default check_out")).click();

        //Create a variable to store delivery address details and confirm they are correct
        const deliveryAddress = await driver.findElements(By.xpath("//ul[@id='address_delivery']/li"));

        expect(await deliveryAddress[1].getText()).to.equal(`${namePrefixChoice} ${accountDetails.first_name} ${accountDetails.last_name}`);
        expect(await deliveryAddress[2].getText()).to.equal(accountDetails.company);
        expect(await deliveryAddress[3].getText()).to.equal(accountDetails.address);
        expect(await deliveryAddress[5].getText()).to.equal(`${accountDetails.city} ${accountDetails.state} ${accountDetails.zipcode}`);
        expect(await deliveryAddress[7].getText()).to.equal(accountDetails.mobile_number);

        //Check that order is correct
        const cartItemNameSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPriceSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantitySecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();

        expect(cartItemNameSecondCheck).to.equal(productName);
        expect(cartItemPriceSecondCheck).to.equal(productPrice);
        expect(cartItemQuantitySecondCheck).to.equal("1");

        //Check that you can add an order message
        await driver.findElement(By.xpath("//div[@id='ordermsg']/textarea")).sendKeys("description");

        //Click place order
        await driver.findElement(By.className("btn btn-default check_out")).click();

        //Enter payment details
        //Name on card
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[1]/div/input")).sendKeys(`${namePrefixChoice} ${accountDetails.first_name} ${accountDetails.last_name}`);
        //Card number
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[2]/div/input")).sendKeys(accountDetails.paymentDetails.card_number);
        //Card cvc number
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[3]/div[1]/input")).sendKeys(accountDetails.paymentDetails.card_cvc);
        //Card expiration month
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[3]/div[2]/input")).sendKeys(accountDetails.paymentDetails.card_expiry_month);
        //Card expiration year
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[3]/div[3]/input")).sendKeys(accountDetails.paymentDetails.card_expiry_year);
        
        
        //Click pay and confirm order
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[5]/div")).click();

        //Confirm order have been placed
        const afterOrderConfirmation = await driver.findElement(By.className("title text-center")).getText();

        expect(afterOrderConfirmation).to.equal(orderConfirmation);

        //Click delete account
        await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[5]")).click();

        //Check if account was deleted succesfully
        const afterAccDeletion = await driver.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();
        
        expect(afterAccDeletion).to.equal("ACCOUNT DELETED!");

        //Click continue
        await driver.findElement(By.className("btn btn-primary")).click();

        //Close the browser
        await driver.close();
    });

    it("Sucessfully register a new account and go through the purchase flow", async () => {

        //Launch browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();
        
        //Select "Signup/Login"
        await driver.findElement(By.className("fa fa-lock", Key.RETURN)).click()
        
        //Is signup form visible
        const isSignupVisible = await driver.findElement(By.className("signup-form")).isDisplayed();

        if (isSignupVisible) {
            //Enter Name and Email
            await driver.findElement(By.xpath("//div[@class='signup-form']/form/input[2]")).sendKeys(accountDetails.account_name)
            await driver.findElement(By.xpath("//div[@class='signup-form']/form/input[3]")).sendKeys(accountDetails.email)
        };

        //Find submit button and click
        await driver.findElement(By.xpath("//div[@class='signup-form']/form/button", Key.RETURN)).click()

        //Is login-form visible
        const isLoginPageVisible = await driver.findElement(By.className("login-form")).isDisplayed()
        
        //Chai assert if it's not
        expect(isLoginPageVisible).to.equal(true);

        //Enter account information//

        //Array for gender options
        const genderRadio = ["//label[@for='id_gender1']", "//label[@for='id_gender2']"]
        //RNG for gender options
        const rngGenderRadio = Math.floor(Math.random() * genderRadio.length);
        //Select gender option
        const namePrefixChoice = await driver.findElement(By.xpath(genderRadio[rngGenderRadio])).getText();
        await driver.findElement(By.xpath(genderRadio[rngGenderRadio])).click();

        //Password
        await driver.findElement(By.id("password")).sendKeys(accountDetails.password);

        //Array for dob dropdowns
        const dobDropdown = {
            days: accountDetails.dob.day,
            months: accountDetails.dob.month,
            years: accountDetails.dob.year
        }
        
        for (const [key, value] of Object.entries(dobDropdown)){
            const dropdown = await driver.findElement(By.id(key));
            const select = new Select(dropdown);
            await select.selectByValue(value);
        };

        //Sign up for the newsletter and special offers
        await driver.findElement(By.id("newsletter")).click();
        await driver.findElement(By.id("optin")).click();

        //Fill in personal details
        await driver.findElement(By.id("first_name")).sendKeys(accountDetails.first_name);
        await driver.findElement(By.id("last_name")).sendKeys(accountDetails.last_name);
        await driver.findElement(By.id("company")).sendKeys(accountDetails.company);
        await driver.findElement(By.id("address1")).sendKeys(accountDetails.address);
        await driver.findElement(By.id("state")).sendKeys(accountDetails.state);
        await driver.findElement(By.id("city")).sendKeys(accountDetails.city);
        await driver.findElement(By.id("zipcode")).sendKeys(accountDetails.zipcode);
        await driver.findElement(By.id("mobile_number")).sendKeys(accountDetails.mobile_number);

        //Submit account information
        await driver.findElement(By.className("btn btn-default")).click();

        //Check if account was created succesfully
        const afterAccCreation = await driver.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();

        expect(afterAccCreation).to.equal("ACCOUNT CREATED!");

        //Click continue
        await driver.findElement(By.className("btn btn-primary")).click();

        await adHandler(driver);
        
        const pageLoadCheck = await driver.findElement(By.className("fa fa-user"))
        await driver.wait(until.elementIsVisible(pageLoadCheck), 3000)

        //Check login user name
        const userNameTextCheck = await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[10]/a/b")).getText()

        expect(userNameTextCheck).to.equal(accountDetails.account_name);
        
        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Putting the products into the cart
        //Creating variables to store product name and price, this will be used to confirm the correct products have been sent to the cart
        const productName = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/p")).getText();
        const productPrice = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.className("nav nav-pills nav-justified")).click();

        //Function to handle ads nested in iframes
        await adHandler(driver);
        
        //Clear default quantity and replace with 4
        await driver.findElement(By.xpath("//input[@name='quantity']")).clear();
        await driver.findElement(By.xpath("//input[@name='quantity']")).sendKeys("1");

        //Add product to cart
        await driver.findElement(By.className("btn btn-default cart")).click();
        
        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();
        
        //Navigate to the cart page
        await driver.findElement(By.className("fa fa-shopping-cart")).click();

        //Confirm that products are correct
        const cartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();
        
        expect(cartItemName).to.equal(productName);
        expect(cartItemPrice).to.equal(productPrice);
        expect(cartItemQuantity).to.equal("1");
        
        //Click Proceed to checkout
        await driver.findElement(By.className("btn btn-default check_out")).click();

        //Create a variable to store delivery address details and confirm they are correct
        const deliveryAddress = await driver.findElements(By.xpath("//ul[@id='address_delivery']/li"));

        expect(await deliveryAddress[1].getText()).to.equal(`${namePrefixChoice} ${accountDetails.first_name} ${accountDetails.last_name}`);
        expect(await deliveryAddress[2].getText()).to.equal(accountDetails.company);
        expect(await deliveryAddress[3].getText()).to.equal(accountDetails.address);
        expect(await deliveryAddress[5].getText()).to.equal(`${accountDetails.city} ${accountDetails.state} ${accountDetails.zipcode}`);
        expect(await deliveryAddress[7].getText()).to.equal(accountDetails.mobile_number);

        //Check that order is correct
        const cartItemNameSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPriceSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantitySecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();

        expect(cartItemNameSecondCheck).to.equal(productName);
        expect(cartItemPriceSecondCheck).to.equal(productPrice);
        expect(cartItemQuantitySecondCheck).to.equal("1");

        //Check that you can add an order message
        await driver.findElement(By.xpath("//div[@id='ordermsg']/textarea")).sendKeys("description");

        //Click place order
        await driver.findElement(By.className("btn btn-default check_out")).click();

        //Enter payment details
        //Name on card
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[1]/div/input")).sendKeys(`${namePrefixChoice} ${accountDetails.first_name} ${accountDetails.last_name}`);
        //Card number
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[2]/div/input")).sendKeys(accountDetails.paymentDetails.card_number);
        //Card cvc number
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[3]/div[1]/input")).sendKeys(accountDetails.paymentDetails.card_cvc);
        //Card expiration month
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[3]/div[2]/input")).sendKeys(accountDetails.paymentDetails.card_expiry_month);
        //Card expiration year
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[3]/div[3]/input")).sendKeys(accountDetails.paymentDetails.card_expiry_year);
        
        
        //Click pay and confirm order
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[5]/div")).click();

        //Confirm order have been placed
        const afterOrderConfirmation = await driver.findElement(By.className("title text-center")).getText();

        expect(afterOrderConfirmation).to.equal(orderConfirmation);

        //Click delete account
        await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[5]")).click();

        //Check if account was deleted succesfully
        const afterAccDeletion = await driver.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();
        
        expect(afterAccDeletion).to.equal("ACCOUNT DELETED!");

        //Click continue
        await driver.findElement(By.className("btn btn-primary")).click();

        //Close the browser
        await driver.close();
    });

    it("Sucessfully log in and go through the purchase flow", async () => {

        //Launch browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();
        
        //Create account
        //Select "Signup/Login"
        await driver.findElement(By.className("fa fa-lock", Key.RETURN)).click()
        
        //Is signup form visible
        const isSignupVisible = await driver.findElement(By.className("signup-form")).isDisplayed();

        if (isSignupVisible) {
            //Enter Name and Email
            await driver.findElement(By.xpath("//div[@class='signup-form']/form/input[2]")).sendKeys(accountDetails.account_name)
            await driver.findElement(By.xpath("//div[@class='signup-form']/form/input[3]")).sendKeys(accountDetails.email)
        };

        //Find submit button and click
        await driver.findElement(By.xpath("//div[@class='signup-form']/form/button", Key.RETURN)).click()

        //Is login-form visible
        const isLoginPageVisible = await driver.findElement(By.className("login-form")).isDisplayed()
        
        //Chai assert if it's not
        expect(isLoginPageVisible).to.equal(true);

        //Enter account information//

        //Array for gender options
        const genderRadio = ["//label[@for='id_gender1']", "//label[@for='id_gender2']"]
        //RNG for gender options
        const rngGenderRadio = Math.floor(Math.random() * genderRadio.length);
        //Select gender option
        const namePrefixChoice = await driver.findElement(By.xpath(genderRadio[rngGenderRadio])).getText();
        await driver.findElement(By.xpath(genderRadio[rngGenderRadio])).click();

        //Password
        await driver.findElement(By.id("password")).sendKeys(accountDetails.password);

        //Array for dob dropdowns
        const dobDropdown = {
            days: accountDetails.dob.day,
            months: accountDetails.dob.month,
            years: accountDetails.dob.year
        }
        
        for (const [key, value] of Object.entries(dobDropdown)){
            const dropdown = await driver.findElement(By.id(key));
            const select = new Select(dropdown);
            await select.selectByValue(value);
        };

        //Sign up for the newsletter and special offers
        await driver.findElement(By.id("newsletter")).click();
        await driver.findElement(By.id("optin")).click();

        //Fill in personal details
        await driver.findElement(By.id("first_name")).sendKeys(accountDetails.first_name);
        await driver.findElement(By.id("last_name")).sendKeys(accountDetails.last_name);
        await driver.findElement(By.id("company")).sendKeys(accountDetails.company);
        await driver.findElement(By.id("address1")).sendKeys(accountDetails.address);
        await driver.findElement(By.id("state")).sendKeys(accountDetails.state);
        await driver.findElement(By.id("city")).sendKeys(accountDetails.city);
        await driver.findElement(By.id("zipcode")).sendKeys(accountDetails.zipcode);
        await driver.findElement(By.id("mobile_number")).sendKeys(accountDetails.mobile_number);

        //Submit account information
        await driver.findElement(By.className("btn btn-default")).click();

        //Check if account was created succesfully
        const afterAccCreation = await driver.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();

        expect(afterAccCreation).to.equal("ACCOUNT CREATED!");

        //Click continue
        await driver.findElement(By.className("btn btn-primary")).click();

        await adHandler(driver);
        
        const pageLoadCheck = await driver.findElement(By.className("fa fa-user"))
        await driver.wait(until.elementIsVisible(pageLoadCheck), 3000)

        //Check login user name
        const userNameTextCheck = await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[10]/a/b")).getText()

        expect(userNameTextCheck).to.equal(accountDetails.account_name);
        
        //Logs the user out
        await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[4]/a/i")).click();

        //Log in
        //Select "Signup/Login"
        await driver.findElement(By.className("fa fa-lock", Key.RETURN)).click()
        
        //Is signup form visible
        const isLoginVisible = await driver.findElement(By.className("login-form")).isDisplayed();

        if (isLoginVisible) {
            //Enter Email and password
            await driver.findElement(By.xpath("//div[@class='login-form']/form/input[2]")).sendKeys(accountDetails.email)
            await driver.findElement(By.xpath("//div[@class='login-form']/form/input[3]")).sendKeys(accountDetails.password)
        };

        //Find submit button and click
        await driver.findElement(By.xpath("//div[@class='login-form']/form/button", Key.RETURN)).click()

        //Check login user name after log in
        const secondUserNameTextCheck = await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[10]/a/b")).getText()

        expect(secondUserNameTextCheck).to.equal(accountDetails.account_name);

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Putting the products into the cart
        //Creating variables to store product name and price, this will be used to confirm the correct products have been sent to the cart
        const productName = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/p")).getText();
        const productPrice = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.className("nav nav-pills nav-justified")).click();

        //Function to handle ads nested in iframes
        await adHandler(driver);
        
        //Clear default quantity and replace with 4
        await driver.findElement(By.xpath("//input[@name='quantity']")).clear();
        await driver.findElement(By.xpath("//input[@name='quantity']")).sendKeys("1");

        //Add product to cart
        await driver.findElement(By.className("btn btn-default cart")).click();
        
        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();
        
        //Navigate to the cart page
        await driver.findElement(By.className("fa fa-shopping-cart")).click();

        //Confirm that products are correct
        const cartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();
        
        expect(cartItemName).to.equal(productName);
        expect(cartItemPrice).to.equal(productPrice);
        expect(cartItemQuantity).to.equal("1");
        
        //Click Proceed to checkout
        await driver.findElement(By.className("btn btn-default check_out")).click();

        //Create a variable to store delivery address details and confirm they are correct
        const deliveryAddress = await driver.findElements(By.xpath("//ul[@id='address_delivery']/li"));

        expect(await deliveryAddress[1].getText()).to.equal(`${namePrefixChoice} ${accountDetails.first_name} ${accountDetails.last_name}`);
        expect(await deliveryAddress[2].getText()).to.equal(accountDetails.company);
        expect(await deliveryAddress[3].getText()).to.equal(accountDetails.address);
        expect(await deliveryAddress[5].getText()).to.equal(`${accountDetails.city} ${accountDetails.state} ${accountDetails.zipcode}`);
        expect(await deliveryAddress[7].getText()).to.equal(accountDetails.mobile_number);

        //Check that order is correct
        const cartItemNameSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPriceSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantitySecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();

        expect(cartItemNameSecondCheck).to.equal(productName);
        expect(cartItemPriceSecondCheck).to.equal(productPrice);
        expect(cartItemQuantitySecondCheck).to.equal("1");

        //Check that you can add an order message
        await driver.findElement(By.xpath("//div[@id='ordermsg']/textarea")).sendKeys("description");

        //Click place order
        await driver.findElement(By.className("btn btn-default check_out")).click();

        //Enter payment details
        //Name on card
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[1]/div/input")).sendKeys(`${namePrefixChoice} ${accountDetails.first_name} ${accountDetails.last_name}`);
        //Card number
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[2]/div/input")).sendKeys(accountDetails.paymentDetails.card_number);
        //Card cvc number
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[3]/div[1]/input")).sendKeys(accountDetails.paymentDetails.card_cvc);
        //Card expiration month
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[3]/div[2]/input")).sendKeys(accountDetails.paymentDetails.card_expiry_month);
        //Card expiration year
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[3]/div[3]/input")).sendKeys(accountDetails.paymentDetails.card_expiry_year);
        
        
        //Click pay and confirm order
        await driver.findElement(By.xpath("//form[@id='payment-form']/div[5]/div")).click();

        //Confirm order have been placed
        const afterOrderConfirmation = await driver.findElement(By.className("title text-center")).getText();

        expect(afterOrderConfirmation).to.equal(orderConfirmation);

        //Click delete account
        await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[5]")).click();

        //Check if account was deleted succesfully
        const afterAccDeletion = await driver.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();
        
        expect(afterAccDeletion).to.equal("ACCOUNT DELETED!");

        //Click continue
        await driver.findElement(By.className("btn btn-primary")).click();

        //Close the browser
        await driver.close();
    });
    
    it("Sucessfully remove products from the cart", async () => {

        //Launch browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Putting the products into the cart
        //first product
        //Creating variables to store product name and price, this will be used to confirm the correct products have been sent to the cart
        const firstProductName = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/p")).getText();
        const firstProductPrice = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/a[@class='btn btn-default add-to-cart']")).click();

        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();

        //Second product
        const secondProductName = await driver.findElement(By.xpath("//div[@class ='features_items']/div[3]//div[@class='productinfo text-center']/p")).getText();
        const secondProductPrice = await driver.findElement(By.xpath("//div[@class ='features_items']/div[3]//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.xpath("//div[@class ='features_items']/div[3]//div[@class='productinfo text-center']/a[@class='btn btn-default add-to-cart']")).click();

        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();

        //Navigate to the cart
        await driver.findElement(By.className("fa fa-shopping-cart")).click();

        //Confirm that products are correct
        const firstCartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const firstCartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const firstCartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();

        const secondCartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[2]/td[2]/h4/a")).getText();
        const secondCartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[2]/td[3]/p")).getText();
        const secondCartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[2]/td[4]/button")).getText();
        
        expect(firstCartItemName).to.equal(firstProductName);
        expect(firstCartItemPrice).to.equal(firstProductPrice);
        expect(firstCartItemQuantity).to.equal("1");
        expect(secondCartItemName).to.equal(secondProductName);
        expect(secondCartItemPrice).to.equal(secondProductPrice);
        expect(secondCartItemQuantity).to.equal("1");

        //Remove the first product from the cart
        await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[6]/a")).click();

        //Safety wait
        await driver.sleep(1000)

        //Confirm that products are correct
        const firstCartItemNameSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const firstCartItemPriceSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const firstCartItemQuantitySecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();

        expect(firstCartItemNameSecondCheck).to.equal(secondProductName);
        expect(firstCartItemPriceSecondCheck).to.equal(secondProductPrice);
        expect(firstCartItemQuantitySecondCheck).to.equal("1");

        //Close browser
        await driver.close();
    });

    it("Sucessfully view product categories", async () => {

        //Launch browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Select a category
        await driver.findElement(By.xpath("//div[@class='panel-group category-products']/div[1]/div[1]/h4/a")).click();
        await driver.sleep(500);
        await driver.findElement(By.xpath("//*[@id='Women']/div/ul/li[2]/a")).click();

        //Confirm that page is correct
        const womenCategoryConfirm = await driver.findElement(By.className("title text-center")).getText();
        expect(womenCategoryConfirm.replace(/ /g,'')).to.equal("WOMEN - TOPS PRODUCTS".replace(/ /g,''));

        //Select another category
        await driver.findElement(By.xpath("//div[@class='panel-group category-products']/div[2]/div[1]/h4/a")).click();
        await driver.sleep(500);
        await driver.findElement(By.xpath("//*[@id='Men']/div/ul/li[1]/a")).click();

        await adHandler(driver);
        
        //Confirm that page is correct
        const menCategoryConfirm = await driver.findElement(By.className("title text-center")).getText();
        expect(menCategoryConfirm.replace(/ /g,'')).to.equal("MEN - TSHIRTS PRODUCTS".replace(/ /g,''));

        //Close browser
        await driver.close();
    });

    it("Sucessfully view and interact with brands via product page", async () => {

        //Launch browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });

        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Confirm Brands is visible
        const isBrandsVisible = await driver.findElement(By.xpath("//div[@class='left-sidebar']/div[2]/h2")).isDisplayed();
        expect(isBrandsVisible).to.equal(true)

        //Select a brand
        const firstBrand = await driver.findElement(By.xpath("//div[@class='brands-name']/ul/li[2]/a")).getText();
        await driver.findElement(By.xpath("//div[@class='brands-name']/ul/li[2]")).click();

        await adHandler(driver);
        
        //Confirm brand is correct
        const isBrandPageCorrect = await driver.findElement(By.xpath("//div[@class='features_items']/h2")).getText();
        expect(isBrandPageCorrect.replace(/ /g,'')).to.include(firstBrand.replace(/.*\n/, ''));

        //Select second brand
        const secondBrand = await driver.findElement(By.xpath("//div[@class='brands-name']/ul/li[3]/a")).getText();
        await driver.findElement(By.xpath("//div[@class='brands-name']/ul/li[3]")).click();

        //Confirm second brand is correct
        const isSecondBrandPageCorrect = await driver.findElement(By.xpath("//div[@class='features_items']/h2")).getText();
        expect(isSecondBrandPageCorrect.replace(/ /g,'')).to.include(secondBrand.replace(/.*\n/, ''));

        //Close browser
        await driver.close();
    });

    it("Successfully registers a user", async ()=> {

        //Launch the chrome browser
        let driver = await new Builder().forBrowser("chrome").build();
        
        //Create user function
        await createUser(driver);
    
        //Close the browser
        await driver.close();
    });

    it("Sucessfully searches products and verify cart after login", async ()=> {

        //Launch Browswer    
        const driver = new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });
        
        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Gather product name information
        const getProductName = async (browser) =>{
            const products = await browser.findElements(By.xpath("//div[@class='productinfo text-center']/p"));
            const rngProduct = Math.floor(Math.random() * products.length);
            const productName = await products[rngProduct].getText();
            console.log(productName);
            return productName;
        };
        const returnedProductName = await getProductName(driver)

        //Search for random product 
        await driver.findElement(By.id("search_product")).sendKeys(returnedProductName);
        await driver.findElement(By.id("submit_search")).click();
        
        //Product page information
        const productNameConfirm = await driver.findElement(By.xpath("//div[@class='productinfo text-center']/p")).getText();

        expect(productNameConfirm).to.equal(returnedProductName);

        //Putting the product into the cart
        //Creating variables to store product name and price, this will be used to confirm the correct products have been sent to the cart
        const productName = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/p")).getText();
        const productPrice = await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.xpath("//div[@class ='features_items']/div[2]//div[@class='productinfo text-center']/a[@class='btn btn-default add-to-cart']")).click();

        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();

        //Navigate to the cart
        await driver.findElement(By.className("fa fa-shopping-cart")).click();

        //Confirm that products are correct
        const cartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();

        expect(cartItemName).to.equal(productName);
        expect(cartItemPrice).to.equal(productPrice);
        expect(cartItemQuantity).to.equal("1");

        //Login to an account
        //Select "Signup/Login"
        await driver.findElement(By.className("fa fa-lock", Key.RETURN)).click()
        
        //Is signup form visible
        const isLoginVisible = await driver.findElement(By.className("login-form")).isDisplayed();

        if (isLoginVisible) {
            //Enter Email and password
            await driver.findElement(By.xpath("//div[@class='login-form']/form/input[2]")).sendKeys(accountDetails.email)
            await driver.findElement(By.xpath("//div[@class='login-form']/form/input[3]")).sendKeys(accountDetails.password)
        };

        //Find submit button and click
        await driver.findElement(By.xpath("//div[@class='login-form']/form/button", Key.RETURN)).click()

        //Check login user name
        const userNameTextCheck = await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[10]/a/b")).getText()

        expect(userNameTextCheck).to.equal(accountDetails.account_name);

        //Navigate to the cart
        await driver.findElement(By.className("fa fa-shopping-cart")).click();

        //Confirm that products are correct
        const cartItemNameSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPriceSecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantitySecondCheck = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();

        expect(cartItemNameSecondCheck).to.equal(productName);
        expect(cartItemPriceSecondCheck).to.equal(productPrice);
        expect(cartItemQuantitySecondCheck).to.equal("1");

        //Click delete account
        await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[5]")).click();

        await adHandler(driver);

        //Check if account was deleted succesfully
        const afterAccDeletion = await driver.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();
        
        expect(afterAccDeletion).to.equal("ACCOUNT DELETED!");

        //Click continue
        await driver.findElement(By.className("btn btn-primary")).click();

        //Close the browser
        await driver.close();
    });

    it("Successfully adds a review on a product", async () => {
        //Launch Browswer    
        const driver = new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });
        
        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Navigate to products page
        await driver.findElement(By.className("material-icons card_travel")).click();

        //Confirm products page is visible
        const isProductsPageVisible = await driver.findElement(By.className("title text-center")).isDisplayed();
        expect(isProductsPageVisible).to.equal(true);

        //Gather product name information
        const getProductName = async (browser) =>{
            const products = await browser.findElements(By.xpath("//div[@class='productinfo text-center']/p"));
            const rngProduct = Math.floor(Math.random() * products.length);
            const productName = await products[rngProduct].getText();
            console.log(productName);
            return productName;
        };
        const returnedProductName = await getProductName(driver)

        //Search for random product 
        await driver.findElement(By.id("search_product")).sendKeys(returnedProductName);
        await driver.findElement(By.id("submit_search")).click();
        
        //Product page information
        const productNameConfirm = await driver.findElement(By.xpath("//div[@class='productinfo text-center']/p")).getText();

        expect(productNameConfirm).to.equal(returnedProductName);

        //Click on view product
        await driver.findElement(By.className("nav nav-pills nav-justified")).click();

        await adHandler(driver);

        //Check if write your review is visible
        const isWriteYourReviewVisible = await driver.findElement(By.xpath("//div[@class='category-tab shop-details-tab']/div[1]/ul/li")).isDisplayed();
        expect(isWriteYourReviewVisible).to.equal(true);

        //Enter review details
        await driver.findElement(By.xpath("//form[@id='review-form']//input[@id='name']")).sendKeys(accountDetails.first_name, accountDetails.last_name);
        await driver.findElement(By.xpath("//form[@id='review-form']//input[@id='email']")).sendKeys(accountDetails.email);
        await driver.findElement(By.xpath("//form[@id='review-form']//textarea[@id='review']")).sendKeys("Review Information");
        await driver.findElement(By.xpath("//form[@id='review-form']/button[@id='button-review']")).click();

        await driver.sleep(200);
        const reviewSuccessMessage = await driver.findElement(By.xpath("//form[@id='review-form']//div[@class='alert-success alert']")).isDisplayed();
        expect(reviewSuccessMessage).to.equal(true);

        //Close the browser
        await driver.close();
    });

    it("Successfully adds to the cart from Recommended items", async () => {
        //Launch Browswer    
        let driver = new Builder().forBrowser("chrome").build();

        //Moves browser window 
        await driver.manage().window().setRect({x: 10, y: -1440 });
        
        //Navigate to the webpage
        await driver.get(webSite);

        //Is there a consent pop up, if there is select consent to close
        const isConsentPopupVisible = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button")).isDisplayed();
        if (isConsentPopupVisible) await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button", Key.RETURN)).click();

        //Find and scroll to the recommended items
        const recommendedItems = await driver.findElement(By.className("recommended_items"));
        await driver.actions().scroll(0,0,0,200, recommendedItems).perform();


        //Add item to cart
        //Store item information to verify later
        const productName = await driver.findElement(By.xpath("//div[@class ='item active']//div[@class='productinfo text-center']/p")).getText();
        const productPrice = await driver.findElement(By.xpath("//div[@class ='item active']//div[@class='productinfo text-center']/h2")).getText();
        await driver.findElement(By.xpath("//div[@class ='item active']//div[@class='productinfo text-center']/a[@class='btn btn-default add-to-cart']")).click();

        //Wait for modal to be clickable
        await driver.sleep(1000)

        //Click continue shopping
        await driver.findElement(By.className("btn btn-success close-modal btn-block")).click();


        //Find and scroll to the the top
        const navigationBar = await driver.findElement(By.className("nav navbar-nav"));
        await driver.actions().scroll(0,0,0,0, navigationBar).perform();

        //Bypass dropdown advert
        await driver.sleep(1000)
        await driver.actions().scroll(0,0,0,200, recommendedItems).perform();
        await driver.sleep(1000)
        await driver.actions().scroll(0,0,0,0, navigationBar).perform();


        //Navigate to the cart
        await driver.findElement(By.className("fa fa-shopping-cart")).click();

        //Confirm that products are correct
        const cartItemName = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[2]/h4/a")).getText();
        const cartItemPrice = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[3]/p")).getText();
        const cartItemQuantity = await driver.findElement(By.xpath("//table[@class='table table-condensed']/tbody/tr[1]/td[4]/button")).getText();

        expect(cartItemName).to.equal(productName);
        expect(cartItemPrice).to.equal(productPrice);
        expect(cartItemQuantity).to.equal("1");

        //Close browser
        await driver.close();
    });

});