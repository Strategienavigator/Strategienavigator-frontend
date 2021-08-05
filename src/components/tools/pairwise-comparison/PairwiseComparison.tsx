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

    build(): ReactNode {
        return (
            <div>
                <InputGroup size={"sm"}>
                    <FormControl name={"email"} placeholder={"E-Mail-Adresse"} aria-label="Small"
                                 aria-describedby="inputGroup-sizing-sm"/>
                </InputGroup>
            </div>
        );
    }

    submit(e: FormEvent<HTMLFormElement>): boolean | void {
        return true;
    }

    validate(e: FormEvent<HTMLFormElement>): boolean {
        let {email} = this.extractValues(e);
        return email.length > 0;
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

    build(): ReactNode {
        return (
            <div>
                <InputGroup size={"sm"}>
                    <FormControl name={"email"} placeholder={"E-Mail-Adresse"} aria-label="Small"
                                 aria-describedby="inputGroup-sizing-sm"/>
                </InputGroup>
            </div>
        );
    }

    submit(e: FormEvent<HTMLFormElement>): boolean | void {
        return true;
    }

    validate(e: FormEvent<HTMLFormElement>): boolean {
        let {email} = this.extractValues(e);
        return email.length > 0;
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