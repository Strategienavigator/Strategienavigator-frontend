import {mount} from "cypress/react18"
import '../../../index.scss'
import {MyProfile} from "./MyProfile";

describe('Captcha', () => {
    Cypress.config("viewportHeight", 500)
    Cypress.config("viewportWidth", 500)

    before(function () {

    })

    it("CheckLoadingBehaviour", () => {
        // mock network
        cy.intercept({
            method: "GET",
            url: "**api/"
        }, (req) => {

        }).as("stubedRequest");
        const keyName = "captchaKey";
        const captchaName = "captchaInput";
        mount(<MyProfile></MyProfile>);
        cy.wait("@stubedRequest");
        cy.get(`#${keyName}`).should('have.value', 'blib');

        cy.get(`#${captchaName}`).as('inp').type('testInput');
        cy.get('@inp').should('have.value','testInput');

        cy.wait("@stubedRequest");
        cy.get(`#${keyName}`).should('have.value', 'blub');
        cy.get('@inp').should('be.empty');
    });
});

