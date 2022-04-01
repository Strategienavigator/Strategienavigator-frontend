describe('My First Test', () => {
    it('finds the content "type"', () => {
        cy.visit('/');

        cy.contains("SWOT Analyse").click()

        cy.url().should("include", "swot-analysis")
    })
})
