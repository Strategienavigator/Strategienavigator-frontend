/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_NAME: string,
        REACT_APP_API: string
    }
}