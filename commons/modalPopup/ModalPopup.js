import React, { Component } from "react";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class ModalPopup extends Component {
  constructor(props) {
    super(props);
  }

  saveAndClose() {
    this.props.onClose();
  }

  render() {
    return (
      <div>
        <Modal
          size="lg"
          show={this.props.open}
          onHide={this.props.onClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.modal.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.modal.body}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.saveAndClose.bind(this)}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ModalPopup;
