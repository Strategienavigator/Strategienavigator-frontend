import {Tool} from "./Tool/Tool";
import {faThLarge} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "./Datastructures";

class Test extends Tool {

    constructor(props: any) {
        super(props);

        this.setID(1);
        this.setToolname("Testanalyse");
        this.setToolIcon(faThLarge);
        this.setMaintenance(false);
    }

    protected renderToolHome() {
        return null;
    }

    protected renderShortDescription() {
        return "Testkurzbeschreibung";
    }

    protected renderTutorial() {
        return (
            "Dies istn tutorial! So macht man das..."
        );
    }

    protected renderNew() {
        return this.getStepComponent();
    }

    protected renderView(tool: SaveResource) {
        let data = tool.data;
        return this.getStepComponent({
            values: [
                {
                    id: "faktoren",
                    values: data
                }
            ]
        });
    }
}

export {
    Test
}