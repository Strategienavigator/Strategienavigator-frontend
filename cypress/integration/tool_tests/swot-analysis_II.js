describe('SWOT Analyisis Part II', () => {
    beforeEach(() =>{
        cy.task("queryDb",`DELETE FROM toolbox.saves WHERE owner_id= 1 AND name= "TEST-SWOT VON MAX";`);
        cy.CreateSave("swot-1","TEST-SWOT VON MAX",2)
    })
    it('trys to load save and create action steps',() =>{

       cy.LoginAndLoad("swot")
        
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
    cy.get("div[class='alternative-actions']")
    .find("div[class='addCard card']")
    .click()

    if(index % 3)
    {
        cy.get('input[placeholder="Bezeichnung"]')
        .each(($name) =>
        {
            if($name.is(":visible"))
            {
                UseTestData($name)                
            }
         }) 
         cy.get('textarea[placeholder="Beschreibung"]')
         .each(($desc) =>{
             if($desc.is(":visible"))
             {
                UseTestData($desc)
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
            cy.wrap($divG)
            .should('have.css', 'background-color', 'rgb(0, 128, 0)')
        })
        cy.get('div[class="red"]')
        .each(($divG) =>
        {
            cy.wrap($divG)
            .should('have.css', 'background-color', 'rgb(255, 0, 0)')
        })

}
function UseTestData(dataTyp)
{ 
    cy.fixture("tooltestdata").then(function (testdata)
    {
        this.testdata = testdata;

        let data = this.testdata.data
        let index = Math.floor(Math.random()*data.length)
        
        cy.wrap(dataTyp)
        .type(data[index]["name"]) 
     })
     
 }
