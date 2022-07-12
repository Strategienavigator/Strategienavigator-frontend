describe('Checking Login', () => {
    it('trys using INVALID data for login',() =>{
        cy.visit('/login')

        cy.get('input[id="email"]')
        .clear()
        .type('Maxtest.test')

        cy.get('input[id="password"]')
        .clear()
        .type('password')

        cy.get('button[type="submit"]')
        .click()
        cy.url().should("include", "login")

        //--
        cy.visit('/login')
        cy.get('input[id="email"]')
        .clear()
        .type('Max@test.test')

        cy.get('input[id="password"]')
        .clear()
        .type('passwort')
        
        cy.intercept("POST",/.*oauth\/token.*/).as('token')
        cy.get('button[type="submit"]')
        .click()
        cy.wait("@token")

        cy.get('@token')
        .its("response")
        .should("include",{
            statusCode: 400
        })

        cy.get('div[class="feedback"]')
        .should('be.visible')

        cy.url().should("include", "login")
        //--

        cy.get('input[id="email"]')
        .clear()

        cy.get('input[id="password"]')
        .clear()

        cy.get('button[type="submit"]')
        .click()
        cy.wait("@token")
        cy.get('@token')
        .its("response")
        .should("include",{
            statusCode: 400
        })

        cy.get('div[class="feedback"]')
        .should('be.visible')
        cy.url()
        .should("include", "login")
    })
    it('trys using valid data with max@test.test:password VISUAL',() =>{

        cy.loginViaVisual()
        cy.url()
        .should("include", "my-profile")

    })
    it('trys to logout',() =>{
        //0 = max.test@test
        cy.loginViaVisual()

        cy.visit("/")
        cy.get('a[id="profile-dropdown"]')
        .contains("test_user")
        .click()
        cy.contains('Abmelden')
        .click()
        cy.url()
        .should("include", "logout")

        cy.get(".fade.message.alert-success")
        .should("be.visible");
    })

})
