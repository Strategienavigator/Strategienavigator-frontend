import {mount} from "cypress/react18"
import '../../index.scss'
import {HoverWindow} from "./HoverWindow";
import {Button} from "react-bootstrap";
import {OverlayInjectedProps} from "react-bootstrap/Overlay";

describe('HoverWindow', () => {
    Cypress.config("viewportHeight", 500)
    Cypress.config("viewportWidth", 500)

    it("Focus", () => {
        const trigger = cy.stub().as("triggerCb");
        mount(<HoverWindow description={"Beschreibung"} title={"Titel"} onToggle={trigger}>
            <Button id={"testbutton"}>TestButton</Button>
        </HoverWindow>);

        cy.get("#testbutton").focus();
        cy.get('@triggerCb').should("be.called.with", true)
        cy.contains("Titel");
        cy.contains("Beschreibung");
        cy.get("#testbutton").blur();
        cy.contains("Titel").should('not.exist');
        cy.contains("Beschreibung").should('not.exist');
    });

    it("Hover", () => {
        const trigger = cy.stub().as("triggerCb");
        mount(<HoverWindow description={"Beschreibung"} title={"Titel"} onToggle={trigger}>
            <Button id={"testbutton"}>TestButton</Button>
        </HoverWindow>);

        cy.get("#testbutton").trigger('mouseover');
        cy.get('@triggerCb').should("be.called.with", true)
        cy.contains("Titel");
        cy.contains("Beschreibung");
        cy.get("#testbutton").trigger('mouseout');

        cy.contains("Titel").should('not.exist');
        cy.contains("Beschreibung").should('not.exist');
        cy.get('@triggerCb').should('be.called.with', false);
    });

    it("Disabled", () => {
        const trigger = cy.stub().as("triggerCb");
        mount(<HoverWindow disabled={true} description={"Beschreibung"} title={"Titel"} onToggle={trigger}>
            <Button id={"testbutton"}>TestButton</Button>
        </HoverWindow>);

        cy.get("#testbutton").trigger('mouseover');
        cy.get('@triggerCb').should("not.be.called")
        cy.contains("Titel").should('not.exist');
        cy.contains("Beschreibung").should('not.exist');
        cy.get("#testbutton").trigger('mouseout');

        cy.contains("Titel").should('not.exist');
        cy.contains("Beschreibung").should('not.exist');
        cy.get('@triggerCb').should('not.be.called');
    });

    it("Custom Popup", () => {
        const popOver = function ({title, description}: OverlayInjectedProps) {
            return (<>
                {description}
                <div id={"testDiv"}>{title}</div>
            </>)
        };
        const trigger = cy.stub().as("triggerCb");
        mount(<HoverWindow customPopUp={popOver} description={"Beschreibung"} title={"Titel"} onToggle={trigger}>
            <Button id={"testbutton"}>TestButton</Button>
        </HoverWindow>);

        cy.get("#testbutton").trigger('mouseover');
        cy.get('@triggerCb').should("be.called.with", true)
        cy.get("div[id='testDiv']").should('exist');
        cy.contains("Titel");
        cy.contains("Beschreibung");
        cy.get("#testbutton").trigger('mouseout');
        cy.contains("Titel").should('not.exist');
        cy.contains("Beschreibung").should('not.exist');
        cy.get("div[id='testDiv']").should('not.exist');
        cy.get('@triggerCb').should('be.called.with', false);
    });
});

