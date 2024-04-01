import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import numeral from "numeral";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { ApiService } from "../../Components/Services/apiservices";
import AddressModal from "../../Components/Modals/address_modal";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import CartHeader from "../../Components/CartHeader";
function CartAddress() {
  const didMountRef = useRef(true);
  const navigate = useNavigate();
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [setSession, SetSession] = useState("");
  const [resUserAddress, setResUserAddress] = useState([]);
  const [cartData, SetCartData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [EditAddrData, setEditAddrData] = useState({});
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleChildData = (status) => {
    setShow(status);
  };
  const [CouponObject, setCouponObject] = useState({
    discount_amount: 0.0,
    promo_id: 0,
    promo_code: "",
    cart_amount: 0.0,
  });
  let { itemTotal } = 0;
  let { discount } = 0;
  let { total_Amount } = 0;
  useEffect(() => {
    setSpinnerLoading(true);
    if (didMountRef.current) {
      SetSession(localStorage.getItem("USER_TOKEN"));
      let cartSession = localStorage.getItem("CART_SESSION");
      cartSession = cartSession ? JSON.parse(cartSession) : [];
      SetCartData(cartSession);
      getUserAddress();
      getCountryData();
      let couponSession = localStorage.getItem("COUPON_SESSION");
      couponSession = couponSession ? JSON.parse(couponSession) : [];
      if (couponSession) {
        setCouponObject((prevState) => ({
          ...prevState,
          ["discount_amount"]: couponSession.discount_amount,
          ["promo_id"]: couponSession.promo_id,
          ["promo_code"]: couponSession.promo_code,
        }));
      }
    }
    didMountRef.current = false;
  }, []);
  const getUserAddress = () => {
    ApiService.fetchData("get-user-address").then((res) => {
      if (res.status === "success") {
        if(res.resUserAddress.length === 0){
          setShow(true)
        } 
        setResUserAddress(res.resUserAddress);
        setSpinnerLoading(false);
      } else {
        localStorage.removeItem("USER_TOKEN");
        setSpinnerLoading(false);
        navigate("/");
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
  const onTodoCouponChange = (e) => {
    const { name, value } = e.target;
    setCouponObject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const applyCouponProcess = () => {
    if (CouponObject.promo_code === "") {
      setErrorMessage("Please enter Coupon Code");
      return false;
    }
    setSpinnerLoading(true);
    const dataString = {
      promo_code: CouponObject.promo_code,
      cart_total: itemTotal,
    };
    ApiService.postData("select-coupon", dataString).then((res) => {
      if (res.data.status === "success") {
        localStorage.removeItem("COUPON_SESSION");
        const couponSessionObj = {
          discount_amount: res.data.discount_amount,
          promo_id: res.data.promo_id,
          promo_code: res.data.promo_code,
        };
        localStorage.setItem(
          "COUPON_SESSION",
          JSON.stringify(couponSessionObj)
        );
        setCouponObject((prevState) => ({
          ...prevState,
          ["discount_amount"]: res.data.discount_amount,
          ["promo_id"]: res.data.promo_id,
          ["promo_code"]: res.data.promo_code,
        }));
        setSuccessMessage(res.data.notification);
        setSpinnerLoading(false);
      } else {
        setErrorMessage(res.data.notification);
        setSpinnerLoading(false);
      }
    });
  };
  const removeCoupon = () => {
    localStorage.removeItem("COUPON_SESSION");
    window.location.reload();
  };

  const checkAvailibility = (addressData) => {
    setSpinnerLoading(true);
    ApiService.fetchData("get-user-address",addressData).then((res) => {
        if (res.status === "success") {
            localStorage.removeItem("ADDRESS_SESSION");
            setTimeout(() => {
              localStorage.setItem("ADDRESS_SESSION", JSON.stringify(addressData));
              navigate("/checkout");
            }, 1000);
        } else {
          setSpinnerLoading(false);
          toast.error(res.notification);
        }
      });
    
  };

  const gotocheckout = () => {
    let addressSession = localStorage.getItem("ADDRESS_SESSION");
    addressSession = addressSession ? JSON.parse(addressSession) : null;
    if (addressSession !== null && resUserAddress.length > 0) {
      navigate("/checkout");
    } else {
      localStorage.removeItem("ADDRESS_SESSION");
      toast.error("Please select Address");
    }
  };
  return (
    <>
      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false}  draggable  theme="light" />

      {cartData.map((value, index) => {
        itemTotal = cartData.reduce(
          (total, value) => total + value.product_price * value.quantity,
          0
        );
        discount = cartData.reduce(
          (total, value) =>
            total +
            (value.product_price - value.product_selling_price) *
              value.quantity,
          0
        );
        total_Amount =
          Number(itemTotal) -
          Number(discount) -
          Number(CouponObject.discount_amount);
      })}
      {spinnerLoading && <SpinnerLoader />}
      <BrowserView>
        <CartHeader /> 
        <main>
          <div className="page-content mt-5 mb-5">
            <div className="container">
              <div className="col-lg-12">
              <h5 className="text-center">Select a delivery address</h5>
              {resUserAddress.length > 0 ? (
                <>
              <div className="row justify-content-md-center">
              {resUserAddress.map((value, index) => (
               <div className="col-lg-4" key={index}>
                    <div
                      className="addresscard save-address save-address-checkout"
                      onClick={(e) => checkAvailibility(value)}
                    >
                      <span className="save-address-check"></span>
                      <h6 className="mb-1 tx-13">
                      {value.ua_name}  
                        <span className="ms-1">
                        {value.ua_default_address === 1
                            ? "(Default)"
                            : ""}
                        </span>
                        
                      </h6>
                      <span className="addresscard-type">
                      {value.ua_address_type === "Other"
                          ? value.ua_address_type_other
                          : value.ua_address_type}
                        </span>
                      <p className="mb-1 address-full">
                        {value.ua_house_no}, {value.ua_area},
                        
                      </p>
                      <p className="mb-1 tx-12">{value.ua_city_name}, {value.ua_state_name}
                        {value.ua_pincode}</p>
                      <p className="mb-0 tx-12">Mobile No: +91-{value.ua_mobile}</p>
                    </div>
                  </div>
              ))}
               </div>
              <div className="row justify-content-md-center text-center mt-4">
                <div className="col-lg-12">
                  <div className="addressbutton">
                    <a
                      href="#"
                      className="btn btn-primary-outline btn-medium"
                      onClick={handleShow}
                    >
                      Add New Address
                    </a>
                  </div>
                </div>
              </div>
              </>
          ) : (

            <div className="noimg">
                <img
                  src="/img/noaddress.png"
                 
                />
                <h5>Save Your Address Now!</h5>
                <p>
                  Add your home and office addresses and enjoy faster checkout
                </p>
                <a
                  href="#"
                  className="btn  btn-primary-outline btn-medium"
                  onClick={handleShow}
                >
                  Add New Address
                </a>
              </div>
         )}
              </div>
              
            </div>
          </div>
        </main> 
        <Footer />
      </BrowserView>
      <MobileView>
      <CartHeader /> 
   
              <div className="col-lg-12">
            
              {resUserAddress.length > 0 ? (
                <>
             
              {resUserAddress.map((value, index) => (
               <div key={index}>
                    <div
                      className="addresscard save-address save-address-checkout"
                      onClick={(e) => checkAvailibility(value)}
                    >
                      <span className="save-address-check"></span>
                      <h6 className="mb-1 tx-13">
                        {value.ua_name} 
                        <span className="ms-1">
                        {value.ua_default_address === 1
                            ? "(Default)"
                            : ""}
                        </span>
                        
                      </h6>
                      <span className="addresscard-type">
                      {value.ua_address_type === "Other"
                          ? value.ua_address_type_other
                          : value.ua_address_type}
                        </span>
                      <p className="mb-1 address-full">
                        {value.ua_house_no}, {value.ua_area},
                        
                      </p>
                      <p className="mb-1 tx-12">{value.ua_city_name}, {value.ua_state_name}
                        {value.ua_pincode}</p>
                      <p className="mb-0 tx-12">Mobile No: +91-{value.ua_mobile} </p>
                    </div>
                  </div>
              ))}
              
            
                  <div className="addressbutton">
                    <a
                      href="#"
                      className="btn btn-primary-outline btn-block btn-large"
                      onClick={handleShow}
                    >
                      Add New Address
                    </a>
                  </div>
                
              </>
          ) : (

            <div className="noimg">
                <img
                  src="/img/noaddress.png"
                 
                />
                <h5>Save Your Address Now!</h5>
                <p>
                  Add your home and office addresses and enjoy faster checkout
                </p>
                <a
                  href="#"
                  className="btn  btn-primary-outline btn-medium"
                  onClick={handleShow}
                >
                  Add New Address
                </a>
              </div>
         )}
              </div>
              
          
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
export default CartAddress;
