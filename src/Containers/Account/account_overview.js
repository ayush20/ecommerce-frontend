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
function AccountOverview() {
  const didMountRef = useRef(true);
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const [rowUserData, setRowUserData] = useState({});
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const navigate = useNavigate();
  const logoutUser = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      ApiService.fetchData("logout-user").then((res) => {
        localStorage.removeItem("USER_TOKEN");
        navigate("/");
      });
    }
  };
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
        localStorage.removeItem("USER_TOKEN");
        setSpinnerLoading(false);
        navigate("/");
      }
    });
  };
  const redirectTo = (Route) => {
    navigate(Route);
  };
  return (
    <>
      {spinnerLoading && <SpinnerLoader />}
      <BrowserView>
      
        <Header state="inner-header" cartCount={parsedCartSession.length}/>
        <main className="main">
          <div className="subheader">
            <Container>
              <Row>
                <Col lg={12}>
                  <Breadcrumb className="breadcrumb-inner">
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>Account Overview</Breadcrumb.Item>
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
                        <h4>Account Overview</h4>
                      </div>
                      <div className="acpanel-body">
                        <div className="row mb-3">
                          <div className="col-lg-4">
                            <a href="/account/profile" className="aobox">
                            <img src="/img/account/profile.png" className="mb-3" />
                              <h6>Profile</h6>
                              <p className="mb-0">Manage your account information</p>
                            </a>
                          </div>
                          <div className="col-lg-4">
                            <a href="/account/address" className="aobox">
                            <img src="/img/account/pin.png" className="mb-3" />
                              <h6>Address</h6>
                              <p className="mb-0">Saved addresses for hassle-free checkout</p>
                            </a>
                          </div>
                          <div className="col-lg-4">
                            <a href="/account/orders" className="aobox">
                            <img src="/img/account/order.png" className="mb-3" />
                              <h6>My Orders</h6>
                              <p className="mb-0">Check your order status</p>
                            </a>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-4">
                            <a href="/account/wishlist" className="aobox">
                            <img src="/img/account/wishlist.png" className="mb-3" />
                              <h6>My Wishlist</h6>
                              <p className="mb-0">Your most loved products here</p>
                            </a>
                          </div>
                          <div className="col-lg-4">
                            <a href="/account/change-password" className="aobox">
                            <img src="/img/account/changepassword.png" className="mb-3" />
                              <h6>Change Password</h6>
                              <p className="mb-0">Keep your account secure</p>
                            </a>
                          </div>
                          <div className="col-lg-4">
                            <a href="/account/help-and-support" className="aobox">
                            <img src="/img/account/helpsupport.png" className="mb-3" />
                              <h6>Help & Support</h6>
                              <p className="mb-0">Help regarding recent purchase & other</p>
                            </a>
                          </div>
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
        <MobileHeader PageName="My Account" Route="" cartCount={parsedCartSession.length}/>
        <main className="main">
          <div className="macc-profile">
            <div className="macc-img"><img src="/img/user.png"/></div>
            <div className="macc-content">
              <a href="/account/profile">
                <h6 className="mb-0">Hi! {rowUserData.user_fname}</h6>
                <p className="mb-0"> {rowUserData.user_email}</p>
              </a>
            </div>
            <i className="d-icon-angle-right"></i>
          </div>
          <div className="macc-list">
            <ul>
              <li onClick={() => redirectTo("/account/orders")}>
                <div className="macc-list-icon">
                  <img src="/img/cart.png" />
                </div>
                <div>
                  <p className="mb-0">Your Orders</p>
                  <span className="tx-color-02 tx-11">
                    Check your order status
                  </span>
                </div>
              
                <i className="d-icon-angle-right"></i>
              </li>
              <li onClick={() => redirectTo("/account/address")}>
                <div className="macc-list-icon">
                  <img src="/img/address.png" />
                </div>
                <div>
                  <p className="mb-0"> Address Book</p>
                  <span className="tx-color-02 tx-11">
                  Saved addresses for hassle-free checkout
                  </span>
                </div>
               
                <i className="d-icon-angle-right"></i>
              </li>
              <li onClick={() => redirectTo("/account/wishlist")}>
                <div className="macc-list-icon">
                  <img src="/img/love.png" />
                </div>
                <div>
                  <p className="mb-0">Collections & Wishlist</p>
                  <span className="tx-color-02 tx-11">
                  Your most loved products here
                  </span>
                </div>
                
                <i className="d-icon-angle-right"></i>
              </li>
            </ul>
          </div>
          <div className="macc-list mb-2">
            <ul>
              <li onClick={() => redirectTo("/account/help-and-support")}>
                <div className="macc-list-icon">
                  <img src="/img/support.png" />
                </div>
                <div>
                  <p className="mb-0">Help & Support</p>
                  <span className="tx-color-02 tx-11">
                  Help regarding recent purchase & other
                  </span>
                </div>
                
                <i className="d-icon-angle-right"></i>
              </li>
              <li onClick={() => redirectTo("/account/about-us")}>
                <div className="macc-list-icon">
                  <img src="/img/information.png" />
                </div>
                <div>
                  <p className="mb-0"> About Us</p>
                  <span className="tx-color-02 tx-11">
                  Policies, terms of use etc
                  </span>
                </div>
               
                <i className="d-icon-angle-right"></i>
              </li>
              <li onClick={() => redirectTo("/account/change-password")}>
                <div className="macc-list-icon">
                  <img src="/img/changepassword.png" />
                </div>
                Change Password
                <i className="d-icon-angle-right"></i>
              </li>
            </ul>
          </div>
          <div className="logout-button mb-3">
            <button
              className="btn btn-primary-outline  btn-medium"
              onClick={logoutUser}
            >
              Logout From Momabatti
            </button>
          </div>
          <div className="text-center">
            <a href="/">
            <img src="/img/logo.png" className="logout-logo" />
            </a>
          </div>
        </main>
      </MobileView>
    </>
  );
}
export default AccountOverview;
