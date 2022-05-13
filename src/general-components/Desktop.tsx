import {reload_app} from "../index";


let breakPoint: number = 1200;
let width: number = window.innerWidth;
let reloadedMobile: boolean = false;
let reloadedDesktop: boolean = false;

window.addEventListener('resize', () => {
    width = window.innerWidth;

    if (width >= breakPoint) {
        if (!reloadedDesktop) {
            reload_app();
            reloadedDesktop = true;
            reloadedMobile = false;
        }
    } else {
        if (!reloadedMobile) {
            reload_app();
            reloadedMobile = true;
            reloadedDesktop = false;
        }
    }
});

const isDesktop = (): boolean => {
    return (width >= breakPoint);
};

export {
    isDesktop
}