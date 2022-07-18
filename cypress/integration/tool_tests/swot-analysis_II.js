const { wait } = require("@testing-library/react");

describe('SWOT Analyisis Part II', () => {
    beforeEach(() =>{
        cy.task("queryDb",`DELETE FROM toolbox.saves WHERE owner_id= 1 AND name= "TEST-SWOT VON MAX";`);
        CreateSave()
    })
    it('trys to load save and create action steps',() =>{
        cy.visit("/")
        cy.loginViaApi("max@test.test", "password")
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
    })
})
function FillActionStep(index)
{
    //TODO: Sinnvolle Text um Vergleiche zu ermöglichen und Kontrollen
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

function CreateSave()
{
  cy.task("queryDb",
  `INSERT INTO toolbox.saves
    (data, name, tool_id, owner_id, description)
    VALUES
    ('{"swot-factors":{"factors":{"chances":[{"id":"1","name":"Produkt ist im Trend","desc":"Trend"},{"id":"2","name":"Produkt wird auch in anderen Ländern beliebter","desc":"anderen Ländern beliebter"},{"id":"3","name":"Neue Technologien","desc":"Technologien"},{"id":"4","name":"Demographische Veränderung","desc":"Veränderung"}],"strengths":[{"id":"A","name":"Motivierte Mitarbeiter mit viel Know How","desc":"Motivierte Mitarbeiter"},{"id":"B","name":"Erfolgreiche Marketingkampagnen","desc":"Marketingkampagnen"},{"id":"C","name":"Moderne Produktionsmaschinen","desc":"Produktionsmaschinen"},{"id":"D","name":"Gut gelegener Standort","desc":"Gut gelegener Standort"}],"weaknesses":[{"id":"a","name":"Hohe Personalkosten","desc":"Personalkosten "},{"id":"b","name":"Produkte wenig nachhaltig","desc":"nachhaltig"},{"id":"c","name":"Hohe Fluktuationsrate","desc":"Fluktuationsrate"},{"id":"d","name":"Geringe finanzielle Möglichkeiten ","desc":"Möglichkeiten"}],"risks":[{"id":"I","name":"Kunden achten stark auf Nachhaltigkeit","desc":"Nachhaltigkeit"},{"id":"II","name":"Neue Konkurrenz aus dem Ausland","desc":"dem Ausland"},{"id":"III","name":"Sinkendes Preisniveau","desc":"Preisniveau"},{"id":"IV","name":"Neue Gesetze","desc":"Gesetze"}]}}}',
     "TEST-SWOT VON MAX",
      2,
      1,
      "TEST-SWOT ist ein Testscenario von einem API eingeloggten benutzer");`);
}