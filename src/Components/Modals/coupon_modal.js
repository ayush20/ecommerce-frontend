import React, { useEffect, useState, useRef } from "react";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { ApiService } from "../../Components/Services/apiservices";
import Alert from "react-bootstrap/Alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function CouponModal({ showCouponmodal,onChildCouponData }) {
  const didMountRef = useRef(true); 
  const [showCart, setShowCart] = useState(showCouponmodal);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [setSession, SetSession] = useState("");
  const [cartData, SetCartData] = useState([]);
  const [couponData, setCouponData] = useState([]);
  
  let { itemTotal } = 0;
  let { discount } = 0;
  let { total_Amount } = 0;
  const [CouponObject, setCouponObject] = useState({
    discount_amount: 0.0,
    promo_id: 0,
    promo_code: "",
    cart_amount: 0.0,
  });
  useEffect(() => {
    if (didMountRef.current) {
        getCouponData()
        let cartSession = localStorage.getItem("CART_SESSION");
        cartSession = cartSession ? JSON.parse(cartSession) : [];
        SetCartData(cartSession);
    }
    didMountRef.current = false;
  }, []);
  const handleClose = () =>{
    onChildCouponData(false)
  }   

  const getCouponData = () => {
    setSpinnerLoading(true)
    ApiService.fetchData("coupons-list").then((res) => {
      if (res.status === "success") {
        setCouponData(res.resCouponsData);
        setSpinnerLoading(false)
      }else{
        setSpinnerLoading(true)
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
    setSuccessMessage('')
    setErrorMessage('')
    if (CouponObject.promo_code === '') {
      setErrorMessage("Please enter Coupon Code");
      return false;
    }
    setSpinnerLoading(true);
    const dataString = {
      promo_code: CouponObject.promo_code,
      cart_total: total_Amount,
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
        setSuccessMessage(res.data.notification)
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
      } else {
        setErrorMessage(res.data.notification);
        setSpinnerLoading(false);
      }
    });
  }; 
  const handleCopyClick = async (copyText) => {
    setSpinnerLoading(true);
    const dataString = {
      promo_code: copyText,
      cart_total: total_Amount,
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
        setSuccessMessage(res.data.notification)
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
      } else {
        setErrorMessage(res.data.notification);
        setSpinnerLoading(false);
      }
    });
    /* try {
      await navigator.clipboard.writeText(copyText);
      toast.success('Coupon Copied!!')
    } catch (error) {
      console.error('Failed to copy: ', error);
    } */
  };
  return (
    <> 
    {spinnerLoading && <SpinnerLoader />}
    {cartData.map((value, index) => {
        itemTotal = cartData.reduce(
        (total, value) =>
            total + value.product_price * value.quantity,
        0
        );
        discount = cartData.reduce(
        (total, value) =>
            total +
            (value.product_price - value.product_selling_price) *
            value.quantity,
        0
        );
        total_Amount = Number(itemTotal) - Number(discount);
        console.log("total_Amount",total_Amount);
    })}
    <div className="couponModal-section">
      <div className="couponModal-header">
      <h6>Apply Coupons</h6>
      <button className="pop-close" onClick={handleClose}></button>
      </div>
      <div className="couponModal-search">
      <input type="text" placeholder="Enter Coupon Code" name="promo_code" value={CouponObject.promo_code} onChange={(e) => onTodoCouponChange(e)}/><button className="lmc-apply" onClick={applyCouponProcess}>Apply</button>
      </div>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && (<Alert variant="success">{successMessage}</Alert>)}
       
            <div className="apply-coupons-list">
            <ul>
                {couponData.map((valueCoupon,index) =>{
                    return (
                    <li key={index}>
                        <div className="aclbox">
                          <div className="aclbox-coupon">{valueCoupon.promo_coupon_code}</div>
                          <div className="aclbox-desc">{valueCoupon.promo_description}</div>
                           <div className="aclbox-apply" onClick={(e)=>handleCopyClick(valueCoupon.promo_coupon_code)}>Apply</div>
                           
                        </div>
                    </li> 
                    )
                    
                })}
                
            </ul>
        </div>
    </div>
    </>
  );
}
export default CouponModal;
