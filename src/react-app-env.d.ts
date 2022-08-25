/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_NAME: string,
        REACT_APP_API: string,
        REACT_APP_CLIENT_ID: number,
        REACT_APP_CLIENT_SECRET: string,
        REACT_APP_VERSION: string,
        REACT_APP_COLLABORATION_URL: string,
    }
}
