import React, { useEffect, useState, useRef } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { validEmail, validNumber } from "../../Components/Elements/Regex";
import { ApiService } from "../../Components/Services/apiservices";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import Alert from "react-bootstrap/Alert";
import { Col, FormLabel, Row } from "react-bootstrap";
function AddressModal({ showmodal, onChildData, countryData, EditAddrData=null }) {
  const didMountRef = useRef(true);
  const [show, setShow] = useState(showmodal);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSignup, setshowSignup] = useState(false);
  const [showSignin, setshowSignin] = useState(true);
  const [spinnerLoading, setspinnerLoading] = useState(false);
  const [statesData, setstatesData] = useState([]);
  const [cityData, setcityData] = useState([]);

  const [userAddressDetails, setUserAddressDetails] = useState({
          ua_id: 0,
          ua_name: "",
          ua_email: "",
          ua_mobile: "",
          ua_pincode: "",
          ua_house_no: "",
          ua_area: "",
          ua_state_name: "",
          ua_city_name: "",
          ua_address_type: "",
          ua_address_type_other: "",
          ua_state_id: "",
          ua_city_id: "",
          ua_default_address: "",
          ua_country_id: "",
  });

  const handleClose = () => {
    setShow(false);
    onChildData(false);
  };
  useEffect(() => {
    if (didMountRef.current) {
      getStateData();
        getallcityData();
      if(EditAddrData)
      {
          setUserAddressDetails({
            ua_id: EditAddrData.ua_id,
            ua_name: EditAddrData.ua_name,
            ua_email: "",
            ua_mobile: EditAddrData.ua_mobile,
            ua_pincode: EditAddrData.ua_pincode,
            ua_house_no: EditAddrData.ua_house_no,
            ua_area: EditAddrData.ua_area,
            ua_state_name: EditAddrData.ua_state_name,
            ua_city_name: EditAddrData.ua_city_name,
            ua_address_type: EditAddrData.ua_address_type,
            ua_address_type_other: EditAddrData.ua_address_type_other,
            ua_state_id: EditAddrData.ua_state_id,
            ua_city_id: EditAddrData.ua_city_id,
            ua_default_address: EditAddrData.ua_default_address,
            ua_country_id: EditAddrData.ua_country_id,
          });
        }else{
          setUserAddressDetails({
            ua_id: 0,
            ua_name: "",
            ua_email: "",
            ua_mobile: "",
            ua_pincode: "",
            ua_house_no: "",
            ua_area: "",
            ua_state_name: "",
            ua_city_name: "",
            ua_address_type: "",
            ua_address_type_other: "",
            ua_state_id: "",
            ua_city_id: "",
            ua_default_address: "",
            ua_country_id: "",
          });
        }
        

    }
    didMountRef.current = false;
  }, []);


  const getStateData = () => {
    ApiService.fetchData("get-states-data").then((res) => {
      if (res.status == "success") {
        setstatesData(res.data);
      }
    });
  }; 

  const getallcityData = () => {
    ApiService.fetchData("getallcitydata").then((res) => {
      if (res.status == "success") {
        setcityData(res.data);
      }
    });
  }; 

  const onTodoRegChange = (e) => {
    const { name, value } = e.target;
    setUserAddressDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if(name === 'ua_country_id'){
      if(value === '101'){
        getStateData();
        getallcityData();
      }
    }
      if(name === 'ua_state_id'){
        getcityData(value);
    }
    if(name === 'ua_pincode'){
      if(value.length === 6 && userAddressDetails.ua_country_id == '101'){
        checkPincode(value)
      }else{

      }
    }
  };

    const getcityData = (value) =>{
    const dataString = {
      stateid: value
    }
    ApiService.postData("get-city-data", dataString).then(
      (res) => {
        if (res.status == "success") {
          setcityData(res.data)
        }
      }
    );
  }

  const checkPincode = (value) =>{
    const dataString = {
      pincode: value
    }
    setspinnerLoading(true);
    ApiService.postData("check-pincode", dataString).then(
      (res) => {
        if (res.status == "success") {
          setUserAddressDetails(prevState => ({
            ...prevState,
            ua_state_id: res.data.pin_state_id,
            ua_city_id: res.data.pin_city_id
          }));
          setspinnerLoading(false);
        } else {
          setUserAddressDetails(prevState => ({
            ...prevState,
            ua_state_id: "",
            ua_city_id: ""
          }));
          setspinnerLoading(false);
        }
      }
    );
  }

  const handleAddressProcess = () => {
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
      if(userAddressDetails.ua_state_id == "" && userAddressDetails.ua_country_id == "101"){
        setErrorMessage('Plese Select State');
        return false;
      }else if(userAddressDetails.ua_state_name == "" && userAddressDetails.ua_country_id != "101"){
        setErrorMessage('Plese Enter State');
        return false;
      }
      else{
        setErrorMessage("");
      }
      if(userAddressDetails.ua_city_id == "" && userAddressDetails.ua_country_id == "101"){
        setErrorMessage('Plese Select City');
        return false;
      }else if(userAddressDetails.ua_city_name == "" && userAddressDetails.ua_country_id != "101"){
        setErrorMessage('Plese Enter City');
        return false;
      }
      else{
        setErrorMessage("");
      }
      setspinnerLoading(true);
      ApiService.postData("user-address-process", userAddressDetails).then(
        (res) => {
          if (res.status == "success") {
            setSuccessMessage(res.message);
            setspinnerLoading(false);
            window.location.reload();
          } else {
            setErrorMessage(res.message);
            setspinnerLoading(false);
          }
        }
      );
    }
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} className="addressModal">
        {spinnerLoading && <SpinnerLoader />}
        <button onClick={handleClose} className="pop-close "></button>
        <Modal.Body>
          <div className="mb-3 addressModal-header">
            <h5 className="tx-theme mb-1">Add New Address</h5>
            <p className="tx-color-02 tx-12">
              Add your home and office addresses and enjoy faster checkout
            </p>
          </div>
         
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <div className='row g-3'>
          <div className='col-lg-6'>
          <div className="form-group-white">
            <label>Full Name</label>
            <input
                  type="text"
                  name="ua_name"
                  className="form-control required"
                  value={userAddressDetails.ua_name}
                  onChange={(e) => onTodoRegChange(e)}
                />
          </div>
          </div>
          <div className='col-lg-6'>
          <div className="form-group-white">
            <label>Mobile Number</label>
            <input
                  type="number"
                  name="ua_mobile"
                  className="form-control required"
                  value={userAddressDetails.ua_mobile}
                  onChange={(e) => onTodoRegChange(e)}
                  
                />
            </div>
          </div>
          <div className='col-lg-6 col-6'>
          <div className="form-group-white">
            <label>Country</label>
            <select name="ua_country_id"className="form-control required" value={userAddressDetails.ua_country_id} onChange={(e) => onTodoRegChange(e)}>
                <option value="">Select Country</option>
                {countryData.map((value)=>(  
                  <option value={value.country_id}>{value.country_name}</option>   
                ))}
                </select> 
            </div>
          </div>
          <div className='col-lg-6 col-6'>
          <div className="form-group-white">
          <label>Postcode</label>
          <input
                  type="number"
                  name="ua_pincode"
                  className="form-control required"
                  value={userAddressDetails.ua_pincode}
                  onChange={(e) => onTodoRegChange(e)}
                />
            </div>
            </div>
            <div className='col-lg-6 col-6'>
          <div className="form-group-white">
          <label>State</label>
          {userAddressDetails && (userAddressDetails.ua_country_id === '101' || userAddressDetails.ua_country_id === 101)?
                <select name="ua_state_id" className="form-control ua_state_id" value={userAddressDetails.ua_state_id} onChange={(e) => onTodoRegChange(e)}>
                <option value="">Select State</option>
                {statesData.length>0 && statesData.map((value)=>(  
                  <option value={value.state_id}>{value.state_name}</option>   
                ))}
                </select> 
                :
                <input
                  type="text"
                  name="ua_state_name"
                  className="form-control ua_state_name"
                  value={userAddressDetails.ua_state_name}
                  onChange={(e) => onTodoRegChange(e)}
                  placeholder="State"
                />
              }
          </div>
          </div>
          <div className='col-lg-6 col-6'>
          <div className="form-group-white">
          <label>City</label>
          {userAddressDetails && (userAddressDetails.ua_country_id === '101' || userAddressDetails.ua_country_id === 101)?
                <select name="ua_city_id" className="form-control ua_city_id" value={userAddressDetails.ua_city_id} onChange={(e) => onTodoRegChange(e)}>
                <option value="">Select City</option>
                {cityData.length>0 && cityData.map((value)=>(  
                  <option value={value.cities_id}>{value.cities_name}</option>   
                ))}
                </select> 
                :
                <input
                  type="text"
                  name="ua_city_name"
                  className="form-control ua_city_name"
                  value={userAddressDetails.ua_city_name}
                  onChange={(e) => onTodoRegChange(e)}
                  placeholder="City"
                />
                }
            </div>
            </div>
            <div className='col-lg-6 col-6'>
          <div className="form-group-white">
          <label>House No, Building Name</label>
                <input
                  type="text"
                  name="ua_house_no"
                  className="form-control required"
                  value={userAddressDetails.ua_house_no}
                  onChange={(e) => onTodoRegChange(e)}
                  
                />
            </div>
            </div>
            <div className='col-lg-6 col-6'>
          <div className="form-group-white">
          <label>Road Name, Area, Colony</label>
                <input
                  type="text"
                  name="ua_area"
                  className="form-control required"
                  value={userAddressDetails.ua_area}
                  onChange={(e) => onTodoRegChange(e)}
                />
            </div>
            </div>
            <div className='col-lg-12'>
          <div className="form-group-white">
          <label>Address Type</label>
                <select name="ua_address_type"className="form-control required" value={userAddressDetails.ua_address_type} onChange={(e) => onTodoRegChange(e)}>
                  <option value="">Select</option>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select> 
            </div>
            </div>
            {userAddressDetails.ua_address_type === 'Other'? 
            <div className='col-lg-12'>
          <div className="form-group-white">
                <input
                  type="text"
                  name="ua_address_type_other"
                  className="form-control required"
                  value={userAddressDetails.ua_address_type_other}
                  onChange={(e) => onTodoRegChange(e)}
                  placeholder="Enter name"
                />
            </div>
            </div>
             : null
            }
            <div className='col-lg-12'>
          <div className="form-group-white">
          <input
                  type="checkbox"
                  name="ua_default_address"
                  value="1"
                  checked={userAddressDetails.ua_default_address == '1' ?true:false}
                  onChange={(e) => onTodoRegChange(e)}
                />
                <label className='ms-2'>Set default address</label>
            </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-primary-outline btn-block btn-medium' onClick={handleClose}>
            Cancel
          </Button>
          <Button className='btn btn-primary btn-block btn-medium' onClick={handleAddressProcess}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default AddressModal;
