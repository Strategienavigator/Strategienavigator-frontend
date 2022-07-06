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

    it('trys to create a new SWOT as max@test.test and fill in Factors', () =>{
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
        
      
      
      cy.log("Testeinträge erstellt")
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

        ////////////////////////Texte werden vorbereitet
        var strenghts = {
          "a":{
              "title": "Motivierte Mitarbeiter mit viel Know How",
              "desc":"Motivierte Mitarbeiter"
          },
          "b":{
            "title": "Erfolgreiche Marketingkampagnen",
            "desc":"Marketingkampagnen"
          },
          "c":{
            "title": "Moderne Produktionsmaschinen",
            "desc":"Produktionsmaschinen"
          },
          "d":{
            "title": "Gut gelegener Standort",
            "desc":"Gut gelegener Standort"
          }
        };
        var weakness = {
          "a":{
            "title": "Hohe Personalkosten",
            "desc":"Personalkosten " 
          },
          "b":{
            "title": "Produkte wenig nachhaltig",
            "desc":"nachhaltig" 
            },
          "c":{
            "title": "Hohe Fluktuationsrate",
            "desc":"Fluktuationsrate"
          },
          "d":{
            "title": "Geringe finanzielle Möglichkeiten ",
            "desc":"Möglichkeiten"
            }
        };
        var chancen = {
          "a":{
            "title": "Produkt ist im Trend",
            "desc":"Trend",
          },
          "b":{
            "title": "Produkt wird auch in anderen Ländern beliebter",
            "desc":"anderen Ländern beliebter" 
          },
          "c":{
            "title": "Neue Technologien",
            "desc":"Technologien"
            },
          "d":{
            "title": "Demographische Veränderung",
            "desc":"Veränderung"
          }
        };
        var risk = {
          "a":{
            "title": "Kunden achten stark auf Nachhaltigkeit",
            "desc":"Nachhaltigkeit" 
            },
          "b":{
            "title": "Neue Konkurrenz aus dem Ausland",
            "desc":"dem Ausland" 
          },
          "c":{
            "title": "Sinkendes Preisniveau",
            "desc":"Preisniveau" 
          },
          "d":{"title": "Neue Gesetze",
          "desc":"Gesetze"  }
        }; 
        ////////////////////////////
        ///Start von unten nach oben mit Infos füllen
        cy.get("input")
        .each(($input) => {
          if ($input.is(":visible"))
          {
              if($input.attr("name") == "risks[0][name]")
              {
                cy.wrap($input)
                .type(risk.a.title)
              }
              if($input.attr("name") == "risks[1][name]")
              {
                cy.wrap($input)
                .type(risk.b.title)
              }
              if($input.attr("name") == "risks[2][name]")
              {
                cy.wrap($input)
                .type(risk.c.title)
              }
              if($input.attr("name") == "risks[3][name]")
              {
                cy.wrap($input)
                .type(risk.d.title)
              }
          }    
        })
        cy.get("textArea")
        .each(($textArea) => {
            if ($textArea.is(":visible"))
            {
              if($textArea.attr("name") == "risks[0][desc]")
              {
                cy.wrap($textArea)
                .type(risk.a.desc)
              }
              if($textArea.attr("name") == "risks[1][desc]")
              {
                cy.wrap($textArea)
                .type(risk.b.desc)
              }
              if($textArea.attr("name") == "risks[2][desc]")
              {
                cy.wrap($textArea)
                .type(risk.c.desc)
              }
              if($textArea.attr("name") == "risks[3][desc]")
              {
                cy.wrap($textArea)
                .type(risk.d.desc)
              }
          
            }
        }) 
      
        //MEGAfüller
        cy.get("button[class='accordion-button collapsed']")
        .each(($press) =>
        {
          if ($press.is(":visible"))
          {
            cy.wrap($press)
            .click()
          }
          cy.wait(500)

          //Regex Einstellung for prozeduale Restaufüllung
          var regexStrengths = /.*strengths.*/,
              regexWeakness = /.*weakness.*/,
              regexChancen = /.*chances.*/,
              regexIndex0 = /.*[0].*/,
              regexIndex1 = /.*[1].*/,
              regexIndex2 = /.*[2].*/,
              regexIndex3 = /.*[3].*/,
              sampleString = " ";

          cy.get("input")
          .each(($input) => {
            if ($input.is(":visible"))
            {
              sampleString = $input.attr("name");
              cy.log(sampleString);

              switch(true)
              {
                case regexStrengths.test(sampleString):
                    switch(true)
                    {
                      case  regexIndex0.test(sampleString):  
                                    cy.wrap($input)
                                    .type(strenghts.a.title)
                                    break;
                      case  regexIndex1.test(sampleString):  
                                    cy.wrap($input)
                                    .type(strenghts.b.title)
                                    break;
                      case  regexIndex2.test(sampleString):  
                                    cy.wrap($input)
                                    .type(strenghts.c.title)
                                    break;
                      case  regexIndex3.test(sampleString):  
                                    cy.wrap($input)
                                    .type(strenghts.d.title)
                                    break;
                    }
                    break;
                  case regexWeakness.test(sampleString):
                    switch(true)
                    {
                      case  regexIndex0.test(sampleString):  
                                    cy.wrap($input)
                                    .type(weakness.a.title)
                                    break;
                      case  regexIndex1.test(sampleString):  
                                    cy.wrap($input)
                                    .type(weakness.b.title)
                                    break;
                      case  regexIndex2.test(sampleString):  
                                    cy.wrap($input)
                                    .type(weakness.c.title)
                                    break;
                      case  regexIndex3.test(sampleString):  
                                    cy.wrap($input)
                                    .type(weakness.d.title)
                                    break;
                    }
                    break;

                  case regexChancen.test(sampleString):
                    switch(true)
                    {
                      case  regexIndex0.test(sampleString):  
                                    cy.wrap($input)
                                    .type(chancen.a.title)
                                    break;
                      case regexIndex1.test(sampleString):  
                                    cy.wrap($input)
                                    .type(chancen.b.title)
                                    break;
                      case  regexIndex2.test(sampleString):  
                                    cy.wrap($input)
                                    .type(chancen.c.title)
                                    break;
                      case  regexIndex3.test(sampleString):  
                                    cy.wrap($input)
                                    .type(chancen.d.title)
                                    break;
                    }
                    break;
              }
            }
          })
          cy.get("textArea")
        .each(($textArea) => {
            if ($textArea.is(":visible"))
            {
              sampleString = $textArea.attr("name");
              cy.log(sampleString);

              switch(true)
              {
                case regexStrengths.test(sampleString):
                    switch(true)
                    {
                      case  regexIndex0.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(strenghts.a.desc)
                                    break;
                      case  regexIndex1.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(strenghts.b.desc)
                                    break;
                      case  regexIndex2.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(strenghts.c.desc)
                                    break;
                      case  regexIndex3.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(strenghts.d.desc)
                                    break;
                    }
                    break;
                  case regexWeakness.test(sampleString):
                    switch(true)
                    {
                      case  regexIndex0.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(weakness.a.desc)
                                    break;
                      case  regexIndex1.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(weakness.b.desc)
                                    break;
                      case  regexIndex2.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(weakness.c.desc)
                                    break;
                      case  regexIndex3.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(weakness.d.desc)
                                    break;
                    }
                    break;

                  case regexChancen.test(sampleString):
                    switch(true)
                    {
                      case  regexIndex0.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(chancen.a.desc)
                                    break;
                      case regexIndex1.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(chancen.b.desc)
                                    break;
                      case  regexIndex2.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(chancen.c.desc)
                                    break;
                      case  regexIndex3.test(sampleString):  
                                    cy.wrap($textArea)
                                    .type(chancen.d.desc)
                                    break;
                    }
                    break;
              }
            }
         }) 
         cy.log("Faktoren eingetragen")

        })
    })
})