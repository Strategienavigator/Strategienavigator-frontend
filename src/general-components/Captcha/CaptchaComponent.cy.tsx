import {mount} from "cypress/react18"
import {CaptchaComponent, fallbackImage} from "./CaptchaComponent";
import {CaptchaResponse} from "../Datastructures";
import '../../index.scss'

describe('Captcha', () => {
    Cypress.config("viewportHeight", 500)
    Cypress.config("viewportWidth", 500)

    it.skip("CheckLoadingBehaviour", () => {
        let firstResponse = true;
        // mock network
        cy.intercept({
            method: "GET",
            url: "/.*captcha\\/api.*/"
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
        mount(<CaptchaComponent refreshIntervall={100} keyName={keyName}></CaptchaComponent>);
        cy.wait("@stubedRequest");
        cy.get(`#${keyName}`).should('have.value', 'blib');
        cy.wait("@stubedRequest");
        cy.get(`#${keyName}`).should('have.value', 'blub');
    });
});

