import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../Components/Services/apiservices";
import { useNavigate,useParams } from "react-router-dom";
import FeedbackModal from "../../Components/Modals/feedback_modal";
import Modal from "react-bootstrap/Modal";
import numeral from "numeral";
function Thankyou() {
  const didMountRef = useRef(true);
  const [orderData, setOrderData] = useState({});
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    if (didMountRef.current) {
      localStorage.removeItem("CART_SESSION")
      localStorage.removeItem("ADDRESS_SESSION") 
      localStorage.removeItem("COUPON_SESSION")
      getOrderData();
    }
    didMountRef.current = false;
  }, []);
  const getOrderData = () => {
    if(id){
      const getOrderDetail = {
        trans_id: id,
      };
      ApiService.postData("get-order-detail", getOrderDetail).then((res) => {
        if (res.status === "success") {
          setOrderData(res.row_orders_data);
          setSpinnerLoading(false);
  
        }else{
          localStorage.removeItem("USER_TOKEN");
          setSpinnerLoading(false);
          navigate("/");
        }
      });
    }else{
      navigate("/");
    }
    
  };
  const [show, setShow] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const handleShowFeedbackModal = () => {
    setShowFeedback(true);
  };
  
  const handleChildData = () => {
    setShowFeedback(false);
  };
  return (
    <>
      <BrowserView>
        <div className="thankusection">
          <div className="thankusection-left">
            <a href="/" className="logo">
              <img src="/img/logo.png" alt="logo" width="85" height="63" />
            </a>
            <div className="tsleft-inner mt-4">
              <div className="tsleft-header mb-5">
                <div className="tsleft-header-icon">
                  <img src="/img/check-circle.gif" />
                </div>
                <div className="tsleft-header-text">
                  <h6>YOUR ORDER ID: #{orderData.trans_order_number}</h6>
                  <h5 className="mb-0">Thank You {orderData.trans_user_name}!</h5>
                </div>
              </div>
              <div className="tsleft-box mb-3">
                <div className="tsleft-box-map"></div>
                <div className="tsleft-box-body">
                  <h6 className="tx-14">Your order is confirmed</h6>
                  <p className="mb-0">{orderData.trans_method}</p>
                </div>
              </div>
              <div className="tsleft-box">
                <div className="tsleft-box-header">
                  <h6 className="mb-0">Order Details</h6>
                </div>
                <div className="tsleft-box-body">
                  <div className="row">
                    <div className="col-lg-6">
                      <h6 className="tx-14">Contact Information</h6>
                      <p>{orderData.trans_user_email}</p>
                      <h6 className="tx-14">Shipping Address</h6>
                      <p>{orderData.trans_delivery_address}</p>
                    </div>
                    <div className="col-lg-6">
                      <h6 className="tx-14">Payment Method</h6>
                      <p>{orderData.trans_method}: {orderData.trans_currency}{orderData.trans_amt}</p>
                      <h6 className="tx-14">Billing Address</h6>
                      <p>{orderData.trans_delivery_address}</p>
                    </div>
                    <div className="col-lg-12">
                      <h6 className="tx-14">Shipping Method</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="thankusection-footer mt-3 mb-5">
              <a href="/account/help-and-support">Need Help? Contact Us</a> 
              <div>
              <a href="javascript:void(0)" className="btn btn-primary-outline btn-medium me-3" onClick={handleShowFeedbackModal}>Feedback</a>
              <a href="/" className="btn btn-primary-outline btn-medium">Continue Shopping</a>
              </div>
            </div>
          </div>
          <div className="thankusection-right">
            {orderData.items ?
              orderData.items.map((value, index) => {
                return (
                  <div className="cartsec mt-0 mb-2" key={index}>
                    <div className="row g-3">
                      <div className="col-lg-2 col-3">
                        <div className="cartsec-media">
                          <img src={value.td_item_image} />
                        </div>
                      </div>
                      <div className="col-lg-9 col-9">
                        <h6 className="cartsec-name">
                          <a href="javascript:void(0)" className="mycartbox-title">
                            {value.td_item_title}
                          </a>
                        </h6>
                        <div className="cartsec-price">
                          <div className="price-new me-2">
                            {orderData.trans_currency}
                            {numeral(
                              value.td_item_sellling_price
                            ).format("0,0.00")}
                          </div> 
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            :null}
            <div className="panel p-4 mb-3">
              <div className="panel-header">Order Summary</div>
              <div className="panel-body">
                <div className="pcb-list mt-3">
                  <ul>
                    <li>
                      Item Total<span className="ml-auto">{orderData.trans_currency}{numeral(orderData.item_sub_total).format(
                                      "0,0.00"
                                    )}</span>
                    </li>
                    <li>
                      Discount<span className="ml-auto tx-green">-{orderData.trans_currency}
                                    {numeral(
                                      orderData.trans_discount_amount
                                    ).format("0,0.00")}</span>
                    </li>
                    <li>
                      Coupon Discount
                      <span className="ml-auto tx-green">-{orderData.trans_currency}
                                    {numeral(
                                      orderData.trans_coupon_dis_amt
                                    ).format("0,0.00")}</span>
                    </li>
                    <li>
                      Shipping<span className="ml-auto">{orderData.trans_currency}
                                    {numeral(
                                      orderData.trans_delivery_amount
                                    ).format("0,0.00")}</span>
                    </li>
                  </ul>
                </div>
                <hr />
                <div className="pcb-list-second">
                  <ul>
                    <li>
                      Total Amount<span className="ml-auto">{orderData.trans_currency}{numeral(orderData.trans_amt).format("0,0.00")}</span>
                    </li>
                  </ul>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </BrowserView>
      <MobileView>
      <div className="thankusection">
          <div className="thankusection-left">
            <div className="text-center">
            <a href="/" className="logo">
              <img src="/img/logo.png" alt="logo" width="85" height="63" />
            </a>
            </div>
           
            <div className="tsleft-inner mt-4">
              <div className="tsleft-header mb-5">
                <div className="tsleft-header-icon">
                  <img src="/img/check-circle.gif" />
                </div>
                <div className="tsleft-header-text">
                  <h6>YOUR ORDER ID: #{orderData.trans_order_number}</h6>
                  <h5 className="mb-0">Thank You {orderData.trans_user_name}!</h5>
                </div>
              </div>
              <div className="tsleft-box mb-3">
                <div className="tsleft-box-map"></div>
                <div className="tsleft-box-body">
                  <h6 className="tx-14">Your order is confirmed</h6>
                  <p className="mb-0">{orderData.trans_method}</p>
                </div>
              </div>
              <div className="tsleft-box">
                <div className="tsleft-box-header">
                  <h6 className="mb-0 tx-14">Order Details</h6>
                </div>
                <div className="tsleft-box-body">
                  <div className="row">
                    <div className="col-lg-6">
                      <h6 className="tx-13">Contact Information</h6>
                      <p className="tx-color-03 tx-12">{orderData.trans_user_email}</p>
                      <h6 className="tx-13">Shipping Address</h6>
                      <p className="tx-color-03 tx-12">{orderData.trans_delivery_address}</p>
                    </div>
                    <div className="col-lg-6">
                      <h6 className="tx-13">Payment Method</h6>
                      <p className="tx-color-03 tx-12">{orderData.trans_method}: {orderData.trans_currency}{orderData.trans_amt}</p>
                      <h6 className="tx-13">Billing Address</h6>
                      <p className="tx-color-03 tx-12">{orderData.trans_delivery_address}</p>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
           
          </div>
          <div className="thankusection-right">
          <div className="panel p-3 mb-3 mt-3">
              <div className="panel-header tx-14">Product Details</div>
              <div className="panel-body">
            {orderData.items ?
              orderData.items.map((value, index) => {
                return (
                  <div className="cartsec cartsec-thanku mt-2" key={index}>
                    <div className="row g-3">
                      <div className="col-lg-2 col-3">
                        <div className="cartsec-media">
                          <img src={value.td_item_image} />
                        </div>
                      </div>
                      <div className="col-lg-9 col-9">
                        <h6 className="cartsec-name">
                          <a href="javascript:void(0)" className="mycartbox-title">
                            {value.td_item_title}
                          </a>
                        </h6>
                        <div className="cartsec-price">
                          <div className="price-new me-2">
                            {orderData.trans_currency}
                            {numeral(
                              value.td_item_sellling_price
                            ).format("0,0.00")}
                          </div> 
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            :null}
            </div>
            </div>
            <div className="panel p-3 mb-3 mt-3">
              <div className="panel-header tx-14">Order Summary</div>
              <div className="panel-body">
                <div className="pcb-list mt-3">
                  <ul>
                    <li>
                      Item Total<span className="ml-auto">{orderData.trans_currency}{numeral(orderData.item_sub_total).format(
                                      "0,0.00"
                                    )}</span>
                    </li>
                    <li>
                      Discount<span className="ml-auto tx-green">-{orderData.trans_currency}
                                    {numeral(
                                      orderData.trans_discount_amount
                                    ).format("0,0.00")}</span>
                    </li>
                    <li>
                      Coupon Discount
                      <span className="ml-auto tx-green">-{orderData.trans_currency}
                                    {numeral(
                                      orderData.trans_coupon_dis_amt
                                    ).format("0,0.00")}</span>
                    </li>
                    <li>
                      Shipping<span className="ml-auto">{orderData.trans_currency}
                                    {numeral(
                                      orderData.trans_delivery_amount
                                    ).format("0,0.00")}</span>
                    </li>
                  </ul>
                </div>
                <hr />
                <div className="pcb-list-second">
                  <ul>
                    <li>
                      Total Amount<span className="ml-auto">{orderData.trans_currency}{numeral(orderData.trans_amt).format("0,0.00")}</span>
                    </li>
                  </ul>
                </div>
                <hr />
              </div>
            </div>
          </div>
          <div className="thankusection-footer mt-3 pb-5">
          <a href="/account/help-and-support" className="mb-3">Need Help? Contact Us</a> 
          <a href="/" className="btn btn-primary-outline btn-medium btn-block mb-3">Continue Shopping</a>
          <a href="javascript:void(0)" className="btn btn-primary-outline btn-medium btn-block" onClick={handleShowFeedbackModal}>Feedback</a>
             
            </div>
        </div>
      </MobileView>
      {showFeedback && (
        <FeedbackModal show={showFeedback} onChildData={handleChildData} className="feedbackModal bottom" />
           )}
    </>
  );
}
export default Thankyou;
