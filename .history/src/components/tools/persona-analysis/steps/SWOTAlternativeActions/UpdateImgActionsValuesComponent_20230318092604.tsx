
import React from "react";
import {isDesktop} from "../../../../../general-components/Desktop";
import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Accordion} from "react-bootstrap";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {showErrorPage} from "../../../../../index";
import {IUIErrorContext} from "../../../../../general-components/Contexts/UIErrorContext/UIErrorContext";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import { AvatarUploadField } from "../../../../../general-components/AvatarUploadField/AvatarUploadField";
import {Col, Form, ProgressBar, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
export interface UploadImgValues {

    factors: {
        name: String
        vorname: String
        alter: String
        profibild: String
    },
    
}

interface UploadImgsState {

}

export interface UploadImgInfoValues {
    actions:UploadImgValues[]
}

export class UpdateImgActionsValues extends Step<PersonaAnalysisValues, UploadImgsState> {

    private nameChanged = this.applyProfibildInfoChanges.bind(this, "name");
    private vornameChanged = this.applyProfibildInfoChanges.bind(this, "vorname");
    private alterChanged=this.applyProfibildInfoChanges.bind(this, "alter");
    private imgChanged=this.applyProfibildInfoChanges.bind(this, "profibild");



    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PersonaAnalysisValues>>, nextState: Readonly<UploadImgsState>, nextContext: IUIErrorContext): boolean {
        let shouldUpdate: boolean;
        shouldUpdate = !shallowCompareStepProps(this.props, nextProps);
        if (!shouldUpdate) {
            const oldSave = this.props.save;
            const newSave = nextProps.save;
            if (oldSave.data["uploadImage_actions"] !== newSave.data["uploadImage_actions"]) {
                shouldUpdate = true;
            }
        }
        return shouldUpdate;
    }
    getValues(name:any,vorname:any,alter:any,imgSrc:any){
        // this.alterChanged(alter);
        // this.nameChanged(name)
        // this.vornameChanged(vorname)
        // this.imgChanged(imgSrc)
        this.props.saveController.onChanged(save => {
            const data = save.data["uploadImage_actions"];
            if (data !== undefined) {

            }else{
                save.data["uploadImage_actions"] = {
                    factors:{
                        name: name,
                        vorname: vorname,
                        alter: alter,
                        profibild: imgSrc
                    }
                }
            }
       })
        
    }

    test(){
        var that = this;
       this.props.saveController.onChanged(save => {
            const data = save.data["uploadImage_actions"];
            if (data !== undefined) {
            }else{
                save.data["uploadImage_actions"] = {
                    factors:{
                        name: '1',
                        vorname: 'ds',
                        alter: 'ds',
                        profibild: 'dsd',
                    }
                }
            }
       })
    }

    test1(){
        var that = this;
       this.props.saveController.onChanged(save => {
            const data = save.data["uploadImage_actions"];
            if (data !== undefined) {
            }else{
                save.data["uploadImage_actions"] = {
                    factors:{
                        name: '1',
                        vorname: 'ds',
                        alter: 'ds',
                        profibild: 'dsd',
                    }
                }
            }
       })
        console.log('saveT',this.props.save)
    }
  

    build(): JSX.Element {

        let activeKey = "view";
        let values = this.props.save.data["uploadImage_actions"]?.factors;
        console.log('save',this.props.save)
        if (values !== undefined) {
            return (
            
                <div className={"uploadImage_actions"} >
                    <Row className={"mb-3 mt-3"}>
                         <Col sm={isDesktop() ? 6 : 12}>
                            <div>
                           
                               <button onClick={this.test1}>临时按钮</button>
                                        
                               {/* <AvatarUploadField getValues={this.getValues.bind(this)}/> */}
                               
                            </div>
                        </Col>
                     </Row>
                    <UIErrorBanner id={"uploadImage_actions"} />
                </div>
               
             
            );
        }

        //这是404报错
        showErrorPage(404);
        return <p>"ERROR"</p>;


    }



    private updateAlternative(index: number, fn: (action: UploadImgValues) => UploadImgValues) {

        this.props.saveController.onChanged(save => {
            const actionsData = save.data["uploadImage_actions"];

            if (actionsData !== undefined) {

            }
        });
    }


    private applyProfibildInfoChanges(type: String , values: any) {
        
        this.props.saveController.onChanged(save => {
            const data = save.data["uploadImage_actions"];
            
            if (data !== undefined) {
              
                switch (type) {
                    case "name":
                        data.factors.name = values;
                        break;
                    case "vorname":
                        data.factors.vorname = values;
                        break;
                    case "alter":
                        data.factors.alter = values;
                        break;
                    case "profibild":
                         data.factors.profibild = values;
                        break;
                    
                }
            }
        });
    }

}
