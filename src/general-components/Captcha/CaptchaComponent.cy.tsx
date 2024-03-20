import {mount} from "cypress/react18"
import {CaptchaComponent, fallbackImage} from "./CaptchaComponent";
import {CaptchaResponse} from "../Datastructures";
import '../../index.scss'

describe('Captcha', () => {
    Cypress.config("viewportHeight", 500)
    Cypress.config("viewportWidth", 500)

    it("CheckLoadingBehaviour", () => {
        let firstResponse = true;
        // mock network
        cy.intercept({
            method: "GET",
            url: "**captcha/api"
        }, (req) => {
            if (firstResponse) {
                firstResponse = false;
                req.reply({
                    img: fallbackImage,
                    key: "blib",
                    sensitive: false
                } as CaptchaResponse);
            } else {
                req.reply({
                    img: fallbackImage,
                    key: "blub",
                    sensitive: false
                } as CaptchaResponse);
            }
        }).as("stubedRequest");
        const keyName = "captchaKey";
        const captchaName = "captchaInput";
        mount(<CaptchaComponent refreshIntervall={0.5} keyName={keyName} captchaName={captchaName}></CaptchaComponent>);
        cy.wait("@stubedRequest");
        cy.get(`#${keyName}`).should('have.value', 'blib');

        cy.get(`#${captchaName}`).as('inp').type('testInput');
        cy.get('@inp').should('have.value','testInput');

        cy.wait("@stubedRequest");
        cy.get(`#${keyName}`).should('have.value', 'blub');
        cy.get('@inp').should('be.empty');
    });
});

