describe('SWOT Analyisis Part I', () => {
      it('trys to create a new SWOT as anonymous',() =>{
          cy.visit('/')
          cy.visitSite("/swot-analysis","SWOT Analyse")

          cy.intercept('POST', /.*api\/users.*/).as('anonym')

          cy.contains("Annehmen")
          .click()
          cy.wait("@anonym")
          cy.intercept('POST', /.*oauth\/token.*/).as('token')
          cy.get("@anonym")
          .its("response")
          .should('include',
            {
              statusCode: 201
            })

          cy.wait("@token")
          cy.get("@token")
          .its("response.body")
          .should('include',
            {
              token_type: "Bearer"
            })
          cy.intercept('GET', /.*api\/settings.*/).as('buildup')

          cy.url().should("include", "swot-analysis")
          cy.wait("@buildup")

          cy.contains("Neue Analyse")
          .click()
          cy.url().should("include", "swot-analysis/new")

          cy.get("input[id='name']")
          .clear()
          .type("TEST-SWOT")
          cy.get("textarea[id='description']")
          .clear()
          .type("TEST-SWOT ist ein Testscenario")

          cy.intercept('POST', /.*api\/saves.*/).as('save')
          cy.get('button[type="submit"]')
          .click()
          cy.wait("@save")
          cy.get("@save")
          .its("response")
          .should('include',
            {
              statusCode: 201
            })
          cy.log("new SWOT created and saved for anonymous")
          cy.log("Removing DB entry for testingpurposes")
          cy.task("queryDb",`DELETE FROM toolbox.saves WHERE name="TEST-SWOT";`);
        })

      it('trys to create a new SWOT as max@test.test', () =>{
        cy.visit("/")
        cy.loginViaApi("max@test.test", "password")
        cy.visit("/swot-analysis")
        cy.url().should("include","swot-analysis")

        cy.contains("Neue Analyse")
        .click()
        cy.url().should("include", "swot-analysis/new")

        cy.get("input[id='name']")
        .clear()
        .type("TEST-SWOT VON MAX")
        cy.get("textarea[id='description']")
        .clear()
        .type("TEST-SWOT ist ein Testscenario von einem API eingeloggten benutzer")

        cy.intercept('POST', /.*api\/saves.*/).as('save')
        cy.get('button[type="submit"]')
        .click()
        cy.wait("@save")
        cy.get("@save")
        .its("response")
        .should('include',
          {
            statusCode: 201
          })

        cy.log("new SWOT created and saved for max@test.test")

      })

      it('trys to fill factors in saved TEST-SWOT VON MAX', () =>{
        CreateSave()
        
        cy.visit("/")
        cy.loginViaApi("max@test.test", "password")
        cy.visit("/swot-analysis")
        cy.url()
          .should("include","swot-analysis")

        cy.contains("TEST-SWOT VON MAX")
          .click()

        cy.intercept('GET', /.*api\/saves.*/).as('loadSave')
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

        //
        //Karten werden hinzugefügt und mit Testdaten gefüllt
        //Es werden erst alle Accordions zusammengeklappt!
        cy.get("button[class='accordion-button']")
          .click()

        //Gehe schritt für Schritt die Accordions durch und fügen Inputfelder hinzu bis wir 4 erreicht haben
        //Dann werden diese mit hilfe von FillFactors mit Testdaten aufgefüllt
        cy.get("button[class='accordion-button collapsed']")
          .each(($press) =>
          {
            var counter = -2; //Input des SWOT-Namens und Beshreibung werden nicht gezählt
            if ($press.is(":visible"))
            {
              cy.wrap($press)
              .click()
            }

            cy.wait(200)


            cy.get("input")
              .each(($countInput) =>
              {
                if ($countInput.is(":visible"))
                {
                  counter++
                }
              })

            cy.get('div[class="addCard card"]')
              .each(($add) =>
              {
                if ($add.is(":visible"))
                {
                  if(counter < 4)
                  {
                    for (let i = 2; i < 4; i++)
                    {
                      cy.wrap($add)
                      .click()
                      counter++

                    }
                  }
                }
              })

            FillFactors();

          })

          cy.log("Additional Cards added and filled")

          //
          cy.contains("Speichern")
          .click();
          
          //TODO: This POST gives back a NULL is that supposed to be so?
          //cy.intercept('POST', /.*api\/saves.*/).as('overWrite')
          /*
          cy.get("@overWrite")
          .its("response")
          .should('include',
          {
            statusCode: null
          })
          */
          
      })

})

function FillFactors()
{
  function GetFillFunction (key, swot)
  {
   return ($input) => {
      if($input.is(":visible"))
        {
          var regex = /([a-zA-Z]+)\[([0-9]+)]\[([a-zA-Z]+)]/;
          var sampleText = $input.attr("name");


          if(sampleText != null && sampleText.length > 0)
          {
            let result = sampleText.match(regex);

            cy.wrap($input)
            .clear()
            .type(swot[result[1]][result[2]][key]);

            CheckFactor(key,$input,swot,result);
          }

        }
      }
  }
  //fixtures tootestdata swot werden hier genutzt
  cy.fixture("tooltestdata").then(function (testdata)
  {
  this.testdata = testdata;
  var swot = this.testdata.swot
  cy.get("input")
    .each(GetFillFunction("title", swot))

  cy.get("textArea")
    .each(GetFillFunction("desc", swot))
  })

  //Hier wird nur übeprüft ob die richtigen Daten im richtigen Feld landen.
  function CheckFactor(key, $input, swot, result,)
  {
    if(key == "title")
    {

    cy.wrap($input).should('have.value', swot[result[1]][result[2]]["title"])

    }else if (key == "desc")
    {

      cy.wrap($input).should('have.value', swot[result[1]][result[2]]["desc"])
      
    }
    
  }
}
function CreateSave()
{
  cy.task("queryDb",
  `INSERT INTO toolbox.saves
    (data, name, tool_id, owner_id, description)
    VALUES
    ('{"swot-factors":{"factors":{"chances":[{"desc":"","name":"","id":"1"},{"desc":"","name":"","id":"2"}],"strengths":[{"desc":"","name":"","id":"A"},{"desc":"","name":"","id":"B"}],"weaknesses":[{"desc":"","name":"","id":"a"},{"desc":"","name":"","id":"b"}],"risks":[{"desc":"","name":"","id":"I"},{"desc":"","name":"","id":"II"}]}}}',
     "TEST-SWOT VON MAX",
      2,
      1,
      "TEST-SWOT ist ein Testscenario von einem API eingeloggten benutzer");`);
}




