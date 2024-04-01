import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import Container from "react-bootstrap/Container";
import { Col, FormLabel, Row } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header"; 
import Footer from "../../Components/Footer";
import constant from "../../Components/Services/constant";
import { ToastContainer,toast } from "react-toastify";


import { Helmet } from "react-helmet";
function Feedback() {
  const { slug } = useParams();
  const didMountRef = useRef(true);
  const [pageData, setPageData] = useState({});
  const [pageContent, setPageContent] = useState("");
  const [rating, setRating] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saveAllData , setSaveAllData] = useState({
    feedback_rating:'',
    feedback_recommend:'',
    feedback_remark:"",
    feedback_fullname: "",
    feedback_email: "",
    feedback_mobile: "",
  
  })

  const handlechangedata = (e) => {
    const value = e.target.value;
    const key = e.target.name;
    setSaveAllData({ ...saveAllData, [key]: value })
  }
 
  useEffect(() => {
    if (didMountRef.current) {
     
      const getPageData = {
        slug: "feedback-form",
      };
      ApiService.postData("page-content", getPageData).then((res) => {
        if (res.status == "success") {
          setPageData(res.data);
          setPageContent(res.data.page_content);
        }
      });
    }
    didMountRef.current = false;
  }, []);

  const handleSubmit = () => {

    if (saveAllData.feedback_fullname.trim() === "") {
      toast.error('Please enter your Full Name');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(saveAllData.feedback_email)) {
    toast.error('Invalid Email format');
    return;
  }

  
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(saveAllData.feedback_mobile)) {
    toast.error('Invalid Mobile number. Please enter a 10-digit number.');
    return;
  }
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
      feedback_page: "FEEDBACK_PAGE",
      feedback_rating: rating,
      feedback_recommend: saveAllData.feedback_recommend,
      feedback_remark: saveAllData.feedback_remark,
      feedback_fullname: saveAllData.feedback_fullname,
      feedback_email: saveAllData.feedback_email,
      feedback_mobile: saveAllData.feedback_mobile,
    };

    ApiService.postData("submit-feedback", dataString).then((res) => {
      if (res.status === "success") {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setSuccessMessage("");
          window.location.reload();
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
<Helmet>
        <title>{pageData.page_meta_title}</title>
        <meta name="description" itemprop="description" content={pageData.page_meta_desc != null ? pageData.page_meta_desc :"Momabatti"} />
        {pageData.page_meta_keyword != null ?<meta name="keywords" content={pageData.page_meta_keyword} />:""}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={pageData.page_meta_title} />
        <meta name="twitter:url" content={window.location.href} />
             <meta property="og:image" content= {constant.FRONT_URL+'img/logo.png'}/>
        <meta property="og:url" content={window.location.href} />
      <meta property="og:description" content={pageData.page_meta_desc != null ? pageData.page_meta_desc :"Momabatti"}  />
        <meta name="twitter:title" content={pageData.page_meta_title} />
        <meta name="twitter:description" content={pageData.page_meta_desc != null ? pageData.page_meta_desc :"Momabatti"} />
            <meta property="twitter:image" content= {constant.FRONT_URL+'img/logo.png'}/>
      </Helmet>
      <ToastContainer/>
<Header state="inner-header" />
      <div className="subheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1>{pageData.page_name}</h1>
              <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>{pageData.page_name}</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </div>
<section className="sec-pad">
  <div className="container">
    <div className="row align-items-center">
      <div className="col-lg-6">
        <img src="/img/feedback.png" className="img-fluid mb-3"/>
      </div>
      <div className="col-lg-6">
      <div className="feedback-desktop">
      <h5 className="tx-theme mb-1">Customer Feedback Form </h5>
            <p className="tx-color-03 tx-14">
            Thank you for taking time to provide feedback. We appreciate hearing from you and will review your comments carefully. 
            </p>
            
              <div className="row g-3">
              <div className="col-lg-12">
                <div className="feedback-group mb-1">
                  <label>Full Name</label>
                  <input type="text"
                        name="feedback_fullname"
                        value={saveAllData.feedback_fullname} 
                        onChange={handlechangedata} /> 
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                <div className="feedback-group mb-1">
                  <label>Email Address</label>
                  <input type="email"
                        name="feedback_email"
                        value={saveAllData.feedback_email}
                        onChange={handlechangedata}/> 
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                <div className="feedback-group mb-3">
                  <label>Phone Number</label>
                  <input type="number"
                        name="feedback_mobile"
                        value={saveAllData.feedback_mobile}
                        onChange={handlechangedata}/> 
                  </div>
                </div>
              </div>
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
      </div>
    </div>
  </div>
</section>
      {pageContent != null ? (
        <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
      ) : (
        ""
      )}
      <Footer />
      </>
  )
}

export default Feedback