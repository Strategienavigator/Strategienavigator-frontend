import {
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {Col, Row} from "react-bootstrap";
import {isDesktop} from "../../../../../general-components/Desktop";
import { AvatarUploadField } from "../../../../../general-components/AvatarUploadField/AvatarUploadField";


export interface PersonaShowValues {

}
export class PersonaShowComponent extends Step<PersonaAnalysisValues, PersonaShowValues>{


    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
  
    }

    build(): JSX.Element {
        let bedürfnisse =  this.props.save.data['persona-factors']?.factors.bedürfnisse.map((b)=>{ 
            return <div >{b.name}{b.desc}</div>  
        })  
        let art_der_Erkrankung =  this.props.save.data['persona-factors']?.factors.art_der_Erkrankung.map((b)=>{ 
            return <div >{b.name}{b.desc}</div>  
        }) 
        let beraterOrAngehörige =  this.props.save.data['persona-factors']?.factors.beraterOrAngehörige.map((b)=>{ 
            return <div >{b.name}{b.desc}</div>  
        }) 
        let charaktereigenschaften =  this.props.save.data['persona-factors']?.factors.charaktereigenschaften.map((b)=>{ 
            return <div >{b.name}{b.desc}</div>  
        })   
        let familieOrFreunde =  this.props.save.data['persona-factors']?.factors.familieOrFreunde.map((b)=>{ 
            return <div >{b.name}{b.desc}</div>  
        }) 
        let hobiese =  this.props.save.data['persona-factors']?.factors.hobies.map((b)=>{ 
            return <div >{b.name}{b.desc}</div>  
        })
        let motivation =  this.props.save.data['persona-factors']?.factors.motivation.map((b)=>{ 
            return <div >{b.name}{b.desc}</div>  
        })  
        let qualifikation =  this.props.save.data['persona-factors']?.factors.qualifikation.map((b)=>{ 
            return <div >{b.name}{b.desc}</div>  
        })  
        let zitat =  this.props.save.data['persona-factors']?.factors.zitat.map((b)=>{ 
            return <div >{b.name}{b.desc}</div>  
        })     
        let baseInfoName =  this.props.save.data['uploadImage_actions']?.factors.name+", "+this.props.save.data['uploadImage_actions']?.factors.vorname
        let baseInfoAlter=  this.props.save.data['uploadImage_actions']?.factors.name+" Jahre Alt"
        let baseInfoImg=this.props.save.data['uploadImage_actions']?.factors.profibild

        return <div>
                {/* wo:{bedürfnisse } */}
               { AvatarUploadField } 
             
               <div className="getBorder" >
                   {/* 全属性：{ JSON.stringify(this.props.save)} */}
               
                {/* 某一属性： 第一个页面的name:【 {this.props.save.data['persona-factors']?.factors.bedürfnisse[0].name}】 */}
            
                   <Row>
                     <Col className={"childBox langBox"} sm={{span:2,offset:0}} >
                     </Col>
                     <Col className={"childBox langBox withoutBorder"} sm={{span:2,offset:0}}>
                        <Row>
                           <Col className={"childBox"} sm={{span:14,offset:0}}>
                           </Col>
                           
                        </Row>
                        <Row className={"untenChild"}>
                           <Col className={"childBox"} sm={{span:14,offset:0}}>
                           </Col>
                           
                        </Row>
                     </Col>
                     <Col className={"childBox langBox"} sm={{span:3,offset:0}}>
                        <img id="personaBild" src={baseInfoImg}/>
                        <Row>{baseInfoName}</Row>
                        <Row>{baseInfoAlter}</Row>
                     </Col>
                     <Col className={"childBox langBox withoutBorder"} sm={{span:2,offset:0}}>
                        <Row>
                           <Col className={"childBox"} sm={{span:14,offset:0}}>
                           </Col>
                           
                        </Row>
                        <Row className={"untenChild"}>
                           <Col className={"childBox"} sm={{span:14,offset:0}}>
                           </Col>
                           
                        </Row>
                     </Col>
                     <Col className={"childBox langBox"} sm={{span:2,offset:0}}>
                     </Col>
                   
                   </Row>

                   <Row>
                        <Col className={"childBox descriptBox"} sm={{span:8,offset:0}} >
                        </Col>
                         <Col className={"childBox descriptBox"} sm={{span:8,offset:0}} >
                        </Col>
                   </Row>
               
               </div>
            </div>
    }
}