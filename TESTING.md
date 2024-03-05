## Einleitung

Cypress ist eine Anwendung zum testen verschiedener Anwendungsfälle auf einer Webseite und reduziert dabei den
Testaufwand enorm weil diese komplett automatisch abläuft.

Damit Cypress korrekt arbeiten kann müssen wir ersteinmal sicherstellen das Cypress alle nötigen Module von Node hat.

## Module-Dependencys

Modul: "smtp-tester"   - Für Emailserver
Modul: "mysql2"        - Um SQL-Anweisungen zu senden
Modul: "bcrypt"        - Wenn wir user Daten in der DB ändern speziell das Password müssen wir es vorher mit bycrpt
hashen.

```shell
npm install
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

Der Port kann in der cypress.json geändert werden.

# Konfiguration von Cypress

Konfigurationen können in der `.env.test.local` vorgenommen werden. Eine vorlage für die Datei ist in `.env.test.local.example` zu finden.

```
REACT_APP_API=local-url
REACT_APP_CLIENT_ID=client-id
REACT_APP_CLIENT_SECRET=client-secret

CYPRESS_DB_HOST=127.0.0.1
CYPRESS_DB_NAME=strategienavigator
CYPRESS_DB_USER=root
CYPRESS_DB_PASSWORD=""
CYPRESS_DB_PORT=3306

CYPRESS_SMTP_PORT=7777

CYPRESS_TEST_LOGIN_USERNAME=max@test.test
CYPRESS_TEST_LOGIN_PASSWORD=password

CYPRESS_BASE_URL="http://localhost:3000"
```

Wichtig sind hier hier die REACT_APP_CLIENT_ID und REACT_APP_CLIENT_SECRET. Weil diese für jeden Computer unterschiedlich sind
müssen wir hier die Werte von unserer .env.development.local nehmen.

## Erstellen von Testscenarien

Testscenarien werden im /cypress/integration Order abgelgt und können dann , wenn Cypress gestartet wurde, ausgelöst
werden.

Eine detallierte Dokumentation über Cypress finden
sie [hier]((https://docs.cypress.io/guides/overview/why-cypress#What-you-ll-learn).

# Testnutzer

In manchen tests wird ein Testaccount genutzt. Die Logindaten für diesen müssen angegeben werden.
Die Einstellungen dafür finden wir ebenfalls in der .env.test.local:

```
CYPRESS_TEST_LOGIN_USERNAME=max@test.test
CYPRESS_TEST_LOGIN_PASSWORD=password
```

# Nutzung von Testdaten

Testdaten können in der cypress/fictures hinterlegt werden wie das genau funktioniert finden wir in der offizielen
Cypress Dokumentantion [hier]((https://docs.cypress.io/api/commands/fixture)).

# Custom Commands

Wir können in Cypress auch custom commands erstellen. Diese werden in cypress/support/commands.js hinterlegt. Nähere
Informationen [hier]((https://docs.cypress.io/api/cypress-api/custom-commands))




