const { wait } = require("@testing-library/react");

describe('SWOT Analyisis Part III', () => {
    beforeEach(() =>{
        cy.task("queryDb",`DELETE FROM toolbox.saves WHERE owner_id= 1 AND name= "TEST-SWOT VON MAX";`);
        cy.CreateSave("swot-2","TEST-SWOT VON MAX",2)
    })
    it('trys to classify the steps',() =>{
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
            .find("button[class='btn btn-primary btn-sm']")
            .first().click()   
            
            let select

            if (i % 2)
            {
                
                select = 'droppable-1'

            }else
            {
                select = 'droppable-2'
            }
            cy.get('.modal-body select').select(select)
    
        }
        cy.contains("Speichern")
        .click();   
       
    })
    it('trys to check the distribution of the steps',() =>{
        cy.LoginAndLoad("SWOT")

    })
})
function CheckDistributionOfCards()
{
    cy.get("div[class='swot-classify-alternate-actions'")
    .find("button[value='Klassifikation 1']")
    .click()
}