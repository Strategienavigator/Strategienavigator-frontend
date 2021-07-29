import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import Nav from "./components/platform/nav/Nav";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Imprint from "./components/platform/imprint/Imprint";
import DataPrivacy from "./components/platform/data-privacy/DataPrivacy";
import Home from "./components/platform/home/Home";
import Login from "./components/platform/login/Login";
import Logout from "./components/platform/logout/Logout";
import Register from "./components/platform/register/Register";
import Settings from "./components/platform/settings/Settings";
import MyProfile from "./components/platform/my-profile/MyProfile";
import {Session} from "./general-components/Session/Session";
import {Container, Spinner} from "react-bootstrap";
import PairwiseComparison from "./components/tools/pairwise-comparison/PairwiseComparison";
import PairwiseComparisonHome from "./components/tools/pairwise-comparison/PairwiseComparisonHome";
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <div className={"loader dark fullscreen"}>
        <Spinner className={"spinner"} animation={"border"}/>
    </div>,
    document.getElementById('loader')
);

const reload_app = () => {
    ReactDOM.render(
        <React.StrictMode>
            <Router>
                <Nav/>

                <Container fluid={true} id={"content"}>
                    <Switch>
                        <Route path={"/"} exact component={Home}/>
                        <Route path={"/legal-notice"} exact component={Imprint}/>
                        <Route path={"/data-privacy"} exact component={DataPrivacy}/>
                        <Route path={"/login"} exact component={Login}/>
                        <Route path={"/logout"} exact component={Logout}/>
                        <Route path={"/register"} exact component={Register}/>
                        <Route path={"/settings"} exact component={Settings}/>
                        <Route path={"/my-profile"} exact component={MyProfile}/>

                        <Route path={"/pairwise-comparison/new"} exact component={PairwiseComparison}/>
                        <Route path={"/pairwise-comparison"} exact component={PairwiseComparisonHome}/>

                        <Route path={"/"} component={Home}/>
                    </Switch>
                </Container>
            </Router>
        </React.StrictMode>,
        document.getElementById('root')
    );
    ReactDOM.render(
        <div className={"loader loaded fullscreen"}>
            <Spinner className={"spinner"} animation={"border"}/>
        </div>,
        document.getElementById('loader')
    );
}

Session.checkLogin().then(() => {
    reload_app();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);

export {
    reload_app
};