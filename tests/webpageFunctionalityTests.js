import { Builder } from "selenium-webdriver";
import {expect} from 'chai';

const webSite = "https://www.automationexercise.com/"
const loginError = "Your email or password is incorrect!"

describe("Tests_for_Website_functionality", () => {

    it("Succesfully uses the Contact Us form", async () => {

        //Launch Browswer    
        let driver = new Builder().forBrowser("chrome").build();

        await driver.get(webSite);

    });
})