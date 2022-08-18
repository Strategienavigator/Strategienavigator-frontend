var testIndex = 0
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
                UseTestData($name, true)
                
            }
        }) 
         cy.get('textarea[placeholder="Beschreibung"]')
         .each(($desc) =>{
             if($desc.is(":visible"))
             {
                UseTestData($desc, false)
                
             }
        })

    }else
    {
        cy.get("[type=checkbox]")
            .check()
    }
    
}
/*
Description: Checking the right colours on the div for the right position
*/
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
/*
Description: Gets the testdata frm "tooltestdata" for simple fillings
Parameters:
    dataTyp - DOMELMENT: is in this case the DOM-Element that needs to be wrapped where the data shall be inputted
    isName - BOOL -just a question if its the name key: value or the desc key:value    
*/
function UseTestData(dataTyp, isName)
{ 
    cy.fixture("tooltestdata").then(function (testdata)
    {
        this.testdata = testdata;

        let data = this.testdata.data
        //let index = Math.floor(Math.random()*data.length)
        if (isName)
        {
            cy.wrap(dataTyp)
            .type(data[testIndex]["name"])
        }else{
            cy.wrap(dataTyp)
            .type(data[testIndex]["desc"])
        }
        testIndex += 1
     })
     
 }
