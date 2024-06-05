import {Builder, By, Key, Select, until} from 'selenium-webdriver';
import {expect} from 'chai';

const accountDetails = {
    account_name: "Qa Name",
    email: "Qa@Email6.qa",
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

//Describe block
describe("Tests for account functionality", ()=> {
    
    //It block
    it("Successfully registers a user and deletes account", async ()=> {
    //Launch the chrome browser
    let driver = await new Builder().forBrowser("chrome").build();

    //Navigate to the webpage
    await driver.get("https://www.automationexercise.com/");
    
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
    const genderRadio = ["//span/input[@id='id_gender1']", "//span/input[@id='id_gender2']"]
    //RNG for gender options
    const rngGenderRadio = Math.floor(Math.random() * genderRadio.length);
    //Select gender option
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

    const adAfterAccCreation = await driver.getCurrentUrl()
    
    if (adAfterAccCreation.includes("#google_vignette")) await driver.navigate().refresh();

    //Click continue
    await driver.findElement(By.className("btn btn-primary")).click();
    
    const pageLoadCheck = await driver.findElement(By.className("fa fa-user"))
    await driver.wait(until.elementIsVisible(pageLoadCheck), 3000)

    //Check login user name
    const userNameTextCheck = await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[10]/a/b")).getText()

    expect(userNameTextCheck).to.equal(accountDetails.account_name);

    //Click delete account
    await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[5]")).click();

    //Check if account was deleted succesfully
    const afterAccDeletion = await driver.findElement(By.xpath("//div/h2[@class='title text-center']")).getText();
    
    expect(afterAccDeletion).to.equal("ACCOUNT DELETED!");

    //Click continue
    await driver.findElement(By.className("btn btn-primary")).click();

    //Close the browser
    await driver.close()
    });
    it("Successfully registers a user", async ()=> {
        //Launch the chrome browser
        let driver = await new Builder().forBrowser("chrome").build();
    
        //Navigate to the webpage
        await driver.get("https://www.automationexercise.com/");
        
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
        const genderRadio = ["//span/input[@id='id_gender1']", "//span/input[@id='id_gender2']"]
        //RNG for gender options
        const rngGenderRadio = Math.floor(Math.random() * genderRadio.length);
        //Select gender option
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
    
        const adAfterAccCreation = await driver.getCurrentUrl()
        
        if (adAfterAccCreation.includes("#google_vignette")) await driver.navigate().refresh();
    
        //Click continue
        await driver.findElement(By.className("btn btn-primary")).click();
        
        const pageLoadCheck = await driver.findElement(By.className("fa fa-user"))
        await driver.wait(until.elementIsVisible(pageLoadCheck), 3000)
    
        //Check login user name
        const userNameTextCheck = await driver.findElement(By.xpath("//ul[@class='nav navbar-nav']/li[10]/a/b")).getText()
    
        expect(userNameTextCheck).to.equal(accountDetails.account_name);
    
        //Close the browser
        await driver.close()
    });
});