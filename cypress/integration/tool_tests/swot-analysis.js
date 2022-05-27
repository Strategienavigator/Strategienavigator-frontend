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
      .should('include',{
          statusCode: 201
        })
      cy.log("new SWOT created and saved for max@test.test")
        
      /*
      //-- TODO
      //Texte werden vorbereitet
      let testText = {"strenghts": [
        {"a":[{
            "title": "Motivierte Mitarbeiter mit viel Know How",
            "desc":"Motivierte Mitarbeiter"
        }]},
        {"b":[{
          "title": "Erfolgreiche Marketingkampagnen",
           "desc":"Marketingkampagnen"
        }]},
        {"c":[{
          "title": "Moderne Produktionsmaschinen",
           "desc":"Produktionsmaschinen"
        }]},
        {"d":[
          {"title": "Gut gelegener Standort",
           "desc":"Gut gelegener Standort"
        }]}
      ]};
     
      var weakness = [
        a[title= "Hohe Personalkosten", desc="Personalkosten " ],
        b[title= "Produkte wenig nachhaltig", desc="nachhaltig" ],
        c[title= "Hohe Fluktuationsrate", desc="Fluktuationsrate" ],
        d[title= "Geringe finanzielle Möglichkeiten ", desc="Möglichkeiten" ]
      ]
      var chancen = [
        a[title= "Produkt ist im Trend", desc="Trend" ],
        b[title= "Produkt wird auch in anderen Ländern beliebter", desc="anderen Ländern beliebter" ],
        c[title= "Neue Technologien", desc="Technologien" ],
        d[title= "Demographische Veränderung", desc="Veränderung" ]
      ]
      var threats = [
        a[title= "Kunden achten stark auf Nachhaltigkeit", desc="Nachhaltigkeit" ],
        b[title= "Neue Konkurrenz aus dem Ausland", desc="dem Ausland" ],
        c[title= "Sinkendes Preisniveau", desc="Preisniveau" ],
        d[title= "Neue Gesetze", desc="Gesetze" ]
      ]
      */


       //--
      //Fügen jeweils 2 einträge bei den SWOT hinzu
      cy.get('div[class="addCard card"]')
        .each(($add) =>{
          if($add.is(":visible")){
            cy.wrap($add)
            .click()
            .click()
          }
      cy.get('input[name= /.*strenght.*/')
      .each(($input) => {
        switch($input.attr[0].name){

            case /.*[0].*/: 
              cy.wrap(input)
              .type(testText["strenghts"["a"["title"]]])
              break;
              case /.*[1].*/: 
              cy.wrap(input)
              .type(testText["strenghts"["a"["desc"]]])
          }
       })
    })
  })
})


