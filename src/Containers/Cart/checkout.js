import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import Form from 'react-bootstrap/Form';
import Accordion from "react-bootstrap/Accordion";
import Footer from "../../Components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { ApiService } from "../../Components/Services/apiservices";
import CartHeader from "../../Components/CartHeader";
import sessionCartData from "../../Components/Elements/cart_session_data";
import { Link, useNavigate, useLocation } from "react-router-dom";
import constant from "../../Components/Services/constant";
import multiCurrency from "../../Components/Elements/multi_currrency";
import CouponModal from "../../Components/Modals/coupon_modal";
import Modal from "react-bootstrap/Modal";
import numeral from "numeral";
function CartCheckout() {
  const didMountRef = useRef(true);
  const Navigate = useNavigate();
  const dataArray = sessionCartData();
  const [setSession, SetSession] = useState("");
  const parsedAddressSession = dataArray[0];
  const parsedCartSession = dataArray[1];
  const parsedCouponSession = dataArray[2];
  const cartSummary = dataArray[3];
  const [settingData, setSettingData] = useState({});
  const [shippingRateData, setShippingRateData] = useState({});
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("0");
  const [shippingCharge, setShippingCharge] = useState(0);
  const [shippingData, setShippingData] = useState({});
  useEffect(() => {
    if (didMountRef.current) {
      SetSession(localStorage.getItem("USER_TOKEN"));
      getuserData()
      getSettingsData()

    }
    didMountRef.current = false;
  }, []);

  const getSettingsData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status === "success") {
        setSettingData(res.sitesettings);
        setShippingRateData(res.shippingRateData);

        if (res.sitesettings.admin_cod_status === 1) {
          setPaymentMethod('upi')
          calculateShippingAmount('1')
        } else {
          setPaymentMethod('credit-debit')
          calculateShippingAmount('0')
        }

      }
    });
  };

  const calculateShippingAmount = (paymentType) => {
    const dataString = {
      itemtotal: cartSummary.total_amount,
      ua_id: parsedAddressSession.ua_id,
      cart_data: parsedCartSession,
      payment_type: paymentType,
      payment_type_admin: settingData.admin_cod_status
    };

    ApiService.postData("calculate-shipping-amount", dataString).then((res) => {
      if (res.status === "success") {
        setShippingCharge(res.shipping_amount);
        setShippingData(res.shipping_data)
        setSpinnerLoading(false);
      }
    });
  };

  const selectpaymentMode = (mode) => {
    setPaymentMethod(mode)
    if (mode === 'COD') {
      setPaymentType('1')
      setSpinnerLoading(true)
      calculateShippingAmount('1')
    } else {
      setPaymentType('0')
      setSpinnerLoading(true)
      calculateShippingAmount('0')
    }
  };

  const getuserData = () => {
    ApiService.fetchData("get-user-data").then((res) => {
      if (res.status == "success") {
        setSpinnerLoading(false);
      } else {
        localStorage.removeItem("USER_TOKEN");
        setSpinnerLoading(false);
        Navigate("/");
      }
    });
  };

  const choutOutProccess = () => {
    if ((cartSummary.total_amount + shippingCharge) <= settingData.admin_min_order) {
      toast.error('Minimum Order Value is ₹' + settingData.admin_min_order)
      return;
    }
    if (paymentMethod === '') {
      toast.error('Please select Payment Method')
      return;
    }
    if (paymentMethod !== 'COD') {
      if (settingData.admin_payment_active === 0) {
      } if (settingData.admin_payment_active === 1) {
      } if (settingData.admin_payment_active === 2) {
        payumoney()
      } else {

      }
    } else {
      const dataString = {
        cartSummary: cartSummary,
        parsedAddressSession: parsedAddressSession,
        parsedCartSession: parsedCartSession,
        parsedCouponSession: parsedCouponSession,
        paymentMethod: paymentMethod,
        shippingCharge: shippingCharge,
        currencyData: {},
        shippingData: shippingData,
        textarea: textarea
      };
      setSpinnerLoading(true)
      ApiService.postData("makecodorder", dataString).then((res) => {
        if (res.status === "success") {
          localStorage.removeItem("CART_SESSION")
          localStorage.removeItem("ADDRESS_SESSION")
          localStorage.removeItem("COUPON_SESSION")
          //localStorage.setItem("TRANS_ID", res.order_number);
          Navigate('/thankyou/' + res.order_number)
        } else {
          setSpinnerLoading(false)
        }
      });
    }

  }; 

  const payumoney = () => {
    const dataString = {
      cartSummary: cartSummary,
      parsedAddressSession: parsedAddressSession,
      parsedCartSession: parsedCartSession,
      parsedCouponSession: parsedCouponSession,
      paymentMethod: paymentMethod,
      shippingCharge: shippingCharge,
      currencyData: {},
      shippingData: shippingData,
      textarea: textarea
    };
    setSpinnerLoading(true)
    ApiService.postData("initiatePayUMoney", dataString).then((res) => {
      if (res.status === "success") {
        window.location.href = res.production_url;
        setSpinnerLoading(false)
      } else {
        setSpinnerLoading(false)
      }
    });
  } 
  let { itemTotal } = 0;
  let mrpValue = 0;
  let sellingPriceValue = 0;
  let discount = 0;
  const [textarea, setTextarea] = useState('');

  const handleChangeTextarea = (event) => {
    setTextarea(event.target.value);
  };

  const [showCoupon, setShowCoupon] = useState(false);
  const handleShowCoupon = () => setShowCoupon(true);
  const handleCloseCoupon = () => setShowCoupon(false);
  const handleChildCouponData = (status) => {
    setShowCoupon(status);
  };
  const removeCoupon = () => {
    localStorage.removeItem("COUPON_SESSION");
    window.location.reload();
  };
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}

        draggable

        theme="light"
      />

      <CartHeader />
      {spinnerLoading && <SpinnerLoader />}
      <BrowserView>
        <main>
          <div className="page-content mt-5 mb-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-8">
                  <div className="address-checkout mb-3">
                    <a href="/address" className="change-address">
                      Change
                    </a>
                    <h6>Shipping and Billing Address</h6>
                    <p style={{ marginBottom: "3px", fontWeight: "600" }}>
                      {parsedAddressSession.ua_name} (
                      {parsedAddressSession.ua_address_type == "Other"
                        ? parsedAddressSession.ua_address_type_other
                        : parsedAddressSession.ua_address_type}
                      )
                    </p>
                    <p className="address-full" style={{ marginBottom: "3px" }}>
                      Mobile No: {parsedAddressSession.ua_mobile}
                    </p>
                    <div className="address-full">
                      {parsedAddressSession.ua_house_no}, {parsedAddressSession.ua_area},
                      {parsedAddressSession.ua_city_name}, {parsedAddressSession.ua_state_name}
                      {parsedAddressSession.ua_pincode}
                    </div>
                  </div>
                  <Accordion defaultActiveKey={['0', '2']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">Order Summary</h6>
                      </Accordion.Header>
                      <Accordion.Body>
                        {parsedCartSession.map((value, index) => {

                              itemTotal = parsedCartSession.reduce(
                              (total, value) =>
                              total + value.product_selling_price * value.quantity,
                              0
                              );

                              mrpValue = parseFloat(value.product_price);
                              sellingPriceValue = parseFloat(
                              value.product_selling_price
                              );
                              if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                              discount = ((mrpValue - sellingPriceValue) / mrpValue) * 100;
                              discount = discount.toFixed(2);
                              }
                          return (
                            <div className="cartsec mt-0" key={index}>
                              <div className="row g-3">
                                <div className="col-lg-2 col-3">
                                  <div className="cartsec-media">
                                    <img src={value.product_image} />
                                  </div>
                                </div>
                                <div className="col-lg-9 col-9">
                                  <h6 className="cartsec-name">
                                    <a href="#" className="mycartbox-title">
                                      {value.product_name}
                                    </a>
                                  </h6>
                                  <div className="cartsec-price">
                                    <div className="price-new me-2">

                                      {multiCurrency(
                                        value.product_selling_price
                                      )}
                                    </div>
                                    {discount > 0 ?
                                     <>
                                      <div className="price-old">

                                        {multiCurrency(value.product_price)}
                                      </div> 
                                         <span className="off" style={{color: "#388e3c",fontSize:"14px"}}>{Math.round(discount)}% Off</span>
                                        </>
                                        : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">Order Note</h6>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="order-notetextarea">
                          <textarea name="textarea" className="form-control" placeholder="How can we help you?" value={textarea}
                            onChange={handleChangeTextarea} />
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item
                      eventKey="2"
                      className="checkout-accord"
                    >
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">Payment Method</h6>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="payment-option-list">
                          <ul>
                            {settingData.admin_cod_status === 1 ?
                             <li>
                             <img src="/img/phonepe.png" />
                             PhonePe/Gogle Pay/BHIM UPI
                             <Form.Check
                               className="ml-auto"
                               name="payment_method"
                               type="radio"
                               value="upi"
                               onChange={(e) => selectpaymentMode('upi')}
                               checked={paymentMethod == 'upi' ? true : false}
                             />
                           </li>
                              // <li>
                              //   <img src="/img/delivery.png" />
                              //   Cash On Delivery
                              //   <Form.Check
                              //     className="ml-auto"
                              //     name="payment_method"
                              //     type="radio"
                              //     value="COD"
                              //     onChange={(e) => selectpaymentMode('COD')}
                              //     checked={paymentMethod == 'COD' ? true : false}
                              //   />
                              // </li>
                              : null}
                            {settingData.admin_payment_active === 2 ?
                              <>
                                <li>
                                  <img src="/img/creditcard.png" />
                                  Credit/Debit Card
                                  <Form.Check
                                    className="ml-auto"
                                    name="payment_method"
                                    type="radio"
                                    value="credit-debit"
                                    onChange={(e) => selectpaymentMode('credit-debit')}
                                    checked={paymentMethod == 'credit-debit' ? true : false}
                                  />
                                </li>
                                {/* <li>
                                  <img src="/img/phonepe.png" />
                                  PhonePe/Gogle Pay/BHIM UPI
                                  <Form.Check
                                    className="ml-auto"
                                    name="payment_method"
                                    type="radio"
                                    value="upi"
                                    onChange={(e) => selectpaymentMode('upi')}
                                  />
                                </li> */}
                                <li>
                                  <img src="/img/paytm.png" />
                                  Paytm/Payzapp/Wallets
                                  <Form.Check
                                    className="ml-auto"
                                    name="payment_method"
                                    type="radio"
                                    value="wallet"
                                    onChange={(e) => selectpaymentMode('wallet')}
                                  />
                                </li>
                                <li>
                                  <img src="/img/netbanking.png" />
                                  Netbanking
                                  <Form.Check
                                    className="ml-auto"
                                    name="payment_method"
                                    type="radio"
                                    value="netbanking"
                                    onChange={(e) => selectpaymentMode('netbanking')}
                                  />
                                </li>
                                <li>
                                <img src="/img/delivery.png" />
                                Cash On Delivery
                                <Form.Check
                                  className="ml-auto"
                                  name="payment_method"
                                  type="radio"
                                  value="COD"
                                  onChange={(e) => selectpaymentMode('COD')}
                                
                                />
                              </li>
                              </>
                              : null
                            }
                          </ul>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
                <div className="col-lg-4">
                  <div className="panel p-4 mb-3" style={{ border: '1px solid #eee' }}>
                    <div className="panel-body">
                      {setSession ?
                        parsedCouponSession.discount_amount === 0 ? (
                          <div className="applycoup-desktop" onClick={(e) => handleShowCoupon(true)}>
                            <div className="applycoup-mobile-text">
                              <img src="/img/presents.png"></img>
                              <h6 className="mb-0 tx-12">Apply Coupon</h6>
                            </div>
                            <div className="applycoup-mobile-arrow">
                              <i className="d-icon-angle-right"></i>
                            </div>
                          </div>
                        ) : (
                          <div className="applycoup-desktop" onClick={removeCoupon}>
                            <div className="applycoup-mobile-text">
                              <h6 className="mb-0 tx-12">{parsedCouponSession.promo_code} applied</h6>
                            </div>
                            <div className="applycoup-mobile-arrow">
                              <i className="fas fa-trash"></i>
                            </div>
                          </div>
                        ) : null
                      }
                    </div>
                  </div>
                  <div className="panel p-4 mb-3" style={{ border: '1px solid #eee' }}>
                    <div className="panel-header">Price Details</div>
                    <div className="pcb-list mb-4">
                      <ul>
                        <li>
                          Item Total
                          <span className="ml-auto">
                            {multiCurrency(cartSummary.itemTotal)}
                          </span>
                        </li>
                        <li>
                          Discount
                          <span className="ml-auto tx-green">
                            -{multiCurrency(cartSummary.discount)}
                          </span>
                        </li>
                        <li>
                          Coupon Discount
                          <span className="ml-auto tx-green">
                            -
                            {multiCurrency(parsedCouponSession.discount_amount)}
                          </span>
                        </li>
                        <li>
                          Shipping Charge
                          <span className="ml-auto" id="shippingAmount">
                            {multiCurrency(shippingCharge)}
                          </span>
                        </li>

                      </ul>
                    </div>
                    <hr />
                    <div className="pcb-list-second">
                      <ul>
                        <li>
                          Total Amount
                          <span className="ml-auto" id="finalTotal">
                            {multiCurrency(cartSummary.total_amount + shippingCharge)}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <hr />
                    <p className="text-center mt-20">
                      We Accepted all Major Cards
                    </p>
                    <div className="cardlist">
                      <i className="fab fa-cc-paypal"></i>
                      <i className="fab fa-cc-mastercard"></i>
                      <i className="fab fa-cc-discover"></i>
                      <i className="fab fa-cc-visa"></i>
                    </div>
                  </div>
                  <a
                    href="javascript:void(0);"
                    className="btn btn-primary btn-block btn-large"
                    onClick={choutOutProccess}
                  >
                    Proceed to Checkout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </BrowserView>
      <MobileView>
        <div className="address-checkout">
          <a
            href="/address"
            className="change-address"
          >
            Change
          </a>
          <h6>Delivery Address</h6>
          <p style={{ marginBottom: "3px", fontWeight: "600" }}>
            {parsedAddressSession.ua_name} (
            {parsedAddressSession.ua_address_type == "Other"
              ? parsedAddressSession.ua_address_type_other
              : parsedAddressSession.ua_address_type}
            )
          </p>
          <p className="address-full" style={{ marginBottom: "3px" }}>
            Mobile No: {parsedAddressSession.ua_mobile}
          </p>
          <div className="address-full">
            {parsedAddressSession.ua_house_no}, {parsedAddressSession.ua_area},
            {parsedAddressSession.ua_city_name}, {parsedAddressSession.ua_state_name}
            {parsedAddressSession.ua_pincode}
          </div>
        </div>
        <Accordion defaultActiveKey={['2']} alwaysOpen>
          <Accordion.Item eventKey="0" className="checkout-accord">
            <Accordion.Header>

              <h6 className="mb-0 tx-14">Order Summary</h6>
            </Accordion.Header>
            <Accordion.Body>
              {parsedCartSession.map((value, index) => {
                return (
                  <div className="cartsec mt-0" key={index}>
                    <div className="row g-3">
                      <div className="col-lg-2 col-3">
                        <div className="cartsec-media">
                          <img src={value.product_image} />
                        </div>
                      </div>
                      <div className="col-lg-9 col-9">
                        <h6 className="cartsec-name">
                          <a href="#" className="mycartbox-title">
                            {value.product_name}
                          </a>
                        </h6>
                        <div className="cartsec-price">
                          <div className="price-new me-2">

                            {multiCurrency(value.product_selling_price)}
                          </div>
                          <div className="price-old">
                            {multiCurrency(value.product_price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className="checkout-accord">
            <Accordion.Header>
              <h6 className="mb-0 tx-14">Order Note</h6>
            </Accordion.Header>
            <Accordion.Body>
              <div className="order-notetextarea">
                <textarea name="textarea" className="form-control" placeholder="How can we help you?" value={textarea}
                  onChange={handleChangeTextarea} />
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className="checkout-accord">
            <Accordion.Header>
              <h6 className="mb-0 tx-14">Payment Method</h6>
            </Accordion.Header>
            <Accordion.Body>
              <div className="payment-option-list">
                <ul>
                  {settingData.admin_cod_status === 1 ?
                    <li>
                      <img src="/img/delivery.png" />
                      Cash On Delivery
                      <Form.Check
                        className="ml-auto"
                        name="payment_method"
                        type="radio"
                        value="COD"
                        onChange={(e) => selectpaymentMode('COD')}
                        checked={paymentMethod == 'COD' ? true : false}
                      />
                    </li>
                    : null}
                  {settingData.admin_payment_active === 2 ?
                    <>
                      <li>
                        <img src="/img/creditcard.png" />
                        Credit/Debit Card
                        <Form.Check
                          className="ml-auto"
                          name="payment_method"
                          type="radio"
                          value="credit-debit"
                          onChange={(e) => selectpaymentMode('credit-debit')}
                          checked={paymentMethod == 'credit-debit' ? true : false}
                        />
                      </li>
                      <li>
                        <img src="/img/phonepe.png" />
                        PhonePe/Gogle Pay/BHIM UPI
                        <Form.Check
                          className="ml-auto"
                          name="payment_method"
                          type="radio"
                          value="upi"
                          onChange={(e) => selectpaymentMode('upi')}
                        />
                      </li>
                      <li>
                        <img src="/img/paytm.png" />
                        Paytm/Payzapp/Wallets
                        <Form.Check
                          className="ml-auto"
                          name="payment_method"
                          type="radio"
                          value="wallet"
                          onChange={(e) => selectpaymentMode('wallet')}
                        />
                      </li>
                      <li>
                        <img src="/img/netbanking.png" />
                        Netbanking
                        <Form.Check
                          className="ml-auto"
                          name="payment_method"
                          type="radio"
                          value="netbanking"
                          onChange={(e) => selectpaymentMode('netbanking')}
                        />
                      </li>
                    </>
                    : null
                  }
                </ul>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div className="panel checkoutlist">
          <div className="panel-header">Price Details</div>
          <div className="pcb-list mb-4">
            <ul>
              <li>
                Item Total
                <span className="ml-auto">
                  {multiCurrency(cartSummary.itemTotal)}
                </span>
              </li>
              <li>
                Discount
                <span className="ml-auto tx-green">
                  -{multiCurrency(cartSummary.discount)}
                </span>
              </li>
              <li>
                Coupon Discount
                <span className="ml-auto tx-green">
                  -{multiCurrency(parsedCouponSession.discount_amount)}
                </span>
              </li>
              <li>
                Shipping Charge
                <span className="ml-auto" id="shippingAmount">
                  {multiCurrency(shippingCharge)}
                </span>
              </li>
            </ul>
          </div>
          <hr />
          <div className="pcb-list-second">
            <ul>
              <li>
                Total Amount
                <span className="ml-auto" id="finalTotal">
                  {multiCurrency(cartSummary.total_amount + shippingCharge)}
                </span>
              </li>
            </ul>
          </div>
          <hr />
          <p className="text-center mt-20">We Accepted all Major Cards</p>
          <div className="cardlist">
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-discover"></i>
            <i className="fab fa-cc-visa"></i>
          </div>
        </div>
        <div className="footer-checkout">
          <a
            href="javascript:void(0);"
            className="btn btn-primary btn-block btn-large"
            onClick={choutOutProccess}
          >
            Proceed to Checkout
          </a>
        </div>
      </MobileView>
      <Modal show={showCoupon} onHide={handleCloseCoupon} className="couponModal">
        {showCoupon && <CouponModal
          showCouponmodal={showCoupon}
          onChildCouponData={handleChildCouponData} />}
      </Modal>
    </>
  );
}
export default CartCheckout;
