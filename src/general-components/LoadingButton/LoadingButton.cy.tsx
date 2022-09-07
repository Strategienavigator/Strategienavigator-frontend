import {mount} from "cypress/react"
import {LoadingButton} from "./LoadingButton";
import '../../index.scss';


describe('LoadingButton', () => {
    Cypress.config("viewportHeight", 500)
    Cypress.config("viewportWidth", 500)

    it("Check child behaviour", () => {
        mount(<LoadingButton savingChild={"Speichert..."} defaultChild={"Speichern"}
                             isSaving={false}></LoadingButton>).then(({rerender}) => {
            cy.get(".btn").contains("Speichern").should("be.enabled")

            rerender(<LoadingButton savingChild={"Speichert..."} defaultChild={"Speichern"}
                                    isSaving={true}></LoadingButton>)
            cy.get(".btn").contains("Speichert...").should("not.be.enabled")

        })
    });
});

