import "./pairwise-comparison.scss";
import StepComponent, {SingleStep} from "../../../general-components/StepComponent/StepComponent";
import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons/faSortAmountDownAlt";
import Form from "../../../general-components/Form/Form";
import {FormEvent, ReactNode} from "react";
import {FormControl, InputGroup} from "react-bootstrap";
import {extractFromForm} from "../../../general-components/FormHelper";
import {Messages} from "../../../general-components/Messages/Messages";

interface PCCriteriasValues {
    email: string
}

export class PCCriterias extends Form<PCCriteriasValues> {

    buildValues(): void {
    }

    build(): ReactNode {
        return (
            <div>
                <InputGroup size={"sm"}>
                    <FormControl name={"email"} defaultValue={this.values?.email} placeholder={"E-Mail-Adresse"}
                                 aria-label="Small"
                                 aria-describedby="inputGroup-sizing-sm"/>
                </InputGroup>
            </div>
        );
    }

    submit(values: PCCriteriasValues): boolean | void {
        return true;
    }

    validate(values: PCCriteriasValues): boolean {
        return values.email.length > 0;
    }

    extractValues(e: FormEvent<HTMLFormElement>): PCCriteriasValues {
        let email: string = extractFromForm(e, "email") as string;

        return {
            email: email
        };
    }

}

interface PCPairComparisonValues {
    email: string
}

export class PCPairComparison extends Form<PCPairComparisonValues> {

    buildValues(): void {
    }

    build(): ReactNode {
        let criterias: PCCriteriasValues | undefined = this.getCompletedStep(PCCriterias)?.getValues();

        return (
            <div>
                <InputGroup size={"sm"}>
                    <FormControl name={"email"} defaultValue={criterias?.email} placeholder={"E-Mail-Adresse"}
                                 aria-label="Small"
                                 aria-describedby="inputGroup-sizing-sm"/>
                </InputGroup>
            </div>
        );
    }

    submit(values: PCCriteriasValues): boolean | void {
        return true;
    }

    validate(values: PCCriteriasValues): boolean {
        return values.email.length > 0;
    }

    extractValues(e: FormEvent<HTMLFormElement>): PCCriteriasValues {
        let email: string = extractFromForm(e, "email") as string;

        return {
            email: email
        };
    }

}

class PairwiseComparison extends StepComponent<any, any> {

    constructor(props: any) {
        super(
            props,
            "Paarweiser Vergleich",
            {
                icon: faSortAmountDownAlt,
                link: "/pairwise-comparison",
                title: "Start PV"
            }
        );

        this.addStep(new PCCriterias(this, "pc-criterias"), "Kritierien festlegen");
        this.addStep(new PCPairComparison(this, "pair-comparison"), "Paarvergleich");
    }

    render() {
        return (
            <div className={"container"}>
                {super.render()}
            </div>
        );
    }

    save(steps: Array<SingleStep>): any {
        Messages.add("Tool abgespeichert!", "SUCCESS", Messages.TIMER);
    }

}

export default PairwiseComparison;