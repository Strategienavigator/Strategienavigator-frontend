import {mount} from "cypress/react18"
import '../../index.scss'
import {Messages, SingleMessageProps, useMessageContext} from "./Messages";
import {useEffect} from "react";

function MessageDispatcher(props: SingleMessageProps) {

    const {addWithProps} = useMessageContext();
    useEffect(() => {

        addWithProps(props);
        return () => {

        }
    }, [])
    return null;
}


describe('Messages', () => {
    Cypress.config("viewportHeight", 500)
    Cypress.config("viewportWidth", 500)


    it("Check one", () => {

        cy.clock();
        mount(<Messages
            xAlignment={"CENTER"}
            yAlignment={"BOTTOM"}
            style={{marginBottom: 65}}
        ><MessageDispatcher content={"TestWarning"} type={"WARNING"} timer={100}/></Messages>)

        cy.contains("TestWarning");
        cy.tick(99);
        cy.contains("TestWarning");
        cy.tick(3)
        cy.contains("TestWarning").should('not.exist');

    });
    it("Check multiple", () => {
        cy.clock();
        mount(<Messages
            xAlignment={"CENTER"}
            yAlignment={"BOTTOM"}
            style={{marginBottom: 65}}
        ><MessageDispatcher content={"TestWarning1"} type={"WARNING"} timer={100}/>
            <MessageDispatcher content={"TestWarning2"} type={"DANGER"} timer={200}/>
        </Messages>)

        cy.contains("TestWarning1");
        cy.contains("TestWarning2");
        cy.tick(102);
        cy.contains("TestWarning2");
        cy.contains("TestWarning1").should('not.exist');
        cy.tick(100);
        cy.contains("TestWarning2").should('not.exist');
        cy.contains("TestWarning1").should('not.exist');
    });
});

