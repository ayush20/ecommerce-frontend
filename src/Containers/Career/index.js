import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import Container from "react-bootstrap/Container";
import { Col, FormLabel, Row } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header"; 
import Footer from "../../Components/Footer";
import constant from "../../Components/Services/constant";
import { ToastContainer,toast } from "react-toastify";

import { Helmet } from "react-helmet";
function Career() {
  

  const { slug } = useParams();
  const didMountRef = useRef(true);
  const [pageData, setPageData] = useState({});
  const [pageContent, setPageContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState([])
  const imageMimeType = /(doc|docx|pdf)/i;
  const [successMessage, setSuccessMessage] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");
  const [saveAllData , setSaveAllData] = useState({
    career_firstname:'',
    career_lastname:'',
    career_email:"",
    career_mobile: "",
    career_job_position: "",
    career_message:"",
    career_record_files:"",
  })

  const handlechangedata = (e) => {
    const value = e.target.value;
    const key = e.target.name;
    setSaveAllData({ ...saveAllData, [key]: value })
  }
  
  useEffect(() => {
    if (didMountRef.current) {
     
      const getPageData = {
        slug: "career",
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

  const handleImage = e => {
    const file = e.target.files[0]; 
    if (!file.type.match(imageMimeType)) {
      alert("Invalid Format, supported formats are | doc | docx | pdf .");
      setImage([]);
      setFileInputValue("")
      return;
  
    }
    else {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
      setFileInputValue(e.target.value);
  }
  };

  const handleSubmit = () => {

    if (saveAllData.career_firstname.trim() === "") {
      toast.error('Please enter your First Name');
      return;
    }
    if (saveAllData.career_lastname.trim() === "") {
      toast.error('Please enter your Last Name');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(saveAllData.career_email)) {
      toast.error('Invalid Email format');
      return;
    }
  
   
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(saveAllData.career_mobile)) {
      toast.error('Invalid Mobile number. Please enter a 10-digit number.');
      return;
    }
    if (saveAllData.career_job_position.trim() === "") {
      toast.error("Please enter a Job Position");
      return;
    }
    if (!image.raw) {
      toast.error("Please upload your Resume");
      return;
    }


    const formData = new FormData();

    formData.append("career_firstname", saveAllData.career_firstname);
    formData.append("career_lastname", saveAllData.career_lastname);
    formData.append("career_email", saveAllData.career_email);
    formData.append("career_mobile", saveAllData.career_mobile);
    formData.append("career_job_position", saveAllData.career_job_position);
    formData.append("career_message", saveAllData.career_message);
    formData.append("career_record_files", image.raw);
    
    ApiService.postData("submit-career", formData).then((res) => { 
      if (res.status === "success") {
    
        setSuccessMessage("Your resume has been posted. Thanks for applying!");
        setTimeout(() => {
          setSuccessMessage("");
          window.location.reload();
        }, 5000);
      } else {
        setErrorMessage(res.message);
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
      }
    });

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
        <img src="/img/career.png" className="img-fluid mb-3"/>
      </div>
      <div className="col-lg-6">
      <div className="feedback-desktop">
      <h5 className="tx-theme mb-1">Apply Job</h5>
      <p className="tx-color-03 tx-14">
            Please Fill the Form
            </p>
            
              <div className="row g-3">
                <div className="col-lg-6 col-6">
                <div className="feedback-group mb-1">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="career_firstname"
                    value={saveAllData.career_firstname}
                    onChange={handlechangedata}
                  />
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                <div className="feedback-group mb-1">
                  <label>Last Name</label>
                  <input
                  type="text"
                  name="career_lastname"
                  value={saveAllData.career_lastname}
                  onChange={handlechangedata}
                />
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                <div className="feedback-group mb-1">
                  <label>Email Address</label>
                  <input
                  type="email"
                  name="career_email"
                  value={saveAllData.career_email}
                  onChange={handlechangedata}
                />
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                <div className="feedback-group mb-1">
                  <label>Mobile Number</label>
                    <input
                  type="number"
                  name="career_mobile"
                  value={saveAllData.career_mobile}
                  onChange={handlechangedata}
                />
                  </div>
                </div>
                <div className="col-lg-12">
                <div className="feedback-group mb-1">
                  <label>Job Position</label>
                  <input
                  type="text"
                  name="career_job_position"
                  value={saveAllData.career_job_position}
                  onChange={handlechangedata}
                />
                  </div>
                </div>
                <div className="col-lg-12">
                <div className="feedback-group mb-3">
                         <label>Upload Resume</label>
                         <input
                      type="file"
                      accept=".doc, .docx, .pdf"
                      onChange={handleImage}
                      value={fileInputValue}
                    />
                    <p>Accepted formats: .doc, .docx, .pdf</p>
                  </div>
                </div>
              </div>
         
           
            <div className="feedback-group mb-3">
            <label>Message</label>
                      <textarea
              name="career_message"
              value={saveAllData.career_message}
              onChange={handlechangedata}
            ></textarea>
            </div>
            <div className="feedback-group  mb-3">
          <button type="button" className="btn btn-primary-outline btn-medium me-3" onClick={handleSubmit}>Submit</button>
          </div>
          {successMessage && <p className="text-success">{successMessage}</p>}
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

export default Career