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
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <div>
        <Spinner animation={"border"} /> Lädt...
    </div>,
    document.getElementById('root')
);

const reload_app = () => {
    ReactDOM.render(
        <React.StrictMode>
            <Router>
                <Nav/>

                <Container fluid={true} id={"content"}>
                    <Switch>
                        <Route path={"/"} exact component={Home}/>
                        <Route path={"/legal-notice"} component={Imprint}/>
                        <Route path={"/data-privacy"} component={DataPrivacy}/>
                        <Route path={"/login"} component={Login}/>
                        <Route path={"/logout"} component={Logout}/>
                        <Route path={"/register"} component={Register}/>
                        <Route path={"/settings"} component={Settings}/>
                        <Route path={"/my-profile"} component={MyProfile}/>

                        <Route path={"/"} component={Home}/>
                    </Switch>
                </Container>
            </Router>
        </React.StrictMode>,
        document.getElementById('root')
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