import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import Footer from "../../Components/Footer";
import numeral from "numeral";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { ApiService } from "../../Components/Services/apiservices";
import LoginModal from "../../Components/Modals/login_modal";
import CartHeader from "../../Components/CartHeader";
import sessionCartData from "../../Components/Elements/cart_session_data";
import CouponModal from "../../Components/Modals/coupon_modal";
import Modal from "react-bootstrap/Modal";
import multiCurrency from "../../Components/Elements/multi_currrency";
function Cart() {
  const didMountRef = useRef(true);
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [setSession, SetSession] = useState("");
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const parsedCouponSession = dataArray[2];
  const cartSummary = dataArray[3];
  const [cartData, SetCartData] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleChildData = (status) => {
    setShow(status);
  };

  const [showCoupon, setShowCoupon] = useState(false);
  const handleShowCoupon = () => setShowCoupon(true);
  const handleCloseCoupon = () => setShowCoupon(false);
  const handleChildCouponData = (status) => {
    setShowCoupon(status);
  };
   
  const [CouponObject, setCouponObject] = useState({
    discount_amount: 0.0,
    promo_id: 0,
    promo_code: "",
    cart_amount: 0.0,
  });
  useEffect(() => {
    setSpinnerLoading(true);
    if (didMountRef.current) {
      SetSession(localStorage.getItem("USER_TOKEN")); 
      if (parsedCouponSession) {
        setCouponObject((prevState) => ({
          ...prevState,
          ["discount_amount"]: parsedCouponSession.discount_amount ? parsedCouponSession.discount_amount:0.00,
          ["promo_id"]: parsedCouponSession.promo_id ? parsedCouponSession.promo_id : '',
          ["promo_code"]: parsedCouponSession.promo_code ? parsedCouponSession.promo_code : '',
        }));
      }
      setTimeout(() => {
        setSpinnerLoading(false);
      }, 1000);
    }
    didMountRef.current = false;
  }, []);
  
  
  const plustocart = (productData) => {
    setSpinnerLoading(true);
    ApiService.postData("plus-to-cart", productData).then((res) => {
      if (res.status === "success") {
        let cartSession = localStorage.getItem("CART_SESSION");
        cartSession = cartSession ? JSON.parse(cartSession) : [];
        const existingProductIndex = cartSession.findIndex((item) => {
          return (
            item.product_id === productData.product_id &&
            JSON.stringify(item.product_variation) ===
              JSON.stringify(productData.product_variation)
          );
        });
        cartSession[existingProductIndex].quantity += 1;
        localStorage.setItem("CART_SESSION", JSON.stringify(cartSession)); 
        toast.success(res.message);
        setSpinnerLoading(false);
      } else {
        toast.error(res.message);
        setSpinnerLoading(false);
      }
    });
  };

  const minustocart = (productData) => {
    setSpinnerLoading(true);
    let cartSession = localStorage.getItem("CART_SESSION");
    cartSession = cartSession ? JSON.parse(cartSession) : [];
    const existingProductIndex = cartSession.findIndex((item) => {
      return (
        item.product_id === productData.product_id &&
        JSON.stringify(item.product_variation) ===
          JSON.stringify(productData.product_variation)
      );
    });

    if (existingProductIndex !== -1) {
      if (cartSession[existingProductIndex].quantity === 1) {
        cartSession.splice(existingProductIndex, 1);
      } else {
        cartSession[existingProductIndex].quantity -= 1;
      }
      localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
    } 
    setTimeout(() => {
      toast.success("Cart Updated Successfully");
      setSpinnerLoading(false);
    }, 500);
  };

  const removeProduct = (productData) => {
    setSpinnerLoading(true);
    let cartSession = localStorage.getItem("CART_SESSION");
    cartSession = cartSession ? JSON.parse(cartSession) : [];
    const existingProductIndex = cartSession.findIndex((item) => {
      return (
        item.product_id === productData.product_id &&
        JSON.stringify(item.product_variation) ===
          JSON.stringify(productData.product_variation)
      );
    });

    if (existingProductIndex !== -1) {
      cartSession.splice(existingProductIndex, 1);
      localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
    } 
    setTimeout(() => {
      toast.success("Cart Updated Successfully");
      setSpinnerLoading(false);
    }, 500);
  };
  let { itemTotal } = 0;
  let mrpValue = 0;
  let sellingPriceValue = 0;
  let discount = 0;
  const addtofavcart = (productId) =>{
    const dataString = {
      product_id: productId
    }
    setSpinnerLoading(true)
    ApiService.postData("add-to-fav-cart",dataString).then((res) => {
      if (res.data.status === "success") {
        let cartSession = localStorage.getItem("CART_SESSION");
        cartSession = cartSession ? JSON.parse(cartSession) : [];
        const existingProductIndex = cartSession.findIndex((item) => {
          return (
            item.product_id === productId
          );
        });

        if (existingProductIndex !== -1) {
          cartSession.splice(existingProductIndex, 1);
          localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
        } 
        toast.success('Moved to wishlist');
        setSpinnerLoading(false)
      }else{
        setSpinnerLoading(false)
      }
    });
  } 

  const removeCoupon = () => {
    localStorage.removeItem("COUPON_SESSION");
    window.location.reload();
  };
   
  return (
    <>
    {spinnerLoading && <SpinnerLoader />}
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
      <BrowserView>
        <section className="sec-pad">
          <div className="container">
            <div className="row">
              {parsedCartSession.length > 0 ? (

                <>
                  <div className="col-lg-8">
                    <h5>My Cart</h5>
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
                        <div className="cartsec" key={index}>
                          <div className="row g-3">
                            <div className="col-lg-3 col-3">
                              <div className="cartsec-media">
                                <img src={value.product_image} />
                              </div>
                            </div>
                            <div className="col-lg-9 col-9">
                              <h6 className="cartsec-name">
                                <a href="javascript:void(0)">{value.product_name}</a>
                              </h6>
                              <div className="cartsec-price">
                                <div className="price-new me-2">
                        {multiCurrency (value.product_selling_price)}
                        </div>
                        {/* {discount > 0 ? (
                            <>
                            <span className="product-price">
                              <del className="old-price">
                                {multiCurrency(value.product_price)}
                              </del>
                              <span className="off">{Math.round(discount)}% Off</span>
                              </span>
                            </>
                          ) : null}  */}
                        {discount > 0 ?
                                     <>
                                      <div className="price-old">

                                        {multiCurrency(value.product_price)}
                                      </div> 
                                         <span className="off" style={{color: "#388e3c",fontSize:"14px"}}>{Math.round(discount)}% Off</span>
                                        </>
                                        : null}
                              </div>
                              <div className="cartsec-footer">
                                <div className="qty-changer">
                                  <button onClick={(e) => minustocart(value)}>
                                    <i className="fas fa-minus psbmiuns"></i>
                                  </button>
                                  <span id="spanQty20">{value.quantity}</span>
                                  <button onClick={(e) => plustocart(value)}>
                                    <i className="fas fa-plus psbplus"></i>
                                  </button>
                                </div>
                                <div className="cartsec-buttongroup">
                                  <a
                                    href="javascript:void(0)"
                                    onClick={(e) => addtofavcart(value.product_id)}
                                  >
                                    <i className="fas fa-heart"></i>Move to Wishlist
                                  </a>
                                  <a
                                    href="javascript:void(0)"
                                    onClick={(e) => removeProduct(value)}
                                  >
                                    <i className="fas fa-trash"></i>Remove
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="col-lg-4">
                    <div className="panel p-4 mb-3" style={{border:'1px solid #eee'}}>
                      <div className="panel-body">
                      {setSession? 
                        parsedCouponSession.discount_amount === 0 ? (
                          <div className="applycoup-desktop" onClick={(e)=>handleShowCoupon(true)}>
                            <div className="applycoup-mobile-text">
                              <img src="/img/presents.png"></img>
                              <h6 className="mb-0 tx-12">Apply Coupon</h6>
                            </div>
                            <div className="applycoup-mobile-arrow">
                              <i className="d-icon-angle-right"></i>
                            </div>
                          </div>
                        ):(
                          <div className="applycoup-desktop" onClick={removeCoupon}>
                            <div className="applycoup-mobile-text">
                              <h6 className="mb-0 tx-12">{parsedCouponSession.promo_code} applied</h6>
                            </div>
                            <div className="applycoup-mobile-arrow">
                              <i className="fas fa-trash"></i>
                            </div>
                          </div>
                       ):
                        <div className="applycoup-desktop" onClick={handleShow}>
                          <div className="applycoup-mobile-text">
                            <img src="/img/presents.png"></img>
                            <h6 className="mb-0 tx-12">Apply Coupon</h6>
                          </div>
                          <div className="applycoup-mobile-arrow">
                            <i className="d-icon-angle-right"></i>
                          </div>
                        </div>
                      } 
                      </div>
                    </div>
                    <div className="panel p-4 mb-3" style={{border:'1px solid #eee'}}>
                      <div className="panel-header">Price Details</div>
                      <div className="panel-body">
                        <div className="pcb-list mt-3">
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
                              <span className="ml-auto tx-green">-{multiCurrency(parsedCouponSession.discount_amount)}</span>
                            </li>
                            <li> Shipping & taxes calculated at checkout</li>
                          </ul>
                        </div>
                        <hr />
                        <div className="pcb-list-second">
                          <ul>
                            <li>
                              Total Amount
                              <span className="ml-auto">
                                {multiCurrency(cartSummary.total_amount)}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <hr />
                        <p className="text-center mt-20">
                          We Accepted all Major Cards
                        </p>
                        <div className="cardlist">
                          {/* <i className="fab fa-cc-paypal"></i> */}
                          <i className="fab fa-cc-mastercard"></i>
                          <i className="fab fa-cc-discover"></i>
                          <i className="fab fa-cc-visa"></i>
                        </div>
                      </div>
                    </div>
                    {setSession ? (
                      <a
                        href="/address"
                        className="btn btn-primary btn-block btn-large"
                      >
                        Proceed to Checkout
                      </a>
                    ) : (
                      <a
                        href="javascript:void(0)"
                        className="btn btn-primary btn-block btn-large"
                        onClick={handleShow}
                      >
                        Proceed to Checkout
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <div className="noimg">
                  <img src="/img/empty-cart.webp" className="img-fluid mb-3" />
                  <h6>Your cart is empty!</h6>
                  <p>There is nothing in your cart. Let's add some items</p>
                  <a
                    href="/"
                    className="btn btn-primary-outline btn-block btn-small"
                  >
                    Continue Shopping
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </BrowserView>
      <MobileView>
        <div>
          {parsedCartSession.length > 0 ? (
            <>
              <div>
                {parsedCartSession.map((value, index) => { 
                  return (
                    <div className="cartsec" key={index}>
                      <div className="row g-3">
                        <div className="col-lg-3 col-3">
                          <div className="cartsec-media">
                            <img src={value.product_image} />
                          </div>
                        </div>
                        <div className="col-lg-9 col-9">
                          <h6 className="cartsec-name">
                            <a href="javascript:void(0)">{value.product_name}</a>
                          </h6>
                          <div className="cartsec-price">
                            <div className="price-new me-2">
                              {multiCurrency(value.product_selling_price)}
                            </div>
                            {value.product_discount >0 ?
                            <div className="price-old">
                              {multiCurrency(value.product_price)}
                            </div>
                            :null}
                          </div>
                          <div className="cartsec-footer">
                            <div className="qty-changer">
                              <button onClick={(e) => minustocart(value)}>
                                <i className="fas fa-minus psbmiuns"></i>
                              </button>
                              <span id="spanQty20">{value.quantity}</span>
                              <button onClick={(e) => plustocart(value)}>
                                <i className="fas fa-plus psbplus"></i>
                              </button>
                            </div>
                            <div className="cartsec-buttongroup">
                              <a href="javascript:void(0)" onClick={(e) => addtofavcart(value.product_id)}>
                                <i className="fas fa-heart"></i>
                                <span className="dm-none d-md-block">
                                  Move to Wishlist
                                </span>
                              </a>
                              <a href="javascript:void(0)" onClick={(e) => removeProduct(value)}>
                                <i className="fas fa-trash"></i>
                                <span className="dm-none d-md-block">
                                  Remove
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="applycoup-mobile">
                {setSession? 
                  parsedCouponSession.discount_amount === 0 ? (
                    <div className="applycoup-mobile-inner" onClick={(e)=>handleShowCoupon(true)}>
                      <div className="applycoup-mobile-text">
                        <img src="/img/presents.png"></img>
                        <h6 className="mb-0 tx-12">Apply Coupon</h6>
                      </div>
                      <div className="applycoup-mobile-arrow">
                        <i className="d-icon-angle-right"></i>
                      </div>
                    </div>
                  ):(
                    <div className="applycoup-mobile-inner" onClick={removeCoupon}>
                      <div className="applycoup-mobile-text">
                        <h6 className="mb-0 tx-12">{parsedCouponSession.promo_code} applied</h6>
                      </div>
                      <div className="applycoup-mobile-arrow">
                        <i className="fas fa-trash"></i>
                      </div>
                    </div>
                  ):
                  <div className="applycoup-mobile-inner" onClick={handleShow}>
                    <div className="applycoup-mobile-text">
                      <img src="/img/presents.png"></img>
                      <h6 className="mb-0 tx-12">Apply Coupon</h6>
                    </div>
                    <div className="applycoup-mobile-arrow">
                      <i className="d-icon-angle-right"></i>
                    </div>
                  </div>
                } 
              </div>
              <div className="panel checkoutlist">
                <div className="panel-header">Price Details</div>
                <div className="panel-body">
                  <div className="pcb-list mt-2">
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
                        <span className="ml-auto tx-green">-{multiCurrency(parsedCouponSession.discount_amount)}</span>
                      </li>
                      <li> Shipping & taxes calculated at checkout</li>
                    </ul>
                  </div>
                  <hr />
                  <div className="pcb-list-second">
                    <ul>
                      <li>
                        Total Amount
                        <span className="ml-auto">
                          {multiCurrency(cartSummary.total_amount)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <hr />
                  <p className="text-center mt-20">
                    We Accepted all Major Cards
                  </p>
                  <div className="cardlist">
                    {/* <i className="fab fa-cc-paypal"></i> */}
                    <i className="fab fa-cc-mastercard"></i>
                    <i className="fab fa-cc-discover"></i>
                    <i className="fab fa-cc-visa"></i>
                  </div>
                </div>
              </div>
              <div className="footer-checkout">
                {setSession ? (
                  <a
                    href="/address"
                    className="btn btn-primary btn-block btn-large"
                  >
                    Proceed to Checkout
                  </a>
                ) : (
                  <a
                    href="javascript:void(0)"
                    className="btn btn-primary btn-block btn-large"
                    onClick={handleShow}
                  >
                    Proceed to Checkout
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="noimg">
              <img src="/img/empty-cart.webp" className="img-fluid mb-3" />
              <h6>Your cart is empty!</h6>
              <p>There is nothing in your cart. Let's add some items</p>
              <a href="/" className="btn btn-primary-outline btn-medium">
                Continue Shopping
              </a>
            </div>
          )}
        </div>
      </MobileView>
      {show && <LoginModal showmodal={show} onChildData={handleChildData} />}
      <Modal show={showCoupon} onHide={handleCloseCoupon} className="couponModal">
        {showCoupon && <CouponModal 
        showCouponmodal={showCoupon}
        onChildCouponData={handleChildCouponData}/>}
          
      </Modal>
    </>
  );
}
export default Cart;
