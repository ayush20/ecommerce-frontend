import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";

function SortModal({ showmodal, onChildData, handleClosesort }) {
    const [show, setShow] = useState(false);
    const [showSort, setShowSort] = useState(showmodal);
    const handleClose = () =>{
      handleClosesort(false)
        onChildData(false)
      } 
  return (
    <>
      <Modal show={showSort} onHide={handleClose} className="sortModal bottom">
        <div className="sortModalbox">
        <button onClick={handleClose } className="pop-close"><i className="d-icon-times"></i></button>
          <ul>
            <li><span>Featured</span><input type="checkbox"/></li>
            </ul>
        </div>
      </Modal>
    </>
  );
}

export default SortModal;