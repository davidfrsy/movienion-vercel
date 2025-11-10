import React from "react";
import { Modal, Button } from "react-bootstrap";

const LogoutModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Konfirmasi Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Apakah Anda yakin ingin logout?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Ya, Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutModal;
