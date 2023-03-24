import React, {Component} from "react";
import "./AvatarUploadField.scss";
import{TextPersona}from"./TextPersona";
import {Col, Row} from "react-bootstrap";


export interface AvatarUploadFieldProps {
    PlaceholderText:String,
    item:String,
    count:Number,
    setValue:(value:String)=>void,
    itemValue1:String
}

/**
 * Zeigen Sie hochgeladene Profibild-Informationen und persönliche Informationen an, die nicht mehrfach ausgewählt werden können.
 */
export class AvatarUploadField extends Component<any, any> {
    constructor(props:any) {
        super(props);
        this.state = {
        personDateItems:[{"info":"Vorname: ","plch":"Bitte geben Sie Vorname ein. "},
        {"info":"Name: ","plch":"Bitte geben Sie Name ein."},
        {"info":"Alter: ","plch":"Bitte geben Sie Alter ein."}],itemValue1:'',itemValue2:'',itemValue3:'',
        imgSrc:'https://www.windows-faq.de/wp-content/uploads/2022/09/user.png'
       };
      }

      

      setValue=(value:String,inhalt:any)=>{
        if(inhalt=="Vorname: "){
            this.setState({itemValue1:value})
       }
       else if(inhalt=="Name: "){
        this.setState({itemValue3:value})
       }
       else{
        this.setState({itemValue2:value})
       }

       
        }

        savePersonInfo(){
            alert(0)
            alert(this.state.itemValue1)
       this.props.getValues(this.state.itemValue3,this.state.itemValue1,this.state.itemValue2,this.state.imgSrc);
   
          };
     
     

    render() {
        // let classes = ["AvatarUpload"];
        // let items =  this.state.personDateItems.map((item:any,index:number)=>{ 
        //     return <TextPersona key={index} labelInfo={item.info} setValue={this.setValue}   placeholderText={item.plch}/> 
        //   });                 


        return (
            <div className={"borderLayout"}>
                ewwe
                <Row >
                    <Col>dsd</Col>
                </Row>
            </div>
 
        );
    }

}
