describe('SWOT Analyisis', () => {
    it('trys to create a new SWOT as anonymous',() =>{
        cy.visit('/')
        cy.visitSite("/swot-analysis","SWOT Analyse")

        cy.intercept('POST', /.*api\/users.*/).as('anonym')
        
        cy.contains("Annehmen")
        .click()
        cy.wait("@anonym")
        cy.intercept('POST', /.*oauth\/token.*/).as('token')
        cy.get("@anonym")
        .its("response")
        .should('include',{
            statusCode: 201
          })
        
        cy.wait("@token")
        cy.get("@token")
        .its("response.body")
        .should('include',{
            token_type: "Bearer"
          })
        
        cy.url().should("include", "swot-analysis")

        cy.contains("Neue Analyse")
        .click()
        cy.url().should("include", "swot-analysis/new")

        cy.get("input[id='name']")
        .clear()
        .type("TEST-SWOT")
        cy.get("textarea[id='description']")
        .clear()
        .type("TEST-SWOT ist ein Testscenario")

        cy.intercept('POST', /.*api\/saves.*/).as('save')
        cy.get('button[type="submit"]')
        .click()
        cy.wait("@save")
        cy.get("@save")
        .its("response")
        .should('include',{
            statusCode: 201
          })
        cy.log("new SWOT created and saved for anonymous")
    })

})