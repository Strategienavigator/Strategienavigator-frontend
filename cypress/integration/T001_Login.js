describe('Checking Login', () => {

    it('trys to reach "/login"', () => {

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
    it('trys using valid data with max@test.test:password VISUAL',() =>{
      
        cy.loginViaVisual("max@test.test","password")
    })
    it('trys to logout',() =>{
        cy.log('Needs to login first')
            cy.loginViaVisual("max@test.test","password")
        cy.log("Logged in, ready for test")

        cy.visit("/")
        cy.get('a[id="profile-dropdown"]')
        
        .click()
        cy.contains('Abmelden')
        .click()
        cy.url().should("include", "logout")

        cy.get(".fade.message.alert-success").should("be.visible");
    })

})
