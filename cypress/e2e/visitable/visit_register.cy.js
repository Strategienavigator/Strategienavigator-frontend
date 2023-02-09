describe('Visiting register', () => {
    beforeEach(() => {
        cy.visit("/")
    })
    it('visits /register', () => {
        cy.visitSite("/register", "Registrieren");
        
    })
    it('visits /register going from /about-us', () => {
        cy.visit("/about-us")
        cy.visitSite("/register", "Registrieren");
        
    })
    it('visits /register going from /legal-notice', () => {
        cy.visit("/legal-notice")
        cy.visitSite("/register", "Registrieren");
        
    })
    it('visits /register going from /data-privacy', () => {
        cy.visit("/data-privacy")
        cy.visitSite("/register", "Registrieren");
        
    })
    it('visits /register going from /register', () => {
        cy.visit("/register")
        cy.visitSite("/register", "Registrieren");
        
    })
})