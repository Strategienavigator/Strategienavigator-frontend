import {mount} from "cypress/react18"
import {SimplestUserResource} from "../Datastructures";
import '../../index.scss'
import {CollaboratorsDotsComponent} from "./CollaboratorsDotsComponent";
import {Session} from "../Session/Session";
import {User} from "../User";

describe('Collaborators Dots ', () => {
    Cypress.config("viewportHeight", 500)
    Cypress.config("viewportWidth", 500)

    it("2 Users", () => {

        const collabs: SimplestUserResource[] = [{
            id: 10,
            username: "First Test"
        }, {
            id: 12,
            username: "Second Test"
        }]
        mount(<CollaboratorsDotsComponent collaborators={collabs}></CollaboratorsDotsComponent>);
        cy.get('.collaborators').children().as('childs').should('have.length', 2);

        cy.get('@childs').first().contains("F");
        cy.get('@childs').last().contains("S");

    });

    it("0 Users", () => {


        mount(<CollaboratorsDotsComponent collaborators={[]}></CollaboratorsDotsComponent>);
        cy.get('.collaborators').should('be.empty');

    });

    it("Hover Test", () => {

        const collabs: SimplestUserResource[] = [{
            id: 10,
            username: "First Test"
        }]
        mount(<CollaboratorsDotsComponent collaborators={collabs}></CollaboratorsDotsComponent>);
        cy.get('.collaborator').trigger('mouseover');
        cy.contains('First Test').should('be.visible');
        cy.get('.collaborator').trigger('mouseout');
    });

    it("Click Test", () => {

        const collabs: SimplestUserResource[] = [{
            id: 10,
            username: "First Test"
        }]
        mount(<CollaboratorsDotsComponent collaborators={collabs}></CollaboratorsDotsComponent>);
        cy.get('.collaborator').click();
        cy.contains('First Test').should('be.visible');
        cy.get('.collaborator').trigger('mouseout');
    });

    it("Self", () => {

        Session.currentUser = new User(10, "First Test", Cypress.env('TEST_LOGIN_USERNAME'), false, [], [], new Date());
        const collabs: SimplestUserResource[] = [{
            id: 10,
            username: "First Test"
        }]
        mount(<CollaboratorsDotsComponent collaborators={collabs}></CollaboratorsDotsComponent>);
        cy.get('.collaborator').click();
        cy.contains('First Test').should('be.visible');
        cy.contains('(Sie)').should('be.visible');
    });
});

