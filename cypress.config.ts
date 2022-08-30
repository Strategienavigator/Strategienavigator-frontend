import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  defaultCommandTimeout: 10000,
  env: {
    DB_HOST: '127.0.0.1',
    DB_USER: 'root',
    DB_PASSWORD: '',
    DB_PORT: 3306,
    SMTP_PORT: 7777,
    BACKEND_URL: 'http://localhost/toolbox-backend/public/',
    APP_CLIENT_ID: 2,
    APP_CLIENT_SECRET: 'ytr2ITFQRMCvez8CVFnK9oEzy5QvZb7vAz49eYaO',
    TEST_LOGIN_USERNAME: 'max@test.test',
    TEST_LOGIN_PASSWORD: 'password',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
    experimentalSessionAndOrigin: true,
  },
  component: {
    setupNodeEvents(on, config) {},
    specPattern: 'src/**/*spec.tsx',
  },
})