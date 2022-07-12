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

Cypress.Commands.add('loginViaApi', (email, password, remember = false) => {

    let data = {
        grant_type: 'password',
        client_id: Cypress.env("APP_CLIENT_ID"),
        client_secret: Cypress.env("APP_CLIENT_SECRET"),
        username: email,
        password: password,
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
    var login
    if (index == -1)
    {
        login = Cypress.env("TEST_LOGIN")
    }else{
        login = this.LoginData[index];
    }
    cy.log(login["username"])
    cy.log('Logs in visual as ' + login)

    cy.visit("/login")
    cy.get('input[id="email"]')
    .clear()
    .type(login["username"])
    cy.get('input[id="password"]')
    .clear()
    .type(login["password"])
    cy.intercept("GET",/.*users.*/).as('user')
    cy.get('button[type="submit"]')
    .click()

    cy.log("Logged in "+ login["username"])
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
