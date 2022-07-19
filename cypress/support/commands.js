// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const { createLogicalNot } = require("typescript");

Cypress.Commands.add('loginViaApi', () => {

    let data = {
        grant_type: 'password',
        client_id: Cypress.env("APP_CLIENT_ID"),
        client_secret: Cypress.env("APP_CLIENT_SECRET"),
        username: Cypress.env("TEST_LOGIN_USERNAME"),
        password: Cypress.env("TEST_LOGIN_PASSWORD"),
        scope: ''
    };

    cy.request("POST",Cypress.env("BACKEND_URL") + "oauth/token", data).then((resp)=>{
        window.sessionStorage.setItem("token", resp.body.access_token);
    });
});

//Index ist welche Logindata von der testLoginData.json
Cypress.Commands.add('loginViaVisual',(index = -1)=>{
    
    cy.fixture("testLoginData").then(function (LoginData)
     {
    this.LoginData = LoginData;

    var username
    var password
    if (index == -1)
    {
        username = Cypress.env("TEST_LOGIN_USERNAME")
        password = Cypress.env("TEST_LOGIN_PASSWORD")
    }else{
        username = this.LoginData[index]["username"]
        password =  this.LoginData[index]["password"]
    }

    cy.log(username)
    cy.log('Logs in visual as ' + username)

    cy.visit("/login")
    cy.get('input[id="email"]')
    .clear()
    .type(username)
    cy.get('input[id="password"]')
    .clear()
    .type(password)
    cy.intercept("GET",/.*users.*/).as('user')
    cy.get('button[type="submit"]')
    .click()

    cy.log("Logged in as "+ username)
    cy.wait("@user")
     })
}) 
//site = name of the site example: login
//clickOn = element that contains a text example: "Login" for a Button with Login on it
Cypress.Commands.add("visitSite",(site ,clickOn)=>{
    cy.log("visit site " + site)
    if(site[0] === "/"){
        site.slice(1);
    }
    cy.contains(clickOn).click()
    cy.url().should("include", site)
})

//Parameter
//saveSlot string: Expample: "swot-1" for a first step save for SWOT, which slot has what save look into saveDummyData.json in fixtures
//name string: name for the save
//tool_id int : Which tool, 2 for SWOT-Analysis
//owner_id int: optional: standard is 0 for max@test.test
Cypress.Commands.add('CreateSave',(saveSlot,name,tool_id,owner_id = 1)=>{
    
    cy.fixture("saveData/"+saveSlot).then(function (SaveData)
     {
        this.SaveData = SaveData
        var save = JSON.stringify(SaveData)
        cy.task("queryDb",
        `INSERT INTO toolbox.saves
        (data, name, tool_id, owner_id, description)
        VALUES
        ('`+save+`',
        "`+name+`",
        `+tool_id+`,
        `+owner_id+`,
        "TEST_SAVE");`);
     })
})
