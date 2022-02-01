import React, {Component, ComponentClass, ReactNode, RefObject} from "react";
import {matchPath, RouteComponentProps, StaticContext, withRouter} from "react-router";
import {Route, Switch} from "react-router-dom";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {ToolHome, ToolHomeInfo} from "./Home/ToolHome";
import {Card} from "react-bootstrap";
import {CreateToolModal} from "./CreateToolModal/CreateToolModal";
import "./tool.scss";
import {Exporter} from "../Export/Exporter";
import {SaveResource} from "../Datastructures";
import {createSave} from "../API/calls/Saves";
import {ToolSavePage, ToolSaveProps} from "./ToolSavePage/ToolSavePage";

interface ToolState {
    showInputModal: boolean
    isCreatingNewSave: boolean
}

abstract class Tool<D> extends Component<RouteComponentProps<{}>, ToolState> {
    // TOOL META DATA
    private readonly homePath;
    private readonly newPath;
    private readonly viewPath;

    // TOOL INFO
    private toolName: string;
    private toolIcon: IconDefinition;
    private toolID: number;
    private readonly toolLink: string;
    private maintenance = false;

    // TOOL HOME
    private toolHomeRef: RefObject<ToolHome>

    // Export
    private exporters: Exporter<object>[];


    constructor(props: RouteComponentProps<{}>, context: any, toolName: string, toolIcon: IconDefinition, toolID: number) {
        super(props, context);
        this.toolName = toolName;
        this.toolIcon = toolIcon;
        this.toolID = toolID;

        this.state = {
            showInputModal: true,
            isCreatingNewSave: false,
        }
        this.toolLink = this.props.match.path;

        // setup route paths
        this.homePath = this.getLink();
        this.newPath = this.getLink() + "/new";
        this.viewPath = this.getLink() + "/:id";
        this.exporters = [];

        this.toolHomeRef = React.createRef();
    }

    public getLink(): string {
        return this.toolLink;
    }

    public getToolName = (): string => {
        return this.toolName;
    }

    public getToolIcon = (): IconDefinition => {
        return this.toolIcon;
    }

    public getID = (): number => {
        return this.toolID;
    }

    public getExporters = (): Exporter<object>[] => {
        return this.exporters;
    }

    public setMaintenance(maintenance: boolean) {
        this.maintenance = maintenance;
    }

    public hasTutorial = (): boolean => {
        let tutorial = this.renderTutorial();
        return (tutorial !== null && tutorial !== undefined);
    }


    public render = () => {
        if (this.maintenance) {
            return (
                <Card body>
                    Diese Analyse befindet sich im Wartungsmodus. Bitte Schauen Sie zu einem späteren Zeitpunkt erneut
                    vorbei.
                </Card>
            );
        }

        return (
            <>
                <Switch>
                    <Route exact path={this.homePath}>
                        {this.getRenderedToolHome()}
                    </Route>

                    <Route exact path={this.newPath}>
                        <CreateToolModal onSaveCreated={this.createNewSave}
                                         onCancel={() => {
                                             this.props.history.push(this.getLink()
                                             );
                                         }}
                                         isCreatingNewSave={this.state.isCreatingNewSave}/>
                    </Route>

                    <Route
                        exact
                        render={(routeProps) => {
                            return <ToolSavePage tool={this} history={routeProps.history} location={routeProps.location}
                                                 match={routeProps.match} element={this.getSaveViewBuilder.bind(this)}/>
                        }}
                        path={this.viewPath}/>
                </Switch>
            </>
        );
    }

    public switchPage(page: string) {
        this.props.history.push(this.getLink() + "/" + page);
    }

    protected setID = (toolID: number) => {
        this.toolID = toolID;
    }

    private createNewSave = async (name: string, description: string) => {
        this.setState({
            isCreatingNewSave: true
        });

        let data = new FormData();

        data.set("name", name);
        data.set("description", description);
        data.set("tool_id", this.getID().toString());
        let saved = await createSave(data);
        if (saved) {

            this.setState({
                isCreatingNewSave: false
            });
            this.props.history.push(this.getLink() + "/" + saved.callData.data.id);
        }
    }

    protected abstract renderShortDescription(): ReactNode;


    protected abstract getSaveViewBuilder(saveProps: ToolSaveProps<D>): JSX.Element

    protected abstract renderTutorial(): ReactNode;

    protected setToolname = (toolName: string) => {
        this.toolName = toolName;
    }

    protected setToolIcon = (toolIcon: IconDefinition) => {
        this.toolIcon = toolIcon;
    }

    /**
     * Fügt den übergebenen Exporter hinzu.
     *
     * Es darf kein exporter doppelt existieren und keine zwei Exporter mit dem selben Namen existieren
     * @param exporter Eine Exporter Instanz
     * @protected
     */
    protected addExporter(exporter: Exporter<object>) {
        if (!this.exporters.some(e => e === exporter || e.getName() === exporter.getName())) {
            this.exporters.push(exporter);
        } else {
            throw new Error("Already added Export with this name");
        }
    }

    private getRenderedToolHome = () => {

        let home = <ToolHome tool={this}/>;

        let info: ToolHomeInfo = {
            shortDescription: this.renderShortDescription(),
            tutorial: this.renderTutorial()
        }

        return React.cloneElement(home, {
            ref: this.toolHomeRef,
            info: Object.assign(info, home.props.info),
            tool: this
        });
    }
}

withRouter<RouteComponentProps<{}>, any>(Tool);

export {
    Tool
}
