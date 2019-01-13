import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon } from 'react-bootstrap';
import CnvModal from './CnvModal';
import { ConfDialog } from '../index';
import './CnvOverview.css';

export default class CnvOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updateCnvs();
      this.state = {
         editCnv: false,
         showModal: false,
         showConfirmation: false,
         cnv: null,
         delCnv: null
      }
   }

   // Open a model with a |cnv| (optional)
   openModal = (cnv) => {
      const newState = { showModal: true};
      //console.log("opening modal for cnv: " + JSON.stringify(cnv));
      if (cnv && cnv.id){
         //console.log("HELLO IM HERE");
         newState.cnv = cnv;
         //console.log(newState);
      }
      this.setState(newState)
      //console.log(this.state);
   }

   modalDismiss = (result) => {
      //console.log("dismissed module with status: " + result.status);
      if (result.status === "Ok") {
         //console.log("edit state set to " + this.state.editCnv);
         if (this.state.editCnv){
            //console.log("editing conversation");
            this.modCnv(result);
         }
         else {
            //console.log("creating new conversation");
            this.newCnv(result);
         }
      }
      this.setState({ showModal: false, editCnv: null })
   }

   modCnv(result) {
      //console.log("proposed ID: " + result.id);
      this.props.modCnv(result.id, result.ownerId, result.title);
   }

   newCnv(result) {
      //console.log("requesting new cnv with title: '" + result.title + "'");
      this.props.addCnv({ title: result.title }, result.ownerId);
   }

   openConfirmation = (cnv) => {
      this.setState({ delCnv: cnv, showConfirmation: true })
   }

   closeConfirmation = (res) => {
      if (res === "Ok") 
            this.props.deleteCnv(this.state.delCnv.id, this.state.id);
      this.setState({ showConfirmation: false })
   }

   render() {
      var cnvItems = [];
      this.props.Cnvs.forEach(cnv => {
         if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId){
            cnvItems.push(<CnvItem
               key={cnv.id}
               id={cnv.id}
               title={cnv.title}
               lastMessage={cnv.lastMessage}
               showControls={cnv.ownerId === this.props.Prss.id || this.props.Prss.role}
               onDelete={() => this.openConfirmation(cnv)}
               onEdit={() => {
                  this.state.editCnv = true; 
                  this.openModal(cnv);}
               }
            />);
         }
      });

      return (
         <section className="container">
            <h1>Cnv Overview</h1>
            <ListGroup>
               {cnvItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={() => this.openModal()}>
               New Conversation
            </Button>
            {/* Modal for creating and change cnv */}
            <CnvModal
               showModal={this.state.showModal}
               title={this.state.editCnv ? "Edit title" : "New Conversation"}
               cnv={this.state.cnv}
               onDismiss={this.modalDismiss} 
            />
            <ConfDialog
               show={this.state.showConfirmation}
               title={"Delete Conversation"}
               body={this.state.delCnv && 'Are you sure you want to delete ' + this.state.delCnv.title + '?'}
               buttons={["Ok", "Cancel"]}
               onClose={(delCnv) => this.closeConfirmation(delCnv)}
            />
         </section>
      )
   }
}

// A Cnv list item
const CnvItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}><Link to={"/CnvDetail/" + props.id}>{props.title}</Link></Col>
            <Col sm={4}>{props.lastMessage && new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.lastMessage))
               }
            </Col>
            {props.showControls ?
               <div className="pull-right">
                  <Button bsSize="small" onClick={props.onDelete}><Glyphicon glyph="trash" /></Button>
                  <Button bsSize="small" onClick={props.onEdit}><Glyphicon glyph="edit" /></Button>
               </div>
               : ''}
         </Row>
      </ListGroupItem>
   )
}
