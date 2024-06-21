import * as webdriver from "selenium-webdriver";
import {By, Key, Builder} from 'selenium-webdriver';
import {expect} from 'chai';
import * as path from 'path';


const webSite = "https://www.automationexercise.com/"
const upload = path.resolve("files/Binks.jpg")

const contactUsDetails = {
    email: "Qa@Email.qa",
    first_name: "John",
    subject: "Testing subject",
    message: "This is a message",
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
    
});