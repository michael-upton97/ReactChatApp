import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

export default class CnvModal extends Component {
   constructor(props) {
      super(props);
      //console.log(this.props);
      this.state = {
         cnvTitle: (this.props.cnv && this.props.cnv.title) || "",
         id: (this.props.cnv && this.props.cnv.id) || null      }
      
   }

   close = (result) => {
      //console.log("setting dismissal status");
      this.props.onDismiss && (this.props.cnv ? this.props.onDismiss({
            status: result,
            title: this.state.cnvTitle,
            id: this.props.cnv.id
         }) : this.props.onDismiss({
            status: result,
            title: this.state.cnvTitle
         }));
      
   }

   getValidationState = () => {
      if (this.state.cnvTitle) {
         return null
      }
      return "warning";
   }

   handleChange = (e) => {
      this.setState({ cnvTitle: e.target.value });
      //console.log("changing title to " + e.target.value)

   }

   formValid() {
      let s = this.state;

      return s.cnvTitle && s.cnvTitle.trim() !== "";
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ cnvTitle: (nextProps.cnv && nextProps.cnv.title) || "" })
      }
   }

   render() {
         //console.log("Rendering Modal")
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.cnvTitle.length ?
                     this.close("Ok") : this.close("Cancel")}>
                  <FormGroup controlId="formBasicText"
                   validationState={this.getValidationState()}
                  >
                     <ControlLabel>Conversation Title</ControlLabel>
                     <FormControl
                        type="text"
                        value={this.state.cnvTitle}
                        placeholder="Enter text"
                        onChange={this.handleChange}
                     />
                     <FormControl.Feedback />
                     <HelpBlock>Title can not be empty.</HelpBlock>
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button disabled={!this.formValid()} onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}