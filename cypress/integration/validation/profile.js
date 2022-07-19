const { debug } = require("console")

describe('Checking Profile', () => {
    beforeEach(() =>{
        var email = Cypress.env("TEST_LOGIN_USERNAME")
        var password = Cypress.env("TEST_LOGIN_PASSWORD")
        cy.task("bcrypt", password).then(function (hashword)
        {
        this.hashword = hashword
        cy.task("queryDb",
        `UPDATE toolbox.users
        SET username = "test_user", email = "`+email+`", password = "`+hashword+`"
        WHERE id = 1;`)
        })

        cy.loginViaApi()

        cy.intercept("GET",/.*settings.*/).as('get')
        cy.visit("/my-profile")
        cy.wait("@get")

        cy.get('@get')
        .its("response")
        .should("include",{
            statusCode: 200
        })


    })
    it('trys to validate data being displayed on profile', () =>{

        cy.get("input[id='username']")
        .should('have.value', 'test_user')
        cy.get("input[id='email']")
        .should('have.value', "max@test.test")
    })
    it('should NOT be able to change profilename (wrong password)', () =>{

        cy.contains("Bearbeiten")
        .click()

        //username
        cy.get("input[id='username']")
        .clear()
        .type("test_user1")

        cy.get("input[id='current_password']")
        .clear()
        .type("passwort") //invalid

        cy.intercept("POST", /.*api\/users.*/).as("user")
        cy.contains("Änderungen speichern")
        .click()
        cy.wait("@user")
        .its("response")
        .should('include',{
            statusCode: 401
          })

          
        cy.intercept("GET",/.*settings.*/).as('get')
        cy.reload();
        cy.wait("@get")
        cy.get('@get')
        .its("response")
        .should("include",{
            statusCode: 200
        })
        
        cy.get("input[id='username']")
        .should('have.value',"test_user")

    })
    // TODO email is ignored from backend. So no 401 response is expected
    it.skip('should NOT be able to change emailadress (wrong password/email' , () =>{
        cy.contains("Bearbeiten")
        .click()

        cy.get("input[id='email']")
        .clear()
        .type("maxtest.test") //invalid

        cy.get("input[id='current_password']")
        .clear()
        .type("password") //valid

        cy.intercept("POST", /.*api\/users.*/).as("user")
        cy.contains("Änderungen speichern")
        .click()
        cy.wait("@user")
        .its("response")
        .should('include',{
            statusCode: 200
          })

        cy.get('div [class="feedback text-success"]')
        .should('not.be.visible')

        cy.reload();
        cy.get("input[id='email']")
        .should('have.value',"max@test.test")


    })
    it.skip('should NOT be able to change emailadress (wrong password)', () =>{

        cy.contains("Bearbeiten")
        .click()

        cy.get("input[id='email']")
        .clear()
        .type("max@test.test")

        cy.get("input[id='current_password']")
        .clear()
        .type("passwort")//invalid

        cy.intercept("POST", /.*api\/users.*/).as("user")
        cy.contains("Änderungen speichern")
        .click()
        cy.wait("@user")
        .its("response")
        .should('include',{
            statusCode: 200
          })

        cy.get('div [class="feedback text-success"]')
        .should('not.be.visible')

        cy.reload();
        cy.get("input[id='email']")
        .should("max@test.test")
    })
    it('trys to change profilename', () =>{

        cy.contains("Bearbeiten")
        .click()

        cy.get("input[id='username']")
        .clear()
        .type("TEST_USERXXXX1")

        cy.get("input[id='current_password']")
        .type("password")

        cy.intercept("POST", /.*api\/users.*/).as("user")
        cy.contains("Änderungen speichern")
        .click()
        cy.wait("@user")
        .its("response")
        .should('include',{
            statusCode: 200
          })

        cy.get("input[id='username']")
        .should('have.value', 'TEST_USERXXXX1')

    })
    it('trys to change emailadress', () =>{

        cy.contains("Bearbeiten")
        .click()

        cy.get("input[id='email']")
        .clear()
        .type("max1@test.test")

        cy.get("input[id='current_password']")
        .clear()
        .type("password")

        cy.intercept("POST", /.*api\/users.*/).as("user")
        cy.contains("Änderungen speichern")
        .click()
        cy.wait("@user")
        .its("response")
        .should('include',{
            statusCode: 200
          })

        cy.get("input[id='email']")
        .should('have.value', 'max1@test.test')
    })



})
