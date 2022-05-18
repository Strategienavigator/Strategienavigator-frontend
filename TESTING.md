## Einleitung
Cypress ist eine Anwendung zum testen verschiedener Anwendungsfälle auf einer Webseite und reduziert dabei den
Testaufwand enorm weil diese komplett automatisch abläuft.

Damit Cypress korrekt arbeiten kann müssen wir ersteinmal sicherstellen das Cypress alle nötigen Module von Node hat.

## Module-Dependencys
Module: "smtp-tester"
Beschreibung: 
Wird benötigt damit Cypress einen smtp-server für seine Testumgebung erstellt.
```shell
npm i smtp-tester
```

## Start von Cypress
Um Cypress nutzen zu könnnen müssen wir das Frontend gestartet haben.

```shell
npm start
```

Und mit einer zweiten Konsole starten wir im Verzeichnis des Frontend.

```shell
npm run cypress
```

Wenn alles geklappt hat sollte die Konsole als letztes folgendes anzeigen.

```
mail server at port 7777
```
Der Port kann in der /cypress/plugins/index.js hier geändert werden.

```
// starts the SMTP server at localhost:7777
    const port = 7777;
    const mailServer = ms.init(port)
     console.log('mail server at port %d', port)
```

## Erstellen von Testscenarien
Testscenarien werden im /cypress/integration Order abgelgt und können dann , wenn Cypress gestartet wurde, ausgelöst werden.

Eine detallierte Dokumentation über Cypress finden sie [hier]((https://docs.cypress.io/guides/overview/why-cypress#What-you-ll-learn).


