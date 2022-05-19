import { copySync } from "typedoc/dist/lib/utils";

describe('register on the Website', () => {
    it.only('trys to send a email"', () => {
        cy.visit('/register');

        cy.get('#email').type('Tim@test.test')
        cy.get('#username').type('Tim_Tester')
        cy.get('#password').type('Password123*')
        cy.get('#passwordConfirm').type('Password123*')

        cy.intercept('POST', '/register').as('register')
        cy.get('button[type=submit]').click()
        /* 
        cy.log('**redirects to /confirm**')
        cy.location('pathname').should('equal', '/confirm')
        */
        cy.log('**register API call**')
        cy.wait('@register').its('request.body').should('deep.equal', {
          name: 'Tim_Tester',
          email: 'Tim@test.test',
          password: 'Password123*',
        })
        // once we have waited for the ajax call once,
         // we can immediately get it again using cy.get(<alias>)
        cy.get('@register').its('response.body').should('deep.equal', {
        // the response from the API should only
        // include name and email
        name: 'Tim_Tester',
        email: 'Tim@test.test',
        })
    })
})