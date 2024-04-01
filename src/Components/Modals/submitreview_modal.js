import React, { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { Col, FormLabel, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import ReactStars from "react-rating-stars-component";
import { ApiService } from '../../Components/Services/apiservices';
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function SubmitReviewModal({ SubmitReview, slug, closeSubmitReview }) {
  const [rating, setRating] = useState('');
  const [Comment, setComment] = useState('');
  const [images, setImages] = useState([]);

  const ReviewimageRef = useRef(null);

  const SubmitReviewmodal = () => {
    closeSubmitReview(false);
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  const removereviewimage = (image) => {
    setImages((prevImages) => prevImages.filter((img) => img !== image));
  };

  const handleUpload = () => {
    ReviewimageRef.current.click();
  };

  const handlereviewimage = (e) => {
    const files = e.target.files;
    const imageArray = [...images]; // Copy the existing images array
    for (let i = 0; i < files.length; i++) {
      imageArray.push(files[i]);
    }
    setImages(imageArray);
  };

  const handleSubmit = async () => {
    if(rating<=0)
    {
      toast.error('Please select Ratings');
      return;
    }
    if(Comment==='' || Comment===null)
    {
      toast.error('Please Write Review');
      return;
    }
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('review', Comment);
    formData.append('slug', slug);
    
    for (let i = 0; i < images.length; i++) {
      formData.append('images[]', images[i]); // Use 'images[]' to handle multiple image files on the backend
    }
    
    ApiService.postData("submitreview", formData)
      .then((res) => {
        if (res.status === "success") {
          toast.success("Review Submitted Successfully");
          window.location.reload();

        } else {
          toast.error(res.message);
          return false;
        }
      })
      .catch((error) => {
        // Handle error
      });
  };

  return (
    <Modal show={SubmitReview} className="right reviewModal">
      <div className="reviewModal-content">
        <div className="reviewModal-header">
          <div>
          <h4 className="reviewModal-title">Add a Review</h4>
          <p>Your email address will not be published. Required fields are marked * </p>
          </div>
         
          <button className="reviewModal-close" onClick={SubmitReviewmodal}>
            <i className="d-icon-times"></i>
          </button>
        </div>
        <div className="reviewModal-body">
          <div className="review-form mb-3">
            <label className="mb-0">Your Rating <span>*</span></label>
            <ReactStars count={5} onChange={ratingChanged} size={24} activeColor="#ffd700" />
          </div>
          <div className="review-form mb-3">
            <label>Your Review <span>*</span></label>
            <textarea
                  name="comment"
                  className="required"
                 
                  onChange={(e)=>setComment(e.target.value)}
                />
          </div>
          <div className="review-form mb-1">
            <div className="vi-box-section">
            <div className="vi-box">
                <div className="vi-box-inner">
                   <img
                        src="/img/defaultimage2.png" // Always show the default image
                        onClick={handleUpload}
                        alt="Add Images"
                    />
                <div className="tx-12">Add Images</div>     
                </div>
                </div>  
             
                <input
                  type="file"
                  ref={ReviewimageRef}
                  style={{ display: "none" }}
                  multiple // Allow multiple file selection
                  onChange={handlereviewimage}
                />
                {
                images.map((image, index) => (
                   
                        <div className="vi-box">
                        <div className="vi-box-inner">
                        <div className="remove"><i className="fa fa-times" aria-hidden="true" onClick={(e) => removereviewimage(image)}></i></div>
                        <img src={URL.createObjectURL(image)} alt={`Review Image ${index}`} />
                        </div>
                        </div>

                    ))
                    }
            </div>
          
          </div>
          <div className="review-form mb-3">
            <p className="tx-12 tx-color-02">  Upload images. Maximum count: 3, size: 2MB</p>
          </div>
        
          <div className="review-form mb-3">
          <button className="btn btn-primary btn-medium" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
        
      </div>
    </Modal>
  );
}

export default SubmitReviewModal;
