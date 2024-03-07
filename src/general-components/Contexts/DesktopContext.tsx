import {createContext, ReactNode, useContext, useEffect, useState} from "react";


export type IDesktopContext = boolean

export const DesktopContext = createContext<IDesktopContext>(true);

export function useIsDesktop(): IDesktopContext {
    return useContext(DesktopContext);
}

const breakPoint: number = 1200;

function checkIfDesktop(width: number) {

    return width >= breakPoint;

}

export function DesktopContextComponent({children}: { children: ReactNode }) {
    let [isDesktop, setIsDesktop] = useState(checkIfDesktop(window.innerWidth));

    useEffect(() => {
        let reloadedMobile: boolean = false;
        let reloadedDesktop: boolean = false;
        let width: number = window.innerWidth;

        function resizeListener() {
            if (window.innerWidth === width) {
                return;
            }
            width = window.innerWidth;

            if (width >= breakPoint) {
                if (!reloadedDesktop) {
                    setIsDesktop(true);
                    reloadedMobile = false;
                    reloadedDesktop = true;
                }
            } else {
                if (!reloadedMobile) {
                    setIsDesktop(false);
                    reloadedMobile = true;
                    reloadedDesktop = false;
                }
            }
        }

        window.addEventListener('resize', resizeListener);


        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    }, []);


    return (<DesktopContext.Provider value={isDesktop}>
            {children}
        </DesktopContext.Provider>
    )
}
