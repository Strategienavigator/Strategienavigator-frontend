import {Component} from "react";
import {Link} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import {Container} from 'react-bootstrap';
import {faArrowsAlt, faBorderAll, faChartPie, faSortAmountDownAlt, faThLarge} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {getSave} from "../../../general-components/API/calls/Saves";
import "./persona.scss"
import { Button} from "react-bootstrap";
import FAE from "../../../general-components/Icons/FAE";
import { ElementFlags } from "typescript";
import {PersonaFactorsValues} from '../../tools/persona-analysis/steps/PersonaFactors/PersonaFactorsComponent'

interface PersonaState{

}
export class Persona extends Component<any, any> {
   
    

    constructor(props: any) {
        super(props);
        this.state={
            Alter:'',Name:'',Vorname:'',Img:''
        }
        console.log(props)
        
    }


    getSave= async () =>{
           setTimeout(async () => {
            let searchCall:any = await getSave(this.props.location.state.id as number, {})
            if (searchCall && searchCall.success) {
                let searchCallData = searchCall.callData.data;
                let obj  = JSON.parse(searchCallData)
                console.log(obj)
                alert(obj.uploadImage_actions.factors.alter)
                var c=document.getElementById("mainPersonaPdf")
                var d=document.getElementById("showPersona")
                c?.classList.add("isNone");
                d?.classList.add("isBlock");
                this.setState({
                    Alter:obj.uploadImage_actions.factors.alter,
                    Name:obj.uploadImage_actions.factors.name,
                    Vorname:obj.uploadImage_actions.factors.vorname,
                    Img:obj.uploadImage_actions.factors.profibild
                })
            }
            return undefined;
        },400);
    }
 

    render() {      
        return (

           <div >
                <Button id="showPersona" onClick={this.getSave}>click to get the values</Button>
                <div id="mainPersonaPdf">
                    <img id="profibild" src={this.state.Img}/>
                    <div className="baseInfo">
                        <span><strong>Name: </strong> {this.state.Name}</span>
                        <span><strong>Vorname: </strong>{this.state.Vorname}</span>
                        <span><strong>Alter: </strong> {this.state.Alter}</span>
                    </div>
                </div>
           </div>
        )
    }
      
    componentDidMount(){

    
     

    }

    componentDidUpdate(){
        
        
        
    }
    componentWillUnmount(){
       
        //一离开页面就会触发
    }

}
