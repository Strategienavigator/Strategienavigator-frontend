describe('Login is being checked', () => {
    it('trys to get to login', () => {

        cy.visit('/');
        cy.contains("Anmelden").click()
        cy.url().should("include", "login") 

        cy.visit('/data-privacy');
        cy.contains("Anmelden").click()
        cy.url().should("include", "login")

        cy.visit('/about-us');
        cy.contains("Anmelden").click()
        cy.url().should("include", "login")
        
        cy.visit('/legal-notice');
        cy.contains("Anmelden").click()
        cy.url().should("include", "login")   
    })
    it('trys to use invalid data',() =>{
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
    it('trys to use valid data',() =>{
        cy.visit('/login')

        cy.get('input[id="email"]')
        .type('Max@test.test')

        cy.get('input[id="password"]')
        .type('password')

        cy.get('button[type="submit"]')
        .click()

        cy.url().should("include", "my-profile")
    })
    it('trys to logout',() =>{
        cy.contains('test_user')
        .click()

        cy.contains('Abmelden')
        .click()
        cy.url().should("include", "logout")
    })

})