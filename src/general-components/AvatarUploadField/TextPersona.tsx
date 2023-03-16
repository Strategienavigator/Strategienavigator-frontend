import React, {Component} from "react";

import "./AvatarUploadField.scss";
import {Property} from "csstype";


export interface TextFieldProps {

    placeholderText:String
    labelInfo:String
    setValue:(value:String,inhalt:String)=>void
    

}

/**
 * Zeigt alle Schaltflächen in einem Panel an, das sie nebeneinander anzeigt und auch reaktionsschnell umbricht
 */
export class TextPersona extends Component<TextFieldProps, any> {
    constructor(props:any,placeholderText:String) {
        super(props);
        this.state = { Inhalt:this.props.labelInfo,placeholderText:this.props.placeholderText,valueItem:'',setValue:this.props.setValue};
        
      }

    /*
    *Wieso setTimeOut: Lösen das asynchrone Problem von React,
    * wenn dies nicht verwendet wird, können die Daten nicht in
    * Echtzeit aktualisiert werden.
    */

      handleGetInputValue = (e:any) => { 
        setTimeout(() => {
          this.setState({
         valueItem : e.target.value,
  
          })
       
          
         this.props.setValue(this.state.valueItem,this.state.Inhalt)
         console.log(this.state.valueItem)    
          }, 0);
      };

    render() {

        return (
            <div className={"form-group personDataGroup"}> 
                <label>{this.state.Inhalt}</label> 
                <input  className="form-control inputText2"  onChange={this.handleGetInputValue}  type="text" placeholder={this.state.placeholderText}/> 
           </div> 
        );
    }

}
