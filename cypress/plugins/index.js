/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const ms = require('smtp-tester');

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

    // Usage: cy.task('queryDb', query)
   


    if (config.testingType === 'component') {
        require('@cypress/react/plugins/react-scripts')(on, config)
    }else{
        // starts the SMTP server at localhost:7777
        const port = 7777;
        const mailServer = ms.init(port)
        console.log('mail server at port %d', port)

        // process all emails
        mailServer.bind((addr, id, email) => {
            console.log('--- email ---')
            console.log(addr, id, email)
        })

        const options = {
            outputRoot: 'cypress/',
            outputTarget: {
                'logs/txt|txt': 'txt',
                'logs/json|json': 'json',
            },
            printLogsToFile: 'always'
        };
        require('cypress-terminal-report/src/installLogsPrinter')(on, options);


        const mysql = require("mysql");
        function queryTestDb(query, config) {
        // creates a new mysql connection using credentials from cypress.json env's
        const connection = mysql.createConnection(config.env.db);
        // start connection to db
        connection.connect();
        // exec query + disconnect to db as a Promise
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
            if (error) reject(error);
            else {
                connection.end();
                // console.log(results)
                return resolve(results);
            }
            });
        });
        }
        on("task", {
            queryDb: query => {
              return queryTestDb(query, config);
            }
          });
    }

    return require('cypress-local-config')(config);
}

