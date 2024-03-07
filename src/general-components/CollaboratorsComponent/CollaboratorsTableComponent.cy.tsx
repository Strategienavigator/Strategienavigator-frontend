import {mount} from "cypress/react18"
import {SharedSavePermission, SharedSaveResource} from "../Datastructures";
import '../../index.scss'
import {CollaboratorsTableComponent} from "./CollaboratorsTableComponent";

describe.skip('Collaborators Dots ', () => {
    Cypress.config("viewportHeight", 500)
    Cypress.config("viewportWidth", 500)

    it.skip("2 Users", () => {

        const owner = {
            id: 11,
            username: "First Test"
        };

        const collabs: SharedSaveResource[] = [{
            id: 1,
            accepted: true,
            created_at: new Date().toDateString(),
            declined: false,
            revoked: false,
            user: owner,
            permission: SharedSavePermission.ADMIN,
            save: {
                id: 21,
                name: "TestSave",
                owner: owner,
                tool: {
                    name: "TestTool",
                    id: 1
                }
            }
        }]
        mount(<CollaboratorsTableComponent collaborators={collabs}></CollaboratorsTableComponent>);

    });

    /*
    it("0 Users", () => {


        mount(<CollaboratorsTableComponent collaborators={[]}></CollaboratorsTableComponent>);
        cy.get('.collaborators').should('be.empty');

    });

    it("Hover Test", () => {

        const collabs: SimplestUserResource[] = [{
            id: 10,
            username: "First Test"
        }]
        mount(<CollaboratorsTableComponent collaborators={collabs}></CollaboratorsTableComponent>);
        cy.get('.collaborator').trigger('mouseover');
        cy.contains('First Test').should('be.visible');
        cy.get('.collaborator').trigger('mouseout');
    });

    it("Click Test", () => {

        const collabs: SimplestUserResource[] = [{
            id: 10,
            username: "First Test"
        }]
        mount(<CollaboratorsTableComponent collaborators={collabs}></CollaboratorsTableComponent>);
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
        mount(<CollaboratorsTableComponent collaborators={collabs}></CollaboratorsTableComponent>);
        cy.get('.collaborator').click();
        cy.contains('First Test').should('be.visible');
        cy.contains('(Sie)').should('be.visible');
    });*/
});

