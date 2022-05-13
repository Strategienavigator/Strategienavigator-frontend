describe('sample', () => {
    it('trys to get to Loginpage', () => {
        cy.visit('/');
        cy.contains("Anmelden").click()
        cy.url().should("include", "login")
    })
})