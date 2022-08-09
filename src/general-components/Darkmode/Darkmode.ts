import {SettingsList} from "../Settings/SettingsList";
import {Session} from "../Session/Session";


export const DarkModeChanger = (oldSettings: SettingsList, newSettings: SettingsList) => {
    let setting = newSettings.getSettingByName("Dark Mode");

    document.body.className = "";
    document.body.classList.add("smooth-transition");
    if (setting.value && setting.value === "true") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.add("light");
    }
    localStorage.setItem("darkmode", setting.value);

    setTimeout(() => {
        document.body.classList.remove("smooth-transition");
    }, 500);
}

/**
 * Schaut, sobald der DOM fertiggeladen ist nach, ob der Darkmode in der LocalStorage vorhanden ist oder nicht.
 * Ist dies der Fall wird der Darkmode initialisiert.
 *
 * Dient zum flüssigen Übergang.
 */
// TODO: einbauen dass dies nicht umgangen werden kann (weil Darkmode nur für angemeldete Benutzer)
window.addEventListener('load', function () {
    let darkmode = localStorage.getItem("darkmode");
    if (darkmode && darkmode === "true") {
        document.body.className = "dark";
    }
});

// DEV help
// TODO: maybe remove later
window.addEventListener("keydown", (event) => {
    if (Session.isLoggedIn() && event.keyCode === 119 /* F8 */) {
        if (document.body.classList.contains("dark")) {
            document.body.className = "light";
        } else {
            document.body.className = "dark";
        }
    }
});