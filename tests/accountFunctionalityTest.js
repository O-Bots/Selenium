import {Builder, By, Key, Select, until} from 'selenium-webdriver';
import {expect} from 'chai';

const webSite = "https://www.automationexercise.com/"
const loginError = "Your email or password is incorrect!"

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
    mobile_number: "0123 456789"
}
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

    const adAfterAccCreation = await browser.getCurrentUrl()
    
    if (adAfterAccCreation.includes("#google_vignette")) await browser.navigate().refresh();

    //Click continue
    await browser.findElement(By.className("btn btn-primary")).click();
    
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
            await browser.switchTo().frame(browser.findElement(By.xpath("//iframe[@id='ad_iframe']")));
            await browser.findElement(By.id("dismiss-button")).click();
            await browser.switchTo().defaultContent();
        } catch (error) {
            await browser.switchTo().parentFrame();
            continue;
        };
    };
};

describe("Tests_for_account_functionality", ()=> {
    
    it("Successfully registers a user and deletes account", async ()=> {

        //Launch the chrome browser
        let driver = await new Builder().forBrowser("chrome").build();

        //Create user function
        await createUser(driver)

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

    it("Successfully registers a user", async ()=> {

        //Launch the chrome browser
        let driver = await new Builder().forBrowser("chrome").build();
        
        //Create user function
        await createUser(driver);
    
        //Close the browser
        await driver.close();
    });

    it("Successfully logs in a user with incorrect details", async ()=> {

        //Launch the chrome browser
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
        const isLoginVisible = await driver.findElement(By.className("login-form")).isDisplayed();

        if (isLoginVisible) {
            //Enter Email and password
            await driver.findElement(By.xpath("//div[@class='login-form']/form/input[2]")).sendKeys(accountDetails.email)
            await driver.findElement(By.xpath("//div[@class='login-form']/form/input[3]")).sendKeys(accountDetails.password+"s")
        };

        //Find submit button and click
        await driver.findElement(By.xpath("//div[@class='login-form']/form/button", Key.RETURN)).click()

        //Get login error text
        const loginErrorVisible = await driver.findElement(By.xpath("//div[@class='login-form']/form/p")).getText();

        //Chai assert comparing error text to stored variable
        expect(loginErrorVisible).to.equal(loginError);

        //Close the browser
        await driver.close();

    });

    it("Successfully logs in a registerd a user with correct details and logs the user out", async ()=> {

        //Launch the chrome browser
        let driver = await new Builder().forBrowser("chrome").build();
        
        //Logs in the user
        await userLogin(driver);

        //Logs the user out
        await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[4]/a/i")).click();

        const loginPageCheck = await driver.getCurrentUrl();

        //Chai assert to check if user has been logged out
        expect(loginPageCheck).to.equal("https://www.automationexercise.com/login")

        //Close the browser
        await driver.close();
    });
    
    it("Successfully logs in a registerd a user with correct details and deletes the users account", async ()=> {

        //Launch the chrome browser
        let driver = await new Builder().forBrowser("chrome").build();
        
        //Logs in the user
        await userLogin(driver);
        
        //Click delete account
        await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[5]")).click();

        const adAfterDeletion = await driver.getCurrentUrl()
        
        if (adAfterDeletion.includes("#google_vignette")) await driver.navigate().refresh();

        if (adAfterDeletion.includes("delete_account")) {            
            //Check if account was deleted succesfully
            const afterAccDeletion = await driver.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();
            
            expect(afterAccDeletion).to.equal("ACCOUNT DELETED!");
            //Click continue
            await driver.findElement(By.className("btn btn-primary")).click();
        };
        
        //Close the browser
        await driver.close();

    });
});