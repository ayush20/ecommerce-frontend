import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/Services/apiservices";
import { BrowserView, MobileView } from "react-device-detect";
import AccountSidebar from "./account_sidebar";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../../Components/Elements/mobile_header";
import sessionCartData from "../../Components/Elements/cart_session_data";
function Account() {
  const didMountRef = useRef(true);
  const [rowUserData, setRowUserData] = useState({});
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const navigate = useNavigate();
  useEffect(() => {
    if (didMountRef.current) {
      getuserData();
    }
    didMountRef.current = false;
  }, []);
  const getuserData = () => {
    ApiService.fetchData("get-user-data").then((res) => {
      if (res.status == "success") {
        setRowUserData(res.rowUserData);
        setSpinnerLoading(false);
      } else {
        localStorage.removeItem("USER_TOKEN")
        setSpinnerLoading(false);
        navigate("/");
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
                    <Breadcrumb.Item href="/">Library</Breadcrumb.Item>
                    <Breadcrumb.Item active>Data</Breadcrumb.Item>
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
                        <h4>My Account</h4>
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
        <MobileHeader PageName=" My Account" Route="" cartCount={parsedCartSession.length}/>

        <main className="main">
          <div className="macc-profile mb-2">
            <div className="macc-img"></div>

            <div className="macc-content">
              <a href="/profile">
                <p className="mb-0">Hello</p>
                <h6 className="mb-0">{rowUserData.user_fname}</h6>
              </a>
            </div>
            <i className="d-icon-angle-right"></i>
          </div>
          <div className="macc-list mb-2">
            <ul>
              <li>
                <a href="/account/orders">
                  <div className="macc-list-icon">
                    <img src="img/cart.png" />
                  </div>
                  Your Orders
                  <i className="d-icon-angle-right"></i>
                </a>
              </li>
              <li>
                <a href="/account/address">
                  <div className="macc-list-icon">
                    <img src="img/address.png" />
                  </div>
                  Address Book
                  <i className="d-icon-angle-right"></i>
                </a>
              </li>
              <li>
                <a href="/account/wishlist">
                  <div className="macc-list-icon">
                    <img src="img/love.png" />
                  </div>
                  Collections & Wishlist
                  <i className="d-icon-angle-right"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="macc-list mb-2">
            <ul>
              <li>
                <a href="/account/help-and-support">
                  <div className="macc-list-icon">
                    <img src="img/cart.png" />
                  </div>
                  Help & Support
                  <i className="d-icon-angle-right"></i>
                </a>
              </li>
              <li>
                <a href="/account/about-us">
                  <div className="macc-list-icon">
                    <img src="/img/information.png" />
                  </div>
                  About Us
                  <i className="d-icon-angle-right"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="logout-button">Logout</div>
        </main>
   
      </MobileView>
    </>
  );
}
export default Account;
