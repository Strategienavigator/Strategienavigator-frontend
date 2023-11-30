import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import Nav from "./components/platform/nav/Nav";
import {BrowserRouter as Router, matchPath, Switch} from "react-router-dom";
import {ProtectedRoute as Route} from "./general-components/ProtectedRoute";


import {Imprint} from "./components/platform/imprint/Imprint";
import {DataPrivacy} from "./components/platform/data-privacy/DataPrivacy";
import {Home} from "./components/platform/home/Home";
import {Login} from "./components/platform/login/Login";
import {Logout} from "./components/platform/logout/Logout";
import Register from "./components/platform/register/Register";
import {Settings} from "./components/platform/settings/Settings";
import {MyProfile} from "./components/platform/my-profile/MyProfile";
import {Session} from "./general-components/Session/Session";
import {Container} from "react-bootstrap";
import {Loader} from "./general-components/Loader/Loader";
import {Messages} from "./general-components/Messages/Messages";
import Footer from "./components/platform/footer/Footer";
import {AboutUs} from "./components/platform/abous-us/AboutUs";
import {ControlFooter} from "./general-components/ControlFooter/ControlFooter";
import {EmailVerification} from "./components/platform/verifications/EMail/EmailVerification";
import {PasswordReset} from "./components/platform/verifications/PasswordReset/PasswordReset";
import {SWOTAnalysis} from "./components/tools/swot-analysis/SWOTAnalysis";
import {PairwiseComparison} from "./components/tools/pairwise-comparison/PairwiseComparison";
import {PortfolioAnalysis} from "./components/tools/portfolio-analysis/PortfolioAnalysis";
import {UtilityAnalysis} from "./components/tools/utility-analysis/UtilityAnalysis";
import {ErrorPages} from "./general-components/Error/ErrorPages/ErrorPages";
import {GlobalContexts} from "./general-components/Contexts/GlobalContexts";
import {InvitationDecision} from "./components/platform/sharing/Invitation/InvitationDecision";
import {ContributionDecision} from "./components/platform/sharing/Contribution/ContributionDecision";
import {SettingsContextComponent} from "./general-components/Contexts/SettingsContextComponent";
import {DarkModeChanger} from "./general-components/Darkmode/Darkmode";
import {enablePatches} from "immer";
import {PersonaAnalysis} from "./components/tools/persona-analysis/PersonaAnalysis";
import * as process from "process";
import {TestAnalysis} from "./components/tools/test-analysis/TestAnalysis";

require("./setupEcho.ts");
// Add SettingsChangeListener for Darkmode
SettingsContextComponent.addSettingsChangeListener(DarkModeChanger);

/**
 *
 * APP
 *
 */
const routerRef = React.createRef<Router>();

const getRouterSwitch = () => {
    return (
        <Switch>
            <Route path={"/"} exact component={Home}/>
            <Route path={"/legal-notice"} exact component={Imprint}/>
            <Route path={"/data-privacy"} exact component={DataPrivacy}/>
            <Route path={"/about-us"} exact component={AboutUs}/>
            <Route loggedIn={false} path={"/login"} exact component={Login}/>
            <Route loggedIn={true} path={"/logout"} exact component={Logout}/>
            <Route loggedIn={false} path={"/register"} exact component={Register}/>
            <Route loggedIn={true} path={"/settings"} exact component={Settings}/>
            <Route loggedIn={true} anonymous={false} path={"/my-profile"} exact component={MyProfile}/>

            <Route loggedIn={true} path={"/invite/:sharedSaveID"} component={ContributionDecision}/>
            <Route loggedIn={true} path={"/invitation/:token"} component={InvitationDecision}/>

            <Route path={"/verify-email/:token"} component={EmailVerification}/>
            <Route path={"/reset-password/:token"} component={PasswordReset}/>
            <Route path={"/reset-password"} exact component={PasswordReset}/>

            <Route loginAnonymous={true} loggedIn={true} path={"/pairwise-comparison"} component={PairwiseComparison}/>
            <Route loginAnonymous={true} loggedIn={true} path={"/swot-analysis"} component={SWOTAnalysis}/>
            <Route loginAnonymous={true} loggedIn={true} path={"/persona-analysis"} component={PersonaAnalysis}/>
            <Route loginAnonymous={true} loggedIn={true} path={"/portfolio-analysis"} component={PortfolioAnalysis}/>
            <Route loginAnonymous={true} loggedIn={true} path={"/utility-analysis"} component={UtilityAnalysis}/>

            {/* DEV  */(process.env.NODE_ENV === "development") && (
                <Route loginAnonymous={true} loggedIn={true} path={"/test-analysis"} component={TestAnalysis}/>
            )}

            <Route path={"/error/:code"} component={ErrorPages}/>

            <Route render={(props) => {
                let match = Object.assign(
                    props.match, {
                        params: {
                            code: String(404)
                        }
                    }
                );
                return <ErrorPages
                    history={props.history}
                    location={props.location}
                    match={match}
                />;
            }}/>
        </Switch>
    );
}

const getAppFooter = () => {
    return (
        <>
            <Footer/>
            <ControlFooter places={4}/>
        </>
    );
}

const getAppContent = () => {
    return (
        <>
            <GlobalContexts key={"global-contexts"}>
                <Loader key={"loader"} animate fullscreen loaded={true} variant={"style"} payload={[]}>
                    <Router ref={routerRef}>

                        <Nav/>

                        <div id={"content"}>
                            <Container fluid={false}>
                                {getRouterSwitch()}
                            </Container>
                        </div>

                        {getAppFooter()}
                    </Router>
                </Loader>
            </GlobalContexts>
        </>
    );
}

const renderApp = () => {
    ReactDOM.render(
        <React.StrictMode>
            {getAppContent()}
        </React.StrictMode>,
        document.getElementById('root')
    );
    ReactDOM.render(
        <React.StrictMode>
            <Messages
                xAlignment={"CENTER"}
                yAlignment={"BOTTOM"}
                style={{marginBottom: 65}}
            />
        </React.StrictMode>,
        document.getElementById("messages")
    );
}

/**
 *
 * ERROR
 *
 */
const showErrorPage = (code: number, callback?: (...args: any) => any) => {
    renderApp();

    if (!matchPath(document.location.pathname, {
        exact: true,
        path: "/error/:id"
    })) {
        (routerRef.current as any).history.push("/error/" + code);
    }

    if (callback) {
        callback(callback?.arguments);
    }
}

/**
 *
 * LOADING
 *
 */
const manageLoading = async () => {
    ReactDOM.render(
        <React.StrictMode>
            <GlobalContexts key={"global-contexts"}>
                <Loader key={"loader"} animate fullscreen loaded={false} variant={"style"} payload={[]}/>
            </GlobalContexts>
        </React.StrictMode>,
        document.getElementById('root')
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
    reload_app,
    showErrorPage
};
