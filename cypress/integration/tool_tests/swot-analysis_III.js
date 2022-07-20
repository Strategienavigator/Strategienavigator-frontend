const { wait } = require("@testing-library/react");

describe('SWOT Analyisis Part I', () => {
    beforeEach(() =>{
        cy.task("queryDb",`DELETE FROM toolbox.saves WHERE owner_id= 1 AND name= "TEST-SWOT VON MAX";`);
        cy.CreateSave("swot-2","TEST-SWOT VON MAX",2)
    })
    it('trys to classify the steps',() =>{
        cy.visit("/")
        cy.loginViaApi()
        cy.visit("/swot-analysis")

        cy.intercept('GET', /.*api\/saves.*/).as('loadSave')
        cy.contains("TEST-SWOT VON MAX")
        .click()

        cy.wait("@loadSave")
        cy.get("@loadSave")
        .its("response")
        .should('include',
        {
            statusCode: 200
        })

        cy.url()
        .should("include", "swot-analysis")
        cy.log("Save loaded")
        
    
        
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
        
        var count = 0;
        
        //collapse accordion to hide accordion
        cy.get("button[class='accordion-button']")
        .each(($button) =>
        {  
            if($button.is(":visible"))
            {
            cy.wrap($button)
            .click()
            }
        })
        
        for (let i = 0; i < 32; i++) 
        {
            cy.get("form[id='swot-classify-alternate-actions']")
            .children('.actionCards')// actionCards
                .children()// actionCard card
                    .children()// card-body
                        .children()//row
                            .children()//col
                                .children('.btn.btn-primary.btn-sm')
            .first().then(($button) =>
            {          
                    count++  
                    cy.wrap($button)
                    .click()

                    cy.get('select').each(($select) =>
                    {
                        if ($select.is(":visible"))
                        {
                            if (count % 2)
                            {
                                cy.wrap($select)
                                .select('droppable-1')
                            }else
                            {
                                cy.wrap($select)
                                .select('droppable-2')                           
                            }
                                                       
                        }
                    })
            })      
        }
        cy.contains("Speichern")
        .click();   
       
    })
})
