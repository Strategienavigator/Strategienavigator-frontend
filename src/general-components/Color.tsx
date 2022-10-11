/**
 * Wandelt ein Array aus Farben zu einer einzelnen gemixten Farbe um
 * @param {string[]} colors
 */
const getMixOfColors = (colors: string[]): string => {
    let rgbRegex = /rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/;
    if (!colors.some((color) => {
        let match = rgbRegex.exec(color);
        return match !== null;
    })) {
        throw new Error("Given colors are not rgb values!");
    }

    let matches = colors.map(c => rgbRegex.exec(c)).filter(c => c !== null).map(c => c!.slice(1, 4).map(c => parseInt(c)));
    let r = matches.reduce((a, b) => a + b[0], 0) / matches.length;
    let g = matches.reduce((a, b) => a + b[1], 0) / matches.length;
    let b = matches.reduce((a, b) => a + b[2], 0) / matches.length;

    return `rgb(${r}, ${g}, ${b})`;
}

export {
    getMixOfColors
}