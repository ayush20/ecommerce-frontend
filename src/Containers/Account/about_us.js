import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { BrowserView, MobileView } from "react-device-detect";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import AccountSidebar from "./account_sidebar";
import MobileHeader from "../../Components/Elements/mobile_header";

function Aboutus() {
  const [rowUserData, setRowUserData] = useState({});
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const didMountRef = useRef(true);
  const handleClickLink = (route) => {
    window.location.href = route;
  };
  useEffect(() => {
    if (didMountRef.current) {
      setTimeout(() => {
        setSpinnerLoading(false)
      }, 500);
    }
    didMountRef.current = false;
  }, []);
  return (
    <>
    {spinnerLoading && <SpinnerLoader />}
      <BrowserView>
      <Header state="inner-header"/>
        <main className="main">
          <div className="subheader">
            <Container>
              <Row>
                <Col lg={12}>
                  <Breadcrumb className="breadcrumb-inner">
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>About Us</Breadcrumb.Item>
                  </Breadcrumb>
                </Col>
              </Row>
            </Container>
          </div>

          <div className="page-content mt-4 mb-4">
            <section>
              <Container>
                <Row>
                  <AccountSidebar rowUserData={rowUserData} />
                  <Col lg={9}>
                    <div className="acpanel">
                      <div className="acpanel-header">
                        <h4>About Us</h4>
                      </div>
                      <div className="acpanel-body">
                        <div className="no-img"></div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </section>
          </div>
        </main>
        <Footer />
      </BrowserView>
      <MobileView>
        <MobileHeader PageName="About Us" Route="account/account-overview" />
        <div className="mlist">
          <ul>
           
            <li onClick={() => handleClickLink("/shipping-returns")}>
            Shipping & Returns
            <i className="d-icon-angle-right"></i>
            </li>
          
            <li onClick={() => handleClickLink("/about-us")}>
            About Us
            <i className="d-icon-angle-right"></i>
            </li>
            <li onClick={() => handleClickLink("/terms-of-service")}>
            Terms of Service
            <i className="d-icon-angle-right"></i>
            </li>
            <li onClick={() => handleClickLink("/frequently-asked-questions")}>
            Frequently Asked Questions
            <i className="d-icon-angle-right"></i>
            </li>
            <li onClick={() => handleClickLink("/privacy-policy")}>
              Privacy Policy
            <i className="d-icon-angle-right"></i>
            </li>
            <li onClick={() => handleClickLink("/track-order")}>
            Track Order
            <i className="d-icon-angle-right"></i>
            </li>
            <li onClick={() => handleClickLink("/contact-us")}>
            Contact Us
            <i className="d-icon-angle-right"></i>
            </li>
          </ul>
        </div>
      </MobileView>
    </>
  );
}
export default Aboutus;
