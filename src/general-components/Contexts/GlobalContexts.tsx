import {Component, ReactNode} from "react";
import {SettingsContextComponent} from "./SettingsContextComponent";
import {FooterContextComponent} from "./FooterContextComponent";
import {UserContextComponent} from "./UserContextComponent";
import {DesktopContextComponent} from "./DesktopContext";


export function GlobalContexts({children}: { children: ReactNode }) {
    return (
        <DesktopContextComponent>
            <UserContextComponent>
                <SettingsContextComponent>
                    <FooterContextComponent>

                        {children}

                    </FooterContextComponent>
                </SettingsContextComponent>
            </UserContextComponent>
        </DesktopContextComponent>

    );
}
