import React, { useEffect, useState, useRef } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { BrowserView, MobileView } from "react-device-detect";
import AccountSidebar from "./account_sidebar";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import MobileHeader from "../../Components/Elements/mobile_header";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { useNavigate } from "react-router-dom";
import sessionCartData from "../../Components/Elements/cart_session_data";
function HelpandSupport() {
  const didMountRef = useRef(true);
  const navigate = useNavigate();
  const [rowUserData, setRowUserData] = useState({});
  const [settingData, setSettingData] = useState({});
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  useEffect(() => {
    if (didMountRef.current) {
      getuserData();
      getFooterData();
    }
    didMountRef.current = false;
  }, []);
  const getFooterData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
        setSpinnerLoading(false);
      }
    });
  };
   const getuserData = () => {
    ApiService.fetchData("get-user-data").then((res) => {
      if (res.status == "success") {
        setRowUserData(res.rowUserData);
        setSpinnerLoading(false);
      } else {
        setSpinnerLoading(false);
        //localStorage.removeItem("USER_TOKEN");
        //navigate("/");
      }
    });
  }; 
  return (
    <>
      <BrowserView>
      <Header state="inner-header" cartCount={parsedCartSession.length}/>
        {spinnerLoading && <SpinnerLoader />}
        <main className="main">
          <div className="subheader">
            <Container>
              <Row>
                <Col lg={12}>
                  <Breadcrumb className="breadcrumb-inner">
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>Help & Support</Breadcrumb.Item>
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
                        <h4>Help & Support</h4>
                      </div>
                      <div className="acpanel-body">
                      <div className="p-5 helpbox text-center">
          <img className="img-fluid mb-2" src="/img/support-img.png" style={{ width: '200px' }}></img>

          <h6>How can we help you today?</h6>
          <p className="tx-color-02 tx-13 mb-0">
            Our customer service team will be able to assist you with any order
            or query
          </p>
        </div>
        <div className="macc-list">
          <ul>
            <li>
              <a href={"mailto:" + settingData.admin_email}>
                <div className="macc-list-icon">
                  <img src="/img/mail-inbox-app.png"></img>
                </div>
                <div>
                  <p className="mb-0">Email Us</p>
                  <span className="tx-color-02 tx-11">
                    Write to Momabatti directly for any query
                  </span>
                </div>
                <i className="d-icon-angle-right"></i>
              </a>
            </li>
            <li>
              <a href={"tel:" + settingData.admin_mobile}>
                <div className="macc-list-icon">
                  <img src="/img/phone-call.png"></img>
                </div>
                <div>
                  <p className="mb-0">Call Us</p>
                  <span className="tx-color-02 tx-11">
                    Get in touch and we will be happy to help you
                  </span>
                </div>
                <i className="d-icon-angle-right"></i>
              </a>
            </li>
            <li>
              <a href={"https://wa.me/" + settingData.admin_whatsapp_no} target="new">
                <div className="macc-list-icon">
                  <img src="/img/whatsapp.png"></img>
                </div>
                <div>
                  <p className="mb-0">Whatsapp</p>
                  <span className="tx-color-02 tx-11">
                    Get in touch and we will be happy to help you
                  </span>
                </div>
                <i className="d-icon-angle-right"></i>
              </a>
            </li>
          </ul>
        </div>
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
        <MobileHeader
          PageName="Help & Support"
          Route="account/account-overview"
          cartCount={parsedCartSession.length}
        />

        <div className="p-5 helpbox text-center">
          <img className="img-fluid mb-2" src="/img/support-img.png"></img>

          <h6>How can we help you today?</h6>
          <p className="tx-color-02 tx-13 mb-0">
            Our customer service team will be able to assist you with any order
            or query
          </p>
        </div>
        <div className="macc-list">
          <ul>
            <li>
              <a href={"mailto:" + settingData.admin_email}>
                <div className="macc-list-icon">
                  <img src="/img/mail-inbox-app.png"></img>
                </div>
                <div>
                  <p className="mb-0">Email Us</p>
                  <span className="tx-color-02 tx-11">
                    Write to Momabatti directly for any query
                  </span>
                </div>
                <i className="d-icon-angle-right"></i>
              </a>
            </li>
            <li>
              <a href={"tel:" + settingData.admin_mobile}>
                <div className="macc-list-icon">
                  <img src="/img/phone-call.png"></img>
                </div>
                <div>
                  <p className="mb-0">Call Us</p>
                  <span className="tx-color-02 tx-11">
                    Get in touch and we will be happy to help you
                  </span>
                </div>
                <i className="d-icon-angle-right"></i>
              </a>
            </li>
            <li>
              <a href={"https://wa.me/" + settingData.admin_whatsapp_no} target="new">
                <div className="macc-list-icon">
                  <img src="/img/whatsapp.png"></img>
                </div>
                <div>
                  <p className="mb-0">Whatsapp</p>
                  <span className="tx-color-02 tx-11">
                    Get in touch and we will be happy to help you
                  </span>
                </div>
                <i className="d-icon-angle-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </MobileView>
    </>
  );
}
export default HelpandSupport;
