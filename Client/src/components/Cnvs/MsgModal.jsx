import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';
import './MsgModal.css';

export default class MsgModal extends Component {
   constructor(props) {
      super(props);
      //console.log(this.props);
      this.state = {
         content: ""
      }
   }

   close = (result) => {
      //console.log("setting dismissal status");
      this.props.onDismiss({
         status: result,
         content: this.state.content
      });
      
   }

   getValidationState = () => {
      if (this.state.cnvTitle) {
         return null
      }
      return "warning";
   }

   handleChange = (e) => {
      this.setState({ content: e.target.value });
      //console.log("changing title to " + e.target.value)

   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ content: (nextProps.cnv && nextProps.cnv.title) || "" })
      }
   }

   render() {
         //console.log("Rendering Modal")
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>{"New Message"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.content.length ?
                     this.close("Ok") : this.close("Cancel")}>
                  <FormGroup controlId="formBasicText"
                   validationState={this.getValidationState()}
                  >
                     <ControlLabel>Message Content</ControlLabel>
                     <FormControl 
                        componentClass="textarea"
                        type="text"
                        value={this.state.content}
                        placeholder="Enter message"
                        onChange={this.handleChange}
                     />
                     <HelpBlock>Content cannot be empty.</HelpBlock>
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}