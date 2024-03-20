import React, {useEffect} from "react";
import {Loader} from "../../../general-components/Loader/Loader";

import "./logout.scss";
import {useUserContext} from "../../../general-components/Contexts/UserContextComponent";
import {useHistory} from "react-router";


export function Logout() {

    const {isLoggedIn} = useUserContext();
    const history = useHistory()
    useEffect(() => {
        if (!isLoggedIn) {
            history.push("/");
        }
    }, [isLoggedIn, history]);

    return (
        <Loader loaded={false} transparent size={120}/>
    );
}
