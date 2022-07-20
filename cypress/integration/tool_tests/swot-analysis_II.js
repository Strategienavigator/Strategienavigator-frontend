describe('SWOT Analyisis Part II', () => {
    beforeEach(() =>{
        cy.task("queryDb",`DELETE FROM toolbox.saves WHERE owner_id= 1 AND name= "TEST-SWOT VON MAX";`);
        cy.CreateSave("swot-1","TEST-SWOT VON MAX",2)
    })
    it('trys to load save and create action steps',() =>{
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

        cy.contains("Weiter")
        .click()
        
            for (let i = 0; i < 64; i++) 
            {
                FillActionStep(i)
            
                cy.log("Step: " + i)
                if(i < 63)
                    {
                    cy.contains("Nächster")
                    .click()
                    }
            }
            CheckColor() 
              
        cy.contains("Nächster")
        .click()  
        cy.contains("Speichern")
        .click();   
    })
})
function FillActionStep(index)
{
    if(index % 2)
    {
        cy.get('input[placeholder="Bezeichnung"]')
        .each(($name) =>
        {
            if($name.is(":visible"))
            {
                cy.wrap($name)
                .type("GERADEREARERRERERER") 

               
                cy.get('textarea[placeholder="Beschreibung"]')
                .each(($desc) =>{
                    if($desc.is(":visible"))
                    {
                        cy.wrap($desc)
                        .type("Bescheeieriibib")
                    }
                })

            }
         })        
    }else
    {
        cy.get("[type=checkbox]")
            .check()
    }
    
}

function CheckColor()
{
    //Checkt die Farbe des Divs
    cy.get('div[class="green"]')
        .each(($divG) =>
        {
            cy.wrap($divG).should('have.css', 'background-color', 'rgb(0, 128, 0)')
        })
        cy.get('div[class="red"]')
        .each(($divG) =>
        {
            cy.wrap($divG).should('have.css', 'background-color', 'rgb(255, 0, 0)')
        })

}