describe('register on the Website', () => {
    beforeEach(() => {
        cy.task("queryDb", `DELETE FROM toolbox.users WHERE username="Tim_Tester";`);
    })
    it('trys to send a email', () => {
        cy.visit("/register");
        cy.intercept('GET', /.*api\/checkEmail.*/).as('checkEmail')
        cy.get('#email').type('Tim@jade-hs.de')
        cy.wait("@checkEmail")

        cy.get('@checkEmail')
            .its("response.body")
            .should('nested.include', {
                "data.available": true
            })
        cy
            .contains("E-Mail ist Verfügbar!")
            .should("be.visible")

        //--
        cy.intercept('GET', /.*api\/checkUsername.*/).as('checkUser')
        cy.get('#username').type('Tim_Tester')

        cy.wait("@checkUser")

        cy.get('@checkUser')
            .its("response.body")
            .should('nested.include', {
                "data.available": true
            })
        cy
            .contains("Username ist Verfügbar!")
            .should("be.visible")

        //--
        cy.get('#password').type('Password123*')
        cy.get('#passwordConfirm').type('Password123*')
        cy.contains("Ihr Passwort ist gültig!")
            .should("be.visible")

        cy.get("input[name=\"captcha\"]").type("test_input"); // input doesn't matter because check is disabled

        cy.intercept('POST', /.*api\/users.*/).as('create')
        cy.get('button[type=submit]').click()

        cy.get(".feedback.SUCCESS")
            .contains("Username ist Verfügbar!")
            .should("be.visible")

        cy.log('**register API call**')
        cy.wait('@create')
            .its('request.body')
            .should('include', "Tim_Tester")
            .and("include", "Tim@jade-hs.de")

        cy.get('@create').its('response')
            .should('include', {
                statusCode: 201
            })

        cy
            .contains("Konto erstellt! Überprüfe deine Emails!")
            .should("be.visible")
    })
})
