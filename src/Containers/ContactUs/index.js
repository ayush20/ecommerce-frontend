import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Col, FormLabel, Row } from "react-bootstrap";
import { validEmail } from "../../Components/Elements/Regex";
import Alert from "react-bootstrap/Alert";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import constant from "../../Components/Services/constant";
import { Helmet } from "react-helmet";
function Contact() {
  const { slug } = useParams();
  const didMountRef = useRef(true);
  const [pageData, setPageData] = useState({});
  const [pageContent, setPageContent] = useState("");
  const [settingData, setSettingData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [contactDetails, setContactDetails] = useState({
    contact_name: "",
    contact_email: "",
    contact_subject: "",
    contact_message: "",
  });
  useEffect(() => {
    if (didMountRef.current) {
      getSettingsData();
      const getPageData = {
        slug: "contact-us",
      };
      ApiService.postData("page-content", getPageData).then((res) => {
        if (res.status == "success") {
          setPageData(res.data);
          setPageContent(res.data.page_content);
        }
      });
    }
    didMountRef.current = false;
  });
  const getSettingsData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
      }
    });
  };

  const onTodoChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetContactForm = () => {
    setContactDetails({
      contact_name: "",
      contact_email: "",
      contact_subject: "",
      contact_message: "",
    });
  };
  const contactusProcess = () => {
    let counter = 0;
    const myElements = document.getElementsByClassName("required");
    for (let i = 0; i < myElements.length; i++) {
      if (myElements[i].value === "") {
        myElements[i].style.border = "1px solid red";
        counter++;
      } else {
        myElements[i].style.border = "";
      }
    }
    if (counter === 0) {
      setErrorMessage("");
      if (!validEmail.test(contactDetails.contact_email)) {
        setErrorMessage("Please enter valid Email Id");
        return false;
      }
      ApiService.postData("contact-us-process", contactDetails).then((res) => {
        if (res.status === "success") {
          setSuccessMessage(res.message);
          resetContactForm();
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
    }
  };

  return (
    <>
      <Helmet>
        <title>{pageData.page_meta_title}</title>
        <meta
          name="description"
          itemprop="description"
          content={
            pageData.page_meta_desc != null
              ? pageData.page_meta_desc
              : "Momabatti"
          }
        />
        {pageData.page_meta_keyword != null ? (
          <meta name="keywords" content={pageData.page_meta_keyword} />
        ) : (
          ""
        )}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={pageData.page_meta_title} />
        <meta name="twitter:url" content={window.location.href} />
        <meta
          property="og:image"
          content={constant.FRONT_URL + "img/logo.png"}
        />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:description"
          content={
            pageData.page_meta_desc != null
              ? pageData.page_meta_desc
              : "Momabatti"
          }
        />
        <meta name="twitter:title" content={pageData.page_meta_title} />
        <meta
          name="twitter:description"
          content={
            pageData.page_meta_desc != null
              ? pageData.page_meta_desc
              : "Momabatti"
          }
        />
        <meta
          property="twitter:image"
          content={constant.FRONT_URL + "img/logo.png"}
        />
      </Helmet>
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
        <Container>
          <Row>
            <Col lg={7}>
              <div className="section-title">
                <h2>Get In Touch With Us</h2>
                <p>
                  If you have any questions or enquiries please feel free to
                  contact us alternatively you can complete our online enquiry
                  form located below and we will get back to you as soon as
                  possible.
                </p>
              </div>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
              )}
              <div className="row g-3">
                <div className="col-lg-6">
                  <div className="form-group-dark">
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="contact_name"
                      className="form-control required"
                      value={contactDetails.contact_name}
                      onChange={(e) => onTodoChange(e)}
                      placeholder="Name"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group-dark">
                    <label>Email Address</label>
                    <input
                      type="text"
                      name="contact_email"
                      className="form-control required"
                      value={contactDetails.contact_email}
                      onChange={(e) => onTodoChange(e)}
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group-dark">
                    <label>Subject</label>
                    <input
                      type="text"
                      name="contact_subject"
                      className="form-control required"
                      value={contactDetails.contact_subject}
                      onChange={(e) => onTodoChange(e)}
                      placeholder="Subject"
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group-dark">
                    <label>Message</label>
                    <textarea
                      name="contact_message"
                      className="form-control required"
                      value={contactDetails.contact_message}
                      onChange={(e) => onTodoChange(e)}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <Button
                    className="btn btn-primary btn-medium"
                    onClick={contactusProcess}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="contact-address-section mb-3">
                <div className="section-title">
                  <h3>Corporate Sales Office</h3>
                </div>
                <div className="address-contact">
                  <ul>
                    <li>
                      <a
                        href="https://maps.app.goo.gl/Rg5p2eywNFv1pQJJ8"
                        target="new"
                      >
                        <i className="d-icon-map mr-5"></i>
                        <span>{settingData.address}</span>
                      </a>
                    </li>
                    <li>
                      <a href={"mailto:" + settingData.admin_email}>
                        <i className="fa fa-envelope  mr-5"></i>
                        <span>{settingData.admin_email}</span>
                      </a>
                    </li>
                    <li>
                      <a href={"tel:" + settingData.admin_mobile}>
                        <i className="d-icon-phone mr-5"></i>
                        <span>{settingData.admin_mobile}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="contact-address-section mb-3">
                <div className="section-title">
                  <h3>Email</h3>
                </div>
                <div className="address-contact">
                  <ul>
                    <li>
                      <a href={"mailto:" + settingData.admin_email}>
                        <i className="fa fa-envelope mr-5"></i>
                        <span>{settingData.admin_email}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {pageContent != null ? (
        <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
      ) : (
        ""
      )}

      <Footer />
    </>
  );
}
export default Contact;
