describe('register on the Website', () => {
    beforeEach(() =>{
        cy.task("queryDb",`DELETE FROM toolbox.users WHERE username="Tim_Tester";`);
    })
    it('trys to send a email',() =>{
        cy.visit("/register");
        cy.get('#email').type('Tim@jade-hs.de')
        cy.intercept('GET', /.*api\/checkEmail.*/).as('checkEmail')
        cy.wait("@checkEmail")

        cy.get('@checkEmail')
        .its("response.body")
        .should('nested.include',{"data.available": true
        })
        cy.get("div")
        .contains("E-Mail ist Verfügbar!")
        .should("be.visible")

        //--
        cy.get('#username').type('Tim_Tester')
        cy.intercept('GET', /.*api\/checkUsername.*/).as('checkUser')
        cy.wait("@checkUser")
        
        cy.get('@checkUser')
        .its("response.body")
        .should('nested.include',{"data.available": true
        })
        cy.get("div")
        .contains("Username ist Verfügbar!")
        .should("be.visible")

        //--
        cy.get('#password').type('Password123*')
        cy.get('#passwordConfirm').type('Password123*')
        cy.get("div")
        .contains("Ihr Passwort ist gültig !")
        .should("be.visible")

        cy.intercept('POST', /.*api\/users.*/).as('create')
        cy.get('button[type=submit]').click()

        cy.get("div[class='feedback SUCCESS']")
        .contains("Username ist Verfügbar!")
        .should("be.visible")

        cy.log('**register API call**')
        cy.wait('@create')
        .its('request.body')
        .should('include',"Tim_Tester")
        .and("include","Tim@jade-hs.de")

        cy.get('@create').its('response')
        .should('include',{
            statusCode: 201
          })

        cy.get("div")
        .contains("Konto erstellt! Überprüfe deine Emails!")
        .should("be.visible")
    })
})