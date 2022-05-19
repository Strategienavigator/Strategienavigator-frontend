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
        cy.get('input[id="email"]')
        .clear()
        .type('Max@test.test')

        cy.get('input[id="password"]')
        .clear()
        .type('passwort')

        cy.get('button[type="submit"]')
        .click()

        cy.get('div[class="feedback"]').should('not.be.visible')
        cy.url().should("include", "login")
        //--

        cy.get('input[id="email"]')
        .clear()

        cy.get('input[id="password"]')
        .clear()

        cy.get('button[type="submit"]')
        .click()

        cy.get('div[class="feedback"]').should('be.visible')
        cy.url().should("include", "login")
    })
    it.only('trys using valid data with max@test.test:password VISUAL',() =>{

        cy.intercept("POST",/.*oauth\/token.*/).as('oauth')
        cy.loginViaVisual("max@test.test","password")
        cy.wait("@oauth")
       // cy.url().should("include", "my-profile")
    })
    it('trys to logout',() =>{
        cy.loginViaVisual("max@test.test","password")
        cy.visit("/")
        cy.get('a[id="profile-dropdown"]')
        
        .click()
        cy.contains('Abmelden')
        .click()
        cy.url().should("include", "logout")
    })

})