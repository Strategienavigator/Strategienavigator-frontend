describe('Profile check and changing', () => {
    it('trys to login to reach /my-profile',() =>{
        cy.visit('/login')
        cy.get('input[id="email"]')
        .type('Max@test.test')

        cy.get('input[id="password"]')
        .type('password')

        cy.get('button[type="submit"]')
        .click()
        cy.log('Probably already logged in?')
        cy.url().should("include", "my-profile")

    })
    it('trys to check profile', () =>{
        cy.visit('/my-profile')
        cy.log('He was already logged in!')

        cy.get("input[id='username']")
        .should('have.value', 'test_user')
        cy.get("input[id='email']")
        .should('have.value', "max@test.test")
    })
    it('trys to change profilename INVALID', () =>{
        cy.contains("Bearbeiten")
        .click()

        cy.get("input[id='username']")
        .clear()
        .type("TEST_USER1")

        cy.get("input[id='current_password']")
        .clear()
        .type("passwort") //invalid

        cy.contains("Änderungen speichern")
        .click()

        cy.get('div [class="feedback text-success"]').should('not.be.visible')
        cy.reload();
        cy.get("input[id='username']").should("test_user")

    })
    it('trys to change emailadress INVALID', () =>{

        cy.get("input[id='email']")
        .clear()
        .type("maxtest.test")

        cy.get("input[id='current_password']")
        .clear()
        .type("password") //valid

        cy.contains("Änderungen speichern")
        .click()
        cy.get('div [class="feedback text-success"]').should('not.be.visible')

        cy.reload();
        cy.get("input[id='email']").should("max@test.test")


    })
    it('trys to change emailadress INVALID 2', () =>{

        cy.get("input[id='email']")
        .clear()
        .type("max@test.test")

        cy.get("input[id='current_password']")
        .clear()
        .type("passwort")

        cy.contains("Änderungen speichern")
        .click()
        cy.get('div [class="feedback text-success"]').should('not.be.visible')

        cy.reload();
        cy.get("input[id='email']").should("max@test.test")

    })
    it('trys to change profilename', () =>{

        cy.get("input[id='username']")
        .clear()
        .type("TEST_USER1")

        cy.get("input[id='current_password']")
        .type("password")

        cy.contains("Änderungen speichern")
        .click()

        //Check
        cy.get("input[id='username']")
        .should('have.value', 'TEST_USER1')

        //Rückgängig machen
        cy.get("input[id='username']")
        .clear()
        .type("test_user")

        cy.get("input[id='current_password']")
        .clear()
        .type("password")

        cy.contains("Änderungen speichern")
        .click()

        cy.get("input[id='username']")
        .should('have.value', 'test_user')
    })
    it('trys to change emailadress', () =>{

        cy.get("input[id='email']")
        .clear()
        .type("max1@test.test")

        cy.get("input[id='current_password']")
        .clear()
        .type("password")

        cy.contains("Änderungen speichern")
        .click()

        //Check
        cy.get("input[id='email']")
        .should('have.value', 'max1@test.test')

        //Rückgängig machen
        cy.get("input[id='email']")
        .clear()
        .type("max@test.test")

        cy.get("input[id='current_password']")
        .clear()
        .type("password")

        cy.contains("Änderungen speichern")
        .click()

        cy.get("input[id='email']")
        .should('have.value', 'max@test.test')
    })



})