import React from 'react';

import './index.scss';
import {Session} from "./general-components/Session/Session";
import {Loader} from "./general-components/Loader/Loader";
import {GlobalContexts} from "./general-components/Contexts/GlobalContexts";
import {enablePatches} from "immer";
import {createRoot} from "react-dom/client";
import {App} from "./general-components/App";


const renderApp = () => {

    appRoot.render(
        <React.StrictMode>
            <App></App>
        </React.StrictMode>
    );
}

/**
 *
 * LOADING
 *
 */
const manageLoading = async () => {
    appRoot.render(
        <React.StrictMode>
            <GlobalContexts key={"global-contexts"}>
                <Loader key={"loader"} animate fullscreen loaded={false} variant={"style"} payload={[]}/>
            </GlobalContexts>
        </React.StrictMode>
    );
    await Session.checkLogin();
}

/**
 *
 * BUILD THE APP
 *
 */
const buildApp = async () => {
    await manageLoading();

    renderApp();
}

const appContainer = document.getElementById("root")
const appRoot = createRoot(appContainer!);
buildApp().then(() => {
    enablePatches();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);

const reload_app = () => {
    renderApp();
}

export {
    reload_app
};
