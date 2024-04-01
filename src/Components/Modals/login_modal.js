import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { validEmail, validNumber } from '../../Components/Elements/Regex';
import { ApiService } from "../../Components/Services/apiservices";
import SpinnerLoader from '../../Components/Elements/spinner_loader';
import Alert from 'react-bootstrap/Alert';
function LoginModal({showmodal,onChildData}) {
  const didMountRef = useRef(true);

  const [show, setShow] = useState(showmodal);
  const [countryData, setCountryData] = useState([]);
  const [settingData, setSettingData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSignup, setshowSignup] = useState(false);
  const [showSignin, setshowSignin] = useState(true);
  const [showForgetPassword, setshowForgetPassword] = useState(false);
  const [spinnerLoading, setspinnerLoading] = useState(false);
  const [showcountrycodes, setshowcountrycodes] = useState(false);
  const [userLoginDetails, setUserLoginDetails] = useState({ 
    user_email: "",
    user_password: "",
  }); 
  const [countryCodeValue ,setCountryCodeValue] = useState(91)
  const [ForgotSuccess ,setForgotSuccess] = useState(false)

  useEffect(() => {
    getCountryData();
    getSettingsData();


    didMountRef.current = false;
  }, []);

  const getSettingsData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
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
  const [userRegDetails, setUserRegDetails] = useState({ 
    user_fname: "",
    user_email: "",
    user_mobile: "",
    user_password: ""
  }); 
  const [userForgetPasswordDetail , setUserForgetPasswordDetail] = useState({user_fpname:""})

  const handleClose = () =>{
    setShow(false)
    onChildData(false)
    setSuccessMessage("");
    setUserLoginDetails({user_email:''})
    setshowSignin(true);
    setForgotSuccess(false);
  }  

  const onTodoChange = (e) => {
    const { name, value } = e.target;
    setUserLoginDetails((prevState) => ({
      ...prevState,
      [name]: value,
    })); 

  };
  // const onForgetPasswordTodoChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserLoginDetails((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   })); 
  // };
  const userForgotPassword = () => {
    setErrorMessage("");
    if (!userLoginDetails.user_email) {
      setErrorMessage("Please Enter Email Id.");
      return false;
    }
    setspinnerLoading(true);

    ApiService.postData('forgotpassword',userLoginDetails).then((res) => {
      if (res.status === "success") {
        setSuccessMessage(res.message);
        setspinnerLoading(false);
        setshowForgetPassword(false);
        setForgotSuccess(true);

          // window.location.reload();
      }else{
        setErrorMessage(res.message)
        setspinnerLoading(false)
      }
    });
  }

  const userLoginProcess = () => {
    let counter = 0;
    const myElements = document.getElementsByClassName("loginRequired");
    for (let i = 0; i < myElements.length; i++) {
      if (myElements[i].value === '') {
        myElements[i].style.border = '1px solid red';
        counter++;
      } else {
    
        myElements[i].style.border = '';
      }
    }
  
    if (counter === 0) {
      setErrorMessage("");
      if (!validEmail.test(userLoginDetails.user_email)) {
        setErrorMessage("Please enter valid Email Id");
        return false;
      }   
      setspinnerLoading(true)
      ApiService.postData('user-login-process',userLoginDetails).then((res) => {
        if (res.status === "success") {
          localStorage.setItem("USER_TOKEN",res.user_token)
          setSuccessMessage(res.message)
          setspinnerLoading(false) 
          window.location.reload();
        }else{
          setErrorMessage(res.message)
          setspinnerLoading(false)
        }
      });
    } 
  };

  const showSignUp = () =>{
    setshowSignup(true)
    setshowSignin(false)
    setshowForgetPassword(false)
    setErrorMessage('')
    setSuccessMessage('')
    setUserRegDetails({user_fname: "",user_email: "",user_mobile: "",user_password: ""});
    setUserLoginDetails({user_email: "",user_password: ""});
  }

  const showSignIn = () =>{
    setshowSignup(false)
    setshowSignin(true)
    setshowForgetPassword(false)
    setErrorMessage('')
    setSuccessMessage('')
    setUserRegDetails({user_fname: "",user_email: "",user_mobile: "",user_password: ""});
    setUserLoginDetails({user_email: "",user_password: ""});
  }
  const showForgetPasswordscreen = ()=>{
    setshowSignup(false)
    setshowSignin(false)
    setshowForgetPassword(true)
  }
  const onTodoRegChange = (e) => {
    const { name, value } = e.target;
    setUserRegDetails((prevState) => ({
      ...prevState,
      [name]: value,
    })); 
  };

  const userRegisterProcess = () => {
    let counter = 0;
    const myElements = document.getElementsByClassName("registerRequired");
    for (let i = 0; i < myElements.length; i++) {
      if (myElements[i].value === '') {
        myElements[i].style.border = '1px solid red';
        counter++;
      } else {
        myElements[i].style.border = '';
      }
    }
    if (counter === 0) {
      setErrorMessage("");
      if (userRegDetails.user_fname === '') {
        setErrorMessage("Please enter Full Name");
        return false;
      }else if (userRegDetails.user_email === '') {
        setErrorMessage("Please enter Email Id");
        return false;
      }else if (!validEmail.test(userRegDetails.user_email)) {
        setErrorMessage("Please enter valid Email Id");
        return false;
      }else if (userRegDetails.user_mobile === "") {
        setErrorMessage("Please enter Mobile Number");
        return false;
      } else if (!validNumber.test(userRegDetails.user_mobile)) {
        setErrorMessage("Please enter valid Mobile Number");
        return false;
      } else if (userRegDetails.user_password === '') {
        setErrorMessage("Please enter Password");
        return false;
      }  
      setspinnerLoading(true)
      const dataString={
        "user_fname":userRegDetails.user_fname,
        "user_email":userRegDetails.user_email,
        "user_mobile":userRegDetails.user_mobile,
        "user_password":userRegDetails.user_password,
        "user_country_code":countryCodeValue
      }
      ApiService.postData('user-register-process', dataString).then((res) => {
        if (res.status === "success") {
          localStorage.setItem("USER_TOKEN",res.user_token)
          setSuccessMessage(res.message)
          setspinnerLoading(false)
          //handleClose()
          window.location.reload();
        }else{
          setErrorMessage(res.message)
          setspinnerLoading(false)
        }
      });
    }
  };

  

  return (
    <> 
      <Modal show={show} onHide={handleClose} className="lrpop">
        {spinnerLoading && (<SpinnerLoader />)}  
        <button onClick={handleClose} className="pop-close"><i className="d-icon-times"></i></button>
        <Modal.Body>
        {showSignin && (
          <>
            <div className="text-center mb-3">
              <h5 className="tx-theme">Login with {settingData.site_title}</h5>
              <p className="tx-color-02">
                For Better Experience, Order tracking & Regular updates
              </p>
            </div>
            {errorMessage && (<Alert variant="danger">{errorMessage}</Alert>)}
            {successMessage && (<Alert variant="success">{successMessage}</Alert>)}
            <div className="form-group mb-3">
              <input
                type="text"
                name="user_email"
                className="form-control loginRequired"
                value={userLoginDetails.user_email}
                onChange={(e) => onTodoChange(e)}
                placeholder="Email Address"
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="password"
                name="user_password"
                className="form-control loginRequired"
                placeholder="Password"
                value={userLoginDetails.user_password}
                onChange={(e) => onTodoChange(e)}
              />
            </div>
            <div className="d-grid mb-4">
              <Button className="btn-primary btn01" onClick={userLoginProcess}>Login</Button>
            </div>
            <div className="mb-3 text-center">
              <a href="#" className="tx-theme" onClick={showForgetPasswordscreen}>
                Forgot Password?
              </a>
            </div>
            <p className="text-center">
              Don't have an account? <a href="#" onClick={showSignUp} className="tx-theme">Sign Up</a>
            </p>
          </>
          )}
          {showSignup && (
          <>
            <div className="text-center mb-3">
              <h5 className="tx-theme">Register with {settingData.site_title}</h5>
              <p className="tx-color-02">
                For Better Experience, Order tracking & Regular updates
              </p>
            </div>
            {errorMessage && (<Alert variant="danger">{errorMessage}</Alert>)}
            {successMessage && (<Alert variant="success">{successMessage}</Alert>)}
            <div className="form-group mb-3">
              <input
                type="text"
                name="user_fname"
                className="form-control registerRequired"
                value={userRegDetails.user_fname}
                onChange={(e) => onTodoRegChange(e)}
                placeholder="Full Name"
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                name="user_email"
                className="form-control registerRequired"
                value={userRegDetails.user_email}
                onChange={(e) => onTodoRegChange(e)}
                placeholder="Email Address"
              />
            </div>
            <div className="form-group country-input mb-3">
              <input
                type="number"
                name="user_mobile"
                className="form-control registerRequired"
                value={userRegDetails.user_mobile}
                onChange={(e) => onTodoRegChange(e)}
                placeholder="Mobile Number"
              />
 
              <span className="country-code" >+{countryCodeValue}</span>
   
            </div>
           
            {showcountrycodes?
             <div className="country-list">
              <div className="country-list-header">
                <h6>Choose Country</h6>
                <button className="pop-close " onClick={(e)=>setshowcountrycodes(false)} ></button>
              </div>
            <ul>
            {countryData.map((value)=>(  
                <li style={{color:"black" , cursor:"pointer"}}   
                onClick={(e) => {
                  setCountryCodeValue(value.country_phonecode);
                  setshowcountrycodes(false);
                }}
                >+{value.country_phonecode}<span>{value.country_name}</span></li>))}
            </ul></div>:''}
            
            <div className="form-group mb-3">
              <input
                type="password"
                name="user_password"
                className="form-control registerRequired"
                placeholder="Password"
                value={userRegDetails.user_password}
                onChange={(e) => onTodoRegChange(e)}
              />
            </div>
            <div className="d-grid mb-3">
              <Button className="btn-primary btn01" onClick={userRegisterProcess}>Register</Button>
            </div> 
            <p className="text-center tx-12 tx-color-03">By continuing I agree with the <a href="/privacy-policy" className="tx-theme">Privacy Policy</a> and <a href="/terms-of-service" className="tx-theme">Terms & Conditions</a></p>
            <p className="text-center">
              Already have an account? <a href="#" onClick={showSignIn} className="tx-theme">Sign In</a>
            </p>
          </>
          )}

      {showForgetPassword && (
          <>
            <div className="text-center mb-3">
              <img src="/img/forgot.png" className="wd-150" alt="" />
              <h5 className="tx-theme">Forget Password </h5>
              <p className="tx-color-02">
               Please Enter your registerd email Id
              </p>
            </div>
            {errorMessage && (<Alert variant="danger">{errorMessage}</Alert>)}
            {successMessage && (<Alert variant="success">{successMessage}</Alert>)}
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control loginRequired"
                name="user_email"
                onChange={(e) => onTodoChange(e)}
                placeholder="Email Address"
              />
            </div>
            <div className="d-grid mb-4">
              <Button className="btn-primary btn01" onClick={userForgotPassword}>Submit</Button>
            </div>
            <p className="text-center">
              Already have an account? <a href="#" onClick={showSignIn} className="tx-theme">Sign In</a>
            </p>
            
          </>
          )}
          {ForgotSuccess && (
          <>
            <div className="text-center mb-3">
              <img src="/img/forgot.jpg" className="fluid" style={{width:'100%'}}/>
              <h5 className="tx-theme">Request Successfully Sent</h5>
              <p className="tx-color-02">
              {successMessage}
              </p>
            </div>           
          </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
export default LoginModal;
