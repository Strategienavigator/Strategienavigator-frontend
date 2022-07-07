describe('SWOT Analyisis', () => {
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
          .should('include',{
              statusCode: 201
            })
          
          cy.wait("@token")
          cy.get("@token")
          .its("response.body")
          .should('include',{
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
          .should('include',{
              statusCode: 201
            })
          cy.log("new SWOT created and saved for anonymous")
      })

      it.only('trys to create a new SWOT as max@test.test and fill in Factors', () =>{
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
        .should('include',{
            statusCode: 201
          })
        cy.log("new SWOT created and saved for max@test.test")
          
        
        
        //--
        //Fügen jeweils 2 einträge bei den SWOT hinzu
        cy.get('div[class="addCard card"]')
          .each(($add) =>
          {
            if ($add.is(":visible"))
            {
              cy.wrap($add)
              .click()
              .click()           
            }
          })
        
          cy.get("button[class='accordion-button collapsed']")
          .each(($press) =>
          {
            if ($press.is(":visible"))
            {
              cy.wrap($press)
              .click()
            }
            cy.wait(500)
            cy.get('div[class="addCard card"]')
            .each(($add) =>
            {
              if ($add.is(":visible"))
              {
                cy.wrap($add)
                .click()
                .click()     
              }     
            })
          })

          cy.log("Karten hinzugefügt")

          cy.log("Starting filling up Fields")
          FillFactors();

          //TODO other wait option
          cy.wait(500)
          cy.get("button[class='accordion-button collapsed']")
          .each(($press) =>
          {
            if ($press.is(":visible"))
            {
              cy.wrap($press)
              .click()
            }
            //TODO other wait option
            cy.wait(500)
            FillFactors();

          })
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
            //catergory = 0-strengths, 1-weaknesses, 2-chances, 3-risks
            
            let result = sampleText.match(regex);

            cy.wrap($input)
            .type(swot[result[1]][result[2]][key]);

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
  
}
