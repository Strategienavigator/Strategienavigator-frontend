import {isDesktop} from "../../../../../general-components/Desktop";
import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";

import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {showErrorPage} from "../../../../../index";
import {IUIErrorContext} from "../../../../../general-components/Contexts/UIErrorContext/UIErrorContext";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {Col, Row} from "react-bootstrap";

export interface UploadImgValues {

    factors: {
        name: string
        vorname: string
        alter: string
        profibild: string
        profibildName: string
    },
    
}

interface UploadImgsState {

}

export interface UploadImgInfoValues {
    actions:UploadImgValues[]
    result:any
}

export class UpdateImgActionsValuesComponent extends Step<PersonaAnalysisValues, UploadImgsState> {

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

        this.props.saveController.onChanged(save => {
            const data = save.data["uploadImage_actions"];
            if (data !== undefined) {

            }else{
                save.data["uploadImage_actions"] = {
                    factors:{
                        name: '123',
                        vorname: vorname,
                        alter: alter,
                        profibildName: imgSrc,
                        profibild: ''
                    }
                }
            }
       })
        
    }

     handleFileChange = async (e:any)=> {
       
        const file = e.currentTarget.files[0];
          return  new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
              });
    }
  

    build(): JSX.Element {

        let values = this.props.save.data["uploadImage_actions"]?.factors;
        if (values !== undefined) {
            return (
            
                <div className={"uploadImage_actions"} >
                    <Row className={"mb-3 mt-3"}> 
                         <Col sm={isDesktop() ? 6 : 12}>
                            <div>
                               profibild:<br/> <input type='file' disabled={this.props.disabled} className="form-control" name="profibild" onChange={this.applyProfibildInfoChanges1.bind(this)}/>
                                <br/>
                               vorname: <input type='text' disabled={this.props.disabled} value={values.vorname} className="form-control" name = 'vorname' onChange={this.applyProfibildInfoChanges1.bind(this)} />
                               <UIErrorBanner id={"uploadImage_actions.vornameError"}/>
                               name: <input type='text' disabled={this.props.disabled}   value={values.name} className="form-control" name = 'name' onChange={this.applyProfibildInfoChanges1.bind(this)} />
                               <UIErrorBanner id={"uploadImage_actions.nameError"}/>
                               alter: <input type='text' disabled={this.props.disabled}  value={values.alter} className="form-control" name = 'alter' onChange={this.applyProfibildInfoChanges1.bind(this)} />  
                               <UIErrorBanner id={"uploadImage_actions.alterError"}/>        
                            </div>
                        </Col>
                     </Row>
                </div>
            );
        }

        //This is a 404 error
        showErrorPage(404);
        return <p>"ERROR"</p>;
    }

     async applyProfibildInfoChanges1(e:any){
        let value:string = e.target.value;
        let name =  e.target.name;
        if(name === "profibild"){
            const data  = await this.handleFileChange(e) 
           value = data as string
        }
       
      
        this.props.saveController.onChanged(save => {
            const data = save.data["uploadImage_actions"];
            
            if (data !== undefined && data.factors !== undefined) {
                switch(name){
                    case "name":
                        data.factors.name = value;
                        break;
                    case "vorname":
                        data.factors.vorname =value;
                        break;
                    case "alter":
                        data.factors.alter = value;
                        break;
                    case "profibild":
                        data.factors.profibild = value;
                        break;
        
                }
            }
        })
    }
}
