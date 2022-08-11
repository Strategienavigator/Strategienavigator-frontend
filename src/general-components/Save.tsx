
const getSaveURL = (saveID: number, toolID: number) => {
    let loc = "";
    switch (toolID) {
        case 1:
            loc += "/utility-analysis/";
            break;
        case 2:
            loc += "/swot-analysis/";
            break;
        case 3:
            loc += "/pairwise-comparison/";
            break;
        case 4:
            loc += "/portfolio-analysis/";
            break;
        case 5:
            loc += "/abc-analysis/";
            break;
        default:
            loc = "/";
            break;
    }

    if (loc !== "/") {
        loc += saveID;
    }
    return loc;
}


export {
    getSaveURL
}