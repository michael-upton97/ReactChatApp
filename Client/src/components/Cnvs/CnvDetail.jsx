import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel, Collapse, Well, ListGroup, ListGroupItem, Col, Row, Button, Glyphicon } from 'react-bootstrap';
import { ConfDialog } from '../index';
import MsgModal from './MsgModal';
import './CnvDetail.css';

export default class CnvOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updateCnvs();
      this.props.clrMsgs();
      this.props.getMsgs(this.props.computedMatch.params.id);
      var showContent = [];
      this.state = {
         newMessage: "",
         showNewMessage: false,
         showContent: showContent,
         showModal: false,
         cnvId: this.props.computedMatch.params.id
      }
      //console.log(this.props);
   }

   openModal = () => {
      const newState = { showModal: true};
      this.setState(newState);
   }

   modalDismiss = (result) => {
      //console.log("dismissed module with status: " + result.status);
      //console.log("creating new message");
      if(this.state.newMessage){
         this.props.clrMsgs();
         this.newMsg(this.state.newMessage);
      }
      //this.setState({ showModal: false, editCnv: null })
   }

   newMsg(result) {
      //console.log("requesting new msg with content: '" + result + "'");
      //console.log(this.props);
      //console.log(this.state);
      this.props.addMsg({ content: result }, this.state.cnvId);
      this.setState({ newMessage: ""});
   }

   openConfirmation = (msg) => {
      this.setState({ delMsg: msg, showConfirmation: true })
   }

   closeConfirmation = (res) => {
      if (res === "Ok") 
         this.props.deleteMsg(this.state.delMsg.id, this.state.cnvId);
      this.setState({ showConfirmation: false })
   }

   toggleContent = (idx) => {
      var contentArray = this.state.showContent;
      contentArray[idx] = !contentArray[idx];
      //console.log(contentArray);
      const newState = {showContent: contentArray}
      this.setState(newState);
   }

   toggleShowNewMessage = () => {
      var show = this.state.showNewMessage;
      const newState = {showNewMessage: !show}
      this.setState(newState);
   }

   handleChange = (e) => {
      this.setState({ newMessage: e.target.value });
   }

   render() {
      var msgItems = [];
      //if(this.props.msgs === []) () => this.props.getMessages(this.props.computedMatch.params.id);
      //console.log(this.props);
      //console.log(this.props.computedMatch.params.id);
      //console.log(this.state);
      var index = 1;
         msgItems.push(
            <ListGroupItem key="0">
               <Row>
                  <Col sm={2} ><strong>{"Name"}</strong></Col>
                  <Col sm={4} ><strong>{"Email"}</strong></Col>
                  <Col sm={4} className="pull-right text-right"><strong>{"Time Posted"}</strong>
                  </Col>
               </Row>
            </ListGroupItem>
         )
      this.props.Msgs.forEach(msg => {
         msgItems.push(<MsgItem
            key={index}
            id={msg.id}
            whenMade={msg.whenMade}
            email={msg.email}
            name = {msg.firstName + " " + msg.lastName}
            content={msg.content}
            onSelect={() => this.toggleContent(msg.id)}
            showContent={this.state.showContent[msg.id]}
            showControls={false}//{this.props.Prss.role}
         />);
         index = index + 1;
      });

      //console.log(msgItems);
      
      return (
         <section className="container">
            <h1>Conversation Details</h1>
            <ListGroup>
               {msgItems}
            </ListGroup>
            <ListGroupItem onClick={() => this.toggleShowNewMessage()}> 
               New Message
            </ListGroupItem>
            <Collapse in={this.state.showNewMessage}>
               <Row>
                  <Col sm={10}>
                     <FormGroup controlId="formControlsTextarea">
                        <FormControl 
                           type="text"
                           componentClass="textarea"
                           value={this.state.newMessage}
                           placeholder="Enter text"
                           onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                     {/*<HelpBlock>Title can not be empty.</HelpBlock>*/}
                     </FormGroup>
                  </Col>
                  <Col sm={2}>
                     <Button bsStyle="primary" onClick={() => this.modalDismiss(this.state.newMessage)}>
                        Send Message
                     </Button>
                  </Col>
               </Row>
            </Collapse>
            {/*
            <MsgModal
               showModal={this.state.showModal}
               title={"New Message"}
               onDismiss={this.modalDismiss} 
            />
            */}
            <ConfDialog
               show={this.state.showConfirmation}
               title={"Delete Message"}
               body={this.state.delMsg && 'Are you sure you want to delete this message?'}
               buttons={["Ok", "Cancel"]}
               onClose={(delMsg) => this.closeConfirmation(delMsg)}
            />
         </section>
      )


   }
}
const MsgItem = function (props) {
   var style = "list-group-item-hidden";
   return (
      <div>
         <ListGroupItem onClick={props.onSelect}> 
            <Row >
               <Col sm={2}>{props.name}</Col>
               <Col sm={4}>{props.email}</Col>
               <Col sm={4} className="pull-right text-right">{props.whenMade && new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.whenMade))}
               </Col>
            </Row>
            {props.showControls &&
               <div className="pull-right">
                  <Button bsSize="small" onClick={props.onDelete}><Glyphicon glyph="trash" /></Button>
                  <Button bsSize="small" onClick={props.onEdit}><Glyphicon glyph="edit" /></Button>
               </div>
            }
         </ListGroupItem>
         <Collapse in={props.showContent}>
            <div>
               <Well>{props.content}</Well>
            </div>
         </Collapse>
      </div>
   )
}