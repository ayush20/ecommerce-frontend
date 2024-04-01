import React, { useEffect, useState, useRef } from "react";
import { validEmail, validNumber } from "../../Components/Elements/Regex";
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
import Alert from "react-bootstrap/Alert";
import sessionCartData from "../../Components/Elements/cart_session_data";
function ChangePassword() {
  const didMountRef = useRef(true);
  const [rowUserData, setRowUserData] = useState({});
  const [passwordData, setPasswordData] = useState({new_password:'',confirm_password:''});
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
        localStorage.removeItem("USER_TOKEN");
        setSpinnerLoading(false);
        navigate("/");
      }
    });
  };

  const onTodoChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateProfile = () => {
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
      if (passwordData.new_password === "") {
        setErrorMessage("Please enter New Password");
        return false;
      } 
      if (passwordData.confirm_password === "") {
        setErrorMessage("Please enter Confirm Password");
        return false;
      } 
      if (passwordData.new_password !== passwordData.confirm_password) {
        setErrorMessage("New Password and Confirm Password did not matched !!");
        return false;
      }  
      setSpinnerLoading(true);
      ApiService.postData("update-password", passwordData).then((res) => {
        if (res.status === "success") {
          setSuccessMessage(res.message);
          setSpinnerLoading(false);
        } else {
          setErrorMessage(res.message);
          setSpinnerLoading(false);
        }
      });
    }
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
                    <Breadcrumb.Item active>Change Password</Breadcrumb.Item>
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
                    {errorMessage && (
                      <Alert variant="danger">{errorMessage}</Alert>
                    )}
                    {successMessage && (
                      <Alert variant="success">{successMessage}</Alert>
                    )}
                    <div className="acpanel">
                      <div className="acpanel-header">
                        <h4>Change Password</h4>
                      </div>
                      <div className="acpanel-body">
                        <div className="row">
                            <div className="col-lg-6"> 
                                <div className="form-group-dark mb-3">
                                <label htmlFor="user_fname">New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    className="form-control required"
                                    value={passwordData.new_password}
                                    placeholder="New Password"
                                    onChange={(e) => onTodoChange(e)}
                                />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-group-dark mb-3">
                                    <label htmlFor="user_fname">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        className="form-control required"
                                        value={passwordData.confirm_password}
                                        placeholder="Confirm Password"
                                        onChange={(e) => onTodoChange(e)}
                                    />
                                </div>
                            </div> 
                            <div className="col-lg-6">
                                <button
                                className="btn btn-primary btn-medium"
                                type="button"
                                name="submit"
                                onClick={handleUpdateProfile}
                                >
                                Update
                                </button>
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
        <MobileHeader PageName="Change Password" Route="account/account-overview" cartCount={parsedCartSession.length}/>
          <div className="p-3">
            <div className="row">
              <div className="col-lg-12">
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <div className="form-group-dark mb-3">
                  <label htmlFor="user_fname">New Password</label>
                  <input
                    type="password"
                    name="new_password"
                    className="form-control required"
                    value={passwordData.new_password}
                    placeholder="New Password"
                    onChange={(e) => onTodoChange(e)}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group-dark mb-3">
                    <label htmlFor="user_fname">Confirm Password</label>
                    <input
                        type="password"
                        name="confirm_password"
                        className="form-control required"
                        value={passwordData.confirm_password}
                        placeholder="Confirm Password"
                        onChange={(e) => onTodoChange(e)}
                    />
                </div>
              </div> 
              <div className="col-lg-6">
                <button
                  className="btn btn-primary btn-block btn-large"
                  type="button"
                  name="submit"
                  onClick={handleUpdateProfile}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        
      </MobileView>
    </>
  );
}
export default ChangePassword;
