import React, { useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";

import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import ReactStars from "react-rating-stars-component";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FeedbackModal({ show, onChildData }) {
    const [showFeedback, setShowFeedback] = useState(show);
    const [saveAllData , setSaveAllData] = useState({feedback_rating:'',feedback_recommend:'',feedback_remark:""})
    const [rating, setRating] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const handleClose = () =>{
        setShowFeedback(false)
        onChildData(false)
      } 
      const handlechangedata = (e) => {
        const value = e.target.value;
        const key = e.target.name;
        setSaveAllData({ ...saveAllData, [key]: value })
      }
      const handleSubmit = () => {
        if (rating <= 0) {
          toast.error('Please select Ratings');
          return;
        }
      
        if (saveAllData.feedback_recommend === "") {
          toast.error('Please select All Inputs');
          return;
        }
      
        if (rating === "") {
          toast.error('Please select a feedback rating');
          return;
        }
      
        if (saveAllData.feedback_remark === "") {
          toast.error('Please provide feedback remarks');
          return;
        }
      
        toast.success("Feedback Submitted Successfully");


        const dataString = {
          feedback_page: "ORDER_DETAIL",
          feedback_rating: rating,
          feedback_recommend: saveAllData.feedback_recommend,
          feedback_remark: saveAllData.feedback_remark,

        };

        ApiService.postData("submit-feedback", dataString).then((res) => {
          if (res.status === "success") {
            setSuccessMessage(res.message);
            setTimeout(() => {
              setSuccessMessage("");
            }, 2000);
          } else {
            setErrorMessage(res.message);
            setTimeout(() => {
              setErrorMessage("");
            }, 2000);
          }
        });

      }; 
   const ratingChanged = (newRating) => {
    setRating(newRating);
   
  }; 
  return (
    <>
    <ToastContainer/>
      <Modal show={showFeedback} onHide={handleClose} className="feedbackModal bottom">
      <button onClick={handleClose} className="pop-close"></button>
      <Modal.Body>
      <div className="feedbackModalbox-header mb-3">
            <h5 className="tx-theme mb-1">Customer Feedback Form </h5> 
            <p className="tx-color-02 tx-12">
            Thank you for taking time to provide feedback. We appreciate hearing from you and will review your comments carefully. 
            </p>
        </div>
        <div className="feedbackModalbox-form">
        <div className="feedback-from-group mb-3">
          <label>How satisfied are you with our company overall? </label>
          <ReactStars count={5}  size={24} activeColor="#ffd700" onChange={ratingChanged} />
          </div>
          <div className="feedback-from-group mb-3">
            <label>Would you recommend it to your friends and colleagues? </label>
            <div className="feedgroup">
              <div className="feedgroup-inner me-5">
              <input
                    type="radio"
                    name="feedback_recommend"
                    value="yes"
                    checked={saveAllData.feedback_recommend === "yes"}
                    onChange={handlechangedata}
                      />
                      <span className="ms-2">Yes</span>
                
              </div>
              <div className="feedgroup-inner">
                              <input
                      type="radio"
                      name="feedback_recommend"
                      value="no"
                      checked={saveAllData.feedback_recommend === "no"}
                      onChange={handlechangedata}
                    />
                    <span className="ms-2">No</span>
              </div>
            </div>
          </div>
          <div className="feedback-from-group mb-3">
          <label>Do you have any suggestions to improve our product and service?</label>
          <textarea name="feedback_remark" onChange={handlechangedata}></textarea>
          </div>
          <div className="feedback-from-group mb-3">
          <button type="button" className="btn btn-primary-outline btn-medium me-3" onClick={handleSubmit}>Submit</button>
          </div>
        
        </div>
      </Modal.Body>
     
      </Modal>
    </>
  );
}

export default FeedbackModal;