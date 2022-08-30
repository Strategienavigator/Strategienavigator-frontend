const { wait } = require("@testing-library/react");

describe('SWOT Analyisis Part III', () => {
    beforeEach(() =>{
        cy.task("queryDb",`DELETE FROM toolbox.saves WHERE owner_id= 1 AND name= "TEST-SWOT VON MAX";`);
        
    })
    it('trys to classify the steps',() =>{
        cy.CreateSave("swot-2","TEST-SWOT VON MAX",2)
        cy.LoginAndLoad("swot")

        cy.get("button[class='addClassification btn btn-primary']")
        .click()
        cy.wait(100)
        cy.get("input[name='droppable-1']")
        .clear()
        .type("Klassifikation 1")
        
        cy.get("button[class='addClassification btn btn-primary']")
        .click()
        cy.wait(100)
        cy.get("input[name='droppable-2']")
        .clear()
        .type("Klassifikation 2")
        
   
        //collapse accordion to hide 
        cy.get("button[class='accordion-button']")
        .each(($button) =>
        {  
            if($button.is(":visible"))
            {
            cy.wrap($button)
            .click()
            }
        })
        
        for (let i = 0; i < 84; i++) 
        {         
            cy.get("form[id='swot-classify-alternate-actions']>.actionCards")
            .find("button[class='btn btn-primary btn-sm']").as("button")
            .first()
            .click()   
            
            let select
            let inputValue
            let valueText

            //To get a specific child and the text out of it.
            cy.get("@button")
            .parent()
            .parent()
            .children()
            .next()
            .first()
            .invoke("text")
            .as("text")

            if (i % 2)
            {               
                select = 'droppable-1'
                inputValue = "input[value='Klassifikation 1']"
                valueText = 'Klassifikation 1'

            }else
            {
                select = 'droppable-2'
                inputValue = "input[value='Klassifikation 2']"
                valueText = 'Klassifikation 2'
            }
            cy.get('.modal-body select').select(select)

            cy.get('@text').then((text) => {
                //going through the tree to find current parents and being part of the right input group
                cy.contains(text)
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .children(".accordion-header")
                .children(".accordion-button")
                .children(".input-group")
                .find("input")
                .should("contain.value", valueText)
            })
           
        }
        cy.contains("Speichern")
        .click();   
    })
})
