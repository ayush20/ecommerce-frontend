import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";

function FilterModal({ showmodal, onChildData }) {
    const [show, setShow] = useState(false);
    const [showFilter, setShowFilter] = useState(showmodal);
    const handleClose = () =>{
        setShow(false)
        onChildData(false)
      } 
  return (
    <>
      <Modal show={showFilter} onHide={handleClose} className="filterModal bottom">
        
       <div className="filterModal-section">
        <div className="filterModal-header">
          <h6 className="tx-14 mb-0">Filters</h6>
          <a href="#" className="tx-12 tx-theme">CLEAR ALL</a>
        </div>
      <div className="filterModal-body">
        <div className="filter_tabs">
          <div className="filter_tab">
            <input type="radio" id="tab-1" name="tab-group-1" checked />
              <label for="tab-1">tab 1</label>
              <div className="filter_content">
                <div className="fiter_content_list">
                  <ul>
                    <li><span>Sweets</span><input type="checkbox"/></li>
                  </ul>
                </div>
              </div>
          </div>
          <div className="filter_tab">
            <input type="radio" id="tab-2" name="tab-group-1" />
              <label for="tab-2">tab 1</label>
              <div className="filter_content">
                <span>content 2</span>
              </div>
          </div>
        </div>
      </div>
        <div className="filterModal-footer">
          <span className="border-right">CLOSE</span>
          <span className="tx-theme">APPLY</span>
        </div>
       </div>
      </Modal>
    </>
  );
}

export default FilterModal;