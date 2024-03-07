import {createContext, ReactNode, useContext, useEffect, useState} from "react";

/**
 * True, falls das aktuelle Gerät ein Desktop ist.
 */
export type IDesktopContext = boolean

/**
 * Der Context, welcher die Information enthält, ob das aktuelle Gerät ein Desktop ist.
 */
export const DesktopContext = createContext<IDesktopContext>(true);

/**
 * Hook, welche zurückgibt, ob das aktuelle Gerät ein Desktop ist.
 */
export function useIsDesktop(): IDesktopContext {
    return useContext(DesktopContext);
}

/**
 * Die Bildschirmbreite, ab dem das aktuelle Gerät als Desktop zählt.
 */
export const breakPoint: number = 1200;

/**
 * Prüft, ob die gegebene Bildschirmbreite als Desktop Gerät interpretiert wird.
 *
 * ACHTUNG: Das ist keine React Hook, aktualisiert das aufrufende Component nicht bei Änderungen.
 * @param width optionales argument. Breite in Pixeln. Wenn sie fehlt oder negativ ist, wird die Breite des aktuellen Bildschirms verwendet.
 */
export function checkIfDesktop(width: number = -1) {
    if (width < 0) {
        return window.innerWidth >= breakPoint;
    }
    return width >= breakPoint;
}

/**
 * Das Component welches den Context Provider enthält und die diesen aktuell hält (auch während Window resizes).
 * @param children alle kinder Elemente.
 * @constructor
 */
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
    }, [setIsDesktop]);


    return (
        <DesktopContext.Provider value={isDesktop}>
            {children}
        </DesktopContext.Provider>
    )
}
