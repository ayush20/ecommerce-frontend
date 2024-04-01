import React, { useEffect, useRef, useState } from "react";
import SpinnerLoader from "../../Components/Elements/spinner_loader"; 
import Modal from "react-bootstrap/Modal";
import StarRating from "../../Components/Elements/starrating";
import moment from "moment";
function ViewAllReviewModal({showmodal,reviewData=null,onChildData}) {
    const didMountRef = useRef(true);
    const [showQuick, setShowQuick] = useState(showmodal);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true); 
    
    const handleChildData = (status) => {
      setShow(status);
    };
 

    useEffect(() => {
      if (didMountRef.current) { 
      }
      didMountRef.current = false;
    }, []); 
    const handleClose = () =>{
        setShow(false)
        onChildData(false)
      }  
  return (
    <> 
      <Modal show={showQuick} onHide={handleClose} className="quickViewModal">
        <button onClick={handleClose} className="pop-close "><i className="d-icon-times"></i></button>
        <Modal.Body> 
        <div className="comentlist">
            <ul>
                {reviewData.map((value, index) => {
                    return (
                    <li key={index}>
                    <div className="comment">
                        <div className="comment-body">
                        {value.pr_rating && value.pr_rating > 0 ? (
                            <div className="ratings-container mb-2">
                            <StarRating numberOfStars={value.pr_rating} />
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="comment-rating"></div>
                        <div className="comment-user">
                            <span className="comment-meta">
                            by{" "}
                            <span className="comment-name">
                                {value.pr_title}
                            </span>{" "}
                            on
                            <span className="comment-date">
                                {moment(value.pr_created).format(
                                "MMM D, YYYY"
                                )}
                            </span>
                            </span>
                        </div>
                        <div className="comment-content">
                            <p>{value.pr_review}</p>
                        </div>
                        <div className="comment-images"></div>
                        </div>
                    </div>
                    </li>
                    )
                })}
            </ul>
        </div>
        </Modal.Body>
      </Modal>
     </>
  );
}
export default ViewAllReviewModal;
