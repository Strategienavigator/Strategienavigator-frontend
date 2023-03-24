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
        profibild: any
    },
    
}

interface UploadImgsState {

}

export interface UploadImgInfoValues {
    actions:UploadImgValues[]
    result:any
}

export class UpdateImgActionsValuesComponent extends Step<PersonaAnalysisValues, UploadImgsState> {

    // private nameChanged = this.applyProfibildInfoChanges.bind(this, "name");
    // private vornameChanged = this.applyProfibildInfoChanges.bind(this, "vorname");
    // private alterChanged=this.applyProfibildInfoChanges.bind(this, "alter");
    // private imgChanged=this.applyProfibildInfoChanges.bind(this, "profibild");



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
                        name: '123',
                        vorname: vorname,
                        alter: alter,
                        profibild: imgSrc
                    }
                }
            }
       })
        
    }


     handleFileChange = async (e:any)=> {
       
        const file = e.currentTarget.files[0];
        const reader = new FileReader();
        const that=this;
        var r:any;
  
      

          return  reader.onload = function() {
                // reader.results当完成onload后会将图片转为base64
                // 后端只要解析base64对应的字符串即可
                const result = this.result;
                result?.toString();
                console.log("amiaumiau",result);
                r= result?.toString();
                console.log('r',r)
               return r;
              //   that.props.saveController.onChanged(save => {
              //     const data = save.data["uploadImage_actions"];
              //     if (data !== undefined && data.factors !== undefined){
              //         data.factors.profibild=result?.toString();
      
              //     }
              // });
          };
            
        
     

        
    
     
        // reader.readAsDataURL(file);
        // return r

    }
  

    build(): JSX.Element {

        let values = this.props.save.data["uploadImage_actions"]?.factors;
        if (values !== undefined) {
            return (
            
                <div className={"uploadImage_actions"} >
                    <Row className={"mb-3 mt-3"}> 
                         <Col sm={isDesktop() ? 6 : 12}>
                            <div>
                               profibild:<br/> <input type='file' disabled={this.props.disabled} value={values.profibild} className="form-control" name="profibild" onChange={this.applyProfibildInfoChanges1.bind(this)}/> <br/>
                               vorname: <input type='text' disabled={this.props.disabled} value={values.vorname} className="form-control" name = 'vorname' onChange={this.applyProfibildInfoChanges1.bind(this)} />
                               name: <input type='text' disabled={this.props.disabled}   value={values.name} className="form-control" name = 'name' onChange={this.applyProfibildInfoChanges1.bind(this)} />
                               alter: <input type='text' disabled={this.props.disabled}  value={values.alter} className="form-control" name = 'alter' onChange={this.applyProfibildInfoChanges1.bind(this)} />          
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



    // private updateAlternative(index: number, fn: (action: UploadImgValues) => UploadImgValues) {

    //     this.props.saveController.onChanged(save => {
    //         const actionsData = save.data["uploadImage_actions"];

    //         if (actionsData !== undefined) {

    //         }
    //     });
    // }

     async applyProfibildInfoChanges1(e:any){
        let value:string = e.target.value;
        let name =  e.target.name;
        const b =await this.handleFileChange(e)
        console.log('b',b)
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
                    //    const a= this.handleFileChange(e)
                       
                      
                        //  this.handleFileChange(e).then(value=>{console.log(value)});
                        // alert(data.factors.profibild )
                        break;
        
                }
            }
        })
    }


    // 传值存在问题
    // private applyProfibildInfoChanges(type: String , values: any) {

    //     this.props.saveController.onChanged(save => {
    //         const data = save.data["uploadImage_actions"];
           
    //         if (data !== undefined) {
                
    //             switch (type) {
    //                 case "name":
    //                     data.factors.name = 'update';
    //                     break;
    //                 case "vorname":
    //                     data.factors.vorname = 'update';
    //                     break;
    //                 case "alter":
    //                     data.factors.alter = 'update';
    //                     break;
    //                 case "profibild":
    //                      data.factors.profibild = 'update';
    //                     break;
                    
    //             }
    //         } 
    //     });
    // }

}
