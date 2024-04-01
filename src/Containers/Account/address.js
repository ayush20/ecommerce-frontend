import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/Services/apiservices";
import { BrowserView, MobileView } from "react-device-detect";
import AccountSidebar from "./account_sidebar";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../../Components/Elements/mobile_header";
import AddressModal from "../../Components/Modals/address_modal";
import sessionCartData from "../../Components/Elements/cart_session_data";
function Address() {
  const didMountRef = useRef(true);
  const [rowUserData, setRowUserData] = useState({});
  const [resUserAddress, setResUserAddress] = useState([]);
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [countryData, setCountryData] = useState([]);
  const [EditAddrData, setEditAddrData] = useState();
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleShow = () => setShow(true);
  const handleChildData = (status) => {
    setShow(status);
  };
  useEffect(() => {
    if (didMountRef.current) {
      getuserData();
      getUserAddress();
      getCountryData();
    }
    didMountRef.current = false;
  }, []);

  const getuserData = () => {
    ApiService.fetchData("get-user-data").then((res) => {
      if (res.status === "success") {
        setRowUserData(res.rowUserData);
        setSpinnerLoading(false);
      } else {
        localStorage.removeItem("USER_TOKEN");
        setSpinnerLoading(false);
        navigate("/");
      }
    });
  };
  const getUserAddress = () => {
    ApiService.fetchData("get-user-address").then((res) => {
      if (res.status === "success") {
        setResUserAddress(res.resUserAddress);
        setSpinnerLoading(false);
      }
    });
  };

  const getCountryData = () => {
    ApiService.fetchData("get-country").then((res) => {
      if (res.status == "success") {
        setCountryData(res.data);
      }
    });
  };

  const deleteaddress = (value) => {
    if (window.confirm("Are you sure?")) {
      const dataString = {
        addrid: value,
      };
      ApiService.postData("removeAddress", dataString).then((res) => {
        if (res.status == "success") {
          getUserAddress();
          // setcityData(res.data)
        }
      });
    } else {
    }
  };

  const editaddress = (value) => {
    const dataString = {
      addrid: value,
    };
    ApiService.postData("editAddress", dataString).then((res) => {
      if (res.status == "success") {
        setEditAddrData(res.data);
        handleShow();
      }
    });
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
                    <Breadcrumb.Item active>My Address</Breadcrumb.Item>
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
                        <h4>My Address</h4>
                      </div>
                      {spinnerLoading === false?
                      <div className="acpanel-body">
                        {resUserAddress.length > 0 ? (
                          <>
                            <div className="row">
                              {resUserAddress.map((value, index) => (
                                <div className="col-lg-6" key={index}>
                                  <div className="addressbox mb-2">
                                    <div className="addressbox-body">
                                      <h6 className="mb-1 tx-13">
                                        {value.ua_name}{" "}
                                        {value.ua_default_address == 1
                                          ? "(Default)"
                                          : ""}
                                      </h6>
                                      <p className="mb-1 tx-13">
                                        {value.ua_house_no}, {value.ua_area},{" "}
                                        {value.ua_city_name},{" "}
                                        {value.ua_state_name} {value.ua_pincode}
                                      </p>
                                      <p className="mb-0 tx-13">
                                        Mobile No: {value.ua_mobile}
                                      </p>
                                      <div className="addressbox-type">
                                        {value.ua_address_type == "Other"
                                          ? value.ua_address_type_other
                                          : value.ua_address_type}
                                      </div>
                                    </div>
                                    <div className="addressbox-footer">
                                      <a
                                        href="#"
                                        onClick={(e) =>
                                          editaddress(value.ua_id)
                                        }
                                      >
                                        Edit
                                      </a>
                                      <a
                                        href="#"
                                        onClick={(e) =>
                                          deleteaddress(value.ua_id)
                                        }
                                      >
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <Button
                              className="btn btn-primary-outline btn-medium mt-2"
                              onClick={() => {
                                setEditAddrData([]);
                                handleShow();
                              }}
                            >
                              Add New Address
                            </Button>
                          </>
                        ) : (
                          <div className="noimg text-center">
                            <img
                              src="/img/noaddress.png"
                              style={{ width: "250px" }}
                              className="mb-3"
                            />
                            <h6>Save Your Address Now!</h6>
                            <p>
                              Add your home and office addresses and enjoy
                              faster checkout
                            </p>
                            <Button
                              className="btn btn-primary-outline btn-medium btn01"
                              onClick={handleShow}
                            >
                              Add New Address
                            </Button>
                          </div>
                        )}
                      </div>
                      :null}
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
          PageName="Address Book"
          Route="account/account-overview"
          cartCount={parsedCartSession.length}
        />
        {spinnerLoading === false?
        <main className="main">
        <div className="maddress-header">My Address</div>
        {resUserAddress.length > 0 ? (
          resUserAddress.map((value, index) => (
            <div className="maddressbox">
              <div className="maddressbox-body">
                <h6 className="mb-1 tx-13">
                  {value.ua_name}{" "}
                  {value.ua_default_address == 1 ? "(Default)" : ""}
                </h6>
                <p className="mb-1 tx-13">
                  {value.ua_house_no}, {value.ua_area}, {value.ua_city_name},{" "}
                  {value.ua_state_name} {value.ua_pincode}
                </p>
                <p className="mb-0 tx-13">Mobile No: {value.ua_mobile}</p>
                <div className="maddressbox-type">
                  {value.ua_address_type == "Other"
                    ? value.ua_address_type_other
                    : value.ua_address_type}
                </div>
              </div>
              <div className="maddressbox-footer">
                <a href="#" onClick={(e) => editaddress(value.ua_id)}>
                  Edit
                </a>
                <a href="#" onClick={(e) => deleteaddress(value.ua_id)}>
                  Delete
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="noimg text-center">
            <img
              src="/img/noaddress.png"
              style={{ width: "250px" }}
              className="mb-3"
            />
            <h6>Save Your Address Now!</h6>
            <p>
              Add your home and office addresses and enjoy faster checkout
            </p>
            <Button
              className="btn btn-primary-outline btn-medium btn01"
              onClick={() => {
                setEditAddrData([]);
                handleShow();
              }}
            >
              Add New Address
            </Button>
          </div>
        )}
        {resUserAddress.length > 0 ? (
          <div className="maddress-footer">
            <Button
              className="btn btn-primary-outline btn-medium btn-block"
              onClick={() => {
                setEditAddrData([]);
                handleShow();
              }}
            >
              Add New Address
            </Button>
          </div>
        ) : (
          ""
        )}
      </main>:null}
        
      </MobileView>
      {show && (
        <AddressModal
          showmodal={show}
          onChildData={handleChildData}
          countryData={countryData}
          EditAddrData={EditAddrData}
        />
      )}
    </>
  );
}
export default Address;
