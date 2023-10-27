import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TestAnalysisValues} from "../../TestAnalysis";
import {Form, Image} from "react-bootstrap";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {ChangeEvent} from "react";

export interface TestResourcesValues {

}

interface TestResourcesComponentState {
    jsonData: string
}

class TestResourcesComponent extends Step<TestAnalysisValues, TestResourcesComponentState> {

    public constructor(props: StepProp<TestAnalysisValues> | Readonly<StepProp<TestAnalysisValues>>) {
        super(props);
        this.state = {
            jsonData: ""
        }
    }

    componentDidMount = async () => {
        let text = await this.props.resourceManager.getText("json");
        if (text !== null) {
            this.setState({
                jsonData: text
            });
        }
    }

    protected build(): JSX.Element {
        let excelURL = this.props.resourceManager.getBlobURL("excel");
        let pictureURL = this.props.resourceManager.getBlobURL("picture");

        return (
            <>
                {/*Bild*/}
                <Form.Group className="mb-3">
                    <Form.Label>Bild</Form.Label>
                    <Form.Control
                        disabled={this.props.disabled}
                        type="file"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => this.fileChanged(e, "picture")}
                    />
                    <Form.Text>Gültige Dateitypen: .png, .jpg, .jpeg
                    </Form.Text> <br/>
                    <Form.Text>Maximalgröße: 2MB</Form.Text>

                    <UIErrorBanner id={"picture.size"}/>
                    <UIErrorBanner id={"picture.type"}/>

                    <div className={"preview mt-2"}>
                        <Image
                            src={pictureURL ?? undefined}
                            thumbnail rounded alt={"Bildvorschau"}/>
                    </div>
                </Form.Group>

                {/*Excel*/}
                <Form.Group className="mb-3">
                    <Form.Label>Excel</Form.Label>
                    <Form.Control
                        disabled={this.props.disabled}
                        type="file"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => this.fileChanged(e, "excel")}
                    />
                    <Form.Text>Gültige Dateitypen: .csv, .xlsx
                    </Form.Text> <br/>
                    <Form.Text>Maximalgröße: 2MB</Form.Text>

                    <UIErrorBanner id={"excel.size"}/>
                    <UIErrorBanner id={"excel.type"}/>

                    <div className={"preview mt-2"}>
                        {excelURL && (
                            <a
                                href={excelURL}
                            >
                                Vorschaudatei
                            </a>
                        )}
                    </div>
                </Form.Group>

                {/*JSON*/}
                <Form.Group className="mb-3">
                    <Form.Label>JSON</Form.Label>
                    <Form.Control
                        disabled={this.props.disabled}
                        type="file"
                        onChange={this.jsonChanged}
                    />
                    <Form.Text>Gültige Dateitypen: .json
                    </Form.Text> <br/>
                    <Form.Text>Maximalgröße: 1MB</Form.Text>

                    <UIErrorBanner id={"json.size"}/>
                    <UIErrorBanner id={"json.type"}/>

                    <div className={"preview mt-2"}>
                        <pre lang={"json"}>
                            {this.state.jsonData}
                        </pre>
                    </div>
                </Form.Group>
            </>
        );
    }

    private fileChanged = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        let file: File | null = null;
        if (e.target.files !== null) {
            file = e.target.files.item(0);
            if (file) {
                this.props.resourceManager.onChanged(id, file);
                this.forceUpdate();
            }
        }
    }

    private jsonChanged = async (e: ChangeEvent<HTMLInputElement>) => {
        let file: File | null = null;
        if (e.target.files !== null) {
            file = e.target.files.item(0);
            if (file) {
                this.props.resourceManager.onChanged("json", file);
                let data = await file.text();
                this.setState({
                    jsonData: data
                });
            }
        }
    }

}

export {
    TestResourcesComponent
}