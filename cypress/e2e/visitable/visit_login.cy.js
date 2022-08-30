describe('Visiting /Login', () => {
    beforeEach(() =>{
        cy.visit("/")
    })
    it('visits /login', () => {
        cy.visitSite("/login","Anmelden");

    })
    it('visits /login going from /about-us', () => {
        cy.visit("/about-us")
        cy.visitSite("/login","Anmelden")

    })
    it('visits /login going from /legal-notice', () => {
        cy.visit("/legal-notice")
        cy.visitSite("/login","Anmelden")

    })
    it('visits /login going from /data-privacy', () => {
        cy.visit("/data-privacy")
        cy.visitSite("/login","Anmelden")

    })    
    it('visits /login going from /register', () => {
        cy.visit("/register")
        cy.visitSite("/login","Anmelden")

    })  
})