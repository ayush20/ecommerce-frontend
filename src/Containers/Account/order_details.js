import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import constant from "../../Components/Services/constant";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import numeral from "numeral";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/Services/apiservices";
import { BrowserView, MobileView } from "react-device-detect";
import AccountSidebar from "./account_sidebar";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../../Components/Elements/mobile_header";
import { useParams } from "react-router-dom";
import moment from "moment";
import sessionCartData from "../../Components/Elements/cart_session_data";
import OrderCancelModal from "../../Components/Modals/order_cancel_modal";

function OrderDetails() {
  const didMountRef = useRef(true);
  const [rowUserData, setRowUserData] = useState({});
  const [orderData, setOrderData] = useState({});
  const [itemsData, setItemsData] = useState([]);
  const [transId, setTransId] = useState(0);
  const [tdId, setTdId] = useState(0);
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleOpenModal = (status, transid,tdid) => {
    setTransId(transid);
    setTdId(tdid);
    setShowCancelModal(status);
  };
  const handleCancelModal = () => {
    setShowCancelModal(false);
  };

  useEffect(() => {
    if (didMountRef.current) {
      getuserData();
      getOrderData();
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

  const getOrderData = () => {
    const getOrderDetail = {
      trans_id: id,
    };
    ApiService.postData("get-order-detail", getOrderDetail).then((res) => {
      if (res.status == "success") {
        setOrderData(res.row_orders_data);
        setItemsData(res.row_orders_data.items);
      }
    });
  };
  const Step = ({ status, date, statustext }) => {
    const stepClasses = `col-3 bs-wizard-step ${
      status === "is-done" ? "is-done" : ""
    } ${status === "current" ? "current" : ""}`;

    return (
      <li className={"StepProgress-item " + stepClasses}>
        <p className="mb-0 tx-14">{statustext}</p>
        {date ? (
          <p className="tx-12 tx-color-03 mb-0">
            {moment(date).format("DD MMM YYYY")}
          </p>
        ) : (
          ""
        )}
      </li>
    );
  };
  const Steps = ({ status, date, statustext }) => {
    const stepClasses = `col-3 bs-wizard-step ${
      status === "active" ? "active" : ""
    } ${status === "complete" ? "complete" : ""} ${
      status === "disabled" ? "disabled" : ""
    }`;

    return (
      <div className={stepClasses}>
        <div className="progress">
          <div className="progress-bar"></div>
        </div>
        <a href="#" className="bs-wizard-dot"></a>
        <div className="bs-wizard-info text-center">
          <p className="mb-0">{statustext}</p>
          {date ? (
            <p className="mb-0 tx-12">{moment(date).format("DD MMM YYYY")}</p>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      {spinnerLoading && <SpinnerLoader />}
      <BrowserView>
        <Header state="inner-header" cartCount={parsedCartSession.length} />
        <main className="main">
          <div className="subheader">
            <Container>
              <Row>
                <Col lg={12}>
                  <Breadcrumb className="breadcrumb-inner">
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="/account/orders">
                      My Orders
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>My Order Details</Breadcrumb.Item>
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
                        <h4>Order Details ({orderData.trans_order_number})</h4>
                      </div>
                      <div className="acpanel-body">
                        <div className="order-box">
                          <div className="info">
                            <div className="info-delivery">
                              <h6 className="mb-1">Delivery Address</h6>
                              <p className="mb-0 mt-0">
                                <strong>{orderData.trans_user_name}</strong>
                              </p>
                              <p className="tx-12">
                                {orderData.trans_delivery_address}
                              </p>
                              <p className="mb-0 mt-0">
                                <strong>Email Id :</strong>
                                {orderData.trans_user_email}
                              </p>
                              <p className="mb-0 mt-0">
                                <strong>Mobile number :</strong>
                                {orderData.trans_user_mobile}
                              </p>
                              <p className="mb-0 mt-0">
                                <strong>Txn Id:</strong>
                                {orderData.trans_order_number}
                              </p>
                            </div>
                          </div>
                        </div>
                        {itemsData.map((value, index) => {
                          return (
                            <div className="order-box-items mb-3">
                              <div className="order-box-items-img">
                                <img src={value.td_item_image}></img>
                              </div>
                              <div className="order-box-items-center">
                              <h6 className="tx-14 mb-1">{value.td_item_title}</h6>
                              <p>Variation: {value.td_item_unit}</p>
                              {value.td_item_status === 1 &&
                                value.td_accept_status === 1 ? (
                                  <a
                                    href="javascript:void(0)"
                                    className="btn btn-primary-outline btn-small"
                                    onClick={(e) =>
                                      handleOpenModal(true, value.td_trans_id, value.td_id)
                                    }
                                  >
                                    Cancel Order
                                  </a>
                                ) : null}
                              </div>
                              <div className="order-box-items-content">
                               
                                {(() => {
                                  if (value.td_item_status == 1) {
                                    return (
                                      <div className="row bs-wizard mt-1">
                                        <Steps
                                          status="complete"
                                          date={value.created_at}
                                          statustext="Order Placed"
                                        />
                                        <Steps
                                          status="disabled"
                                          date=""
                                          statustext="Item Picked Up"
                                        />
                                        <Steps
                                          status="disabled"
                                          date=""
                                          statustext="Shipped"
                                        />
                                        <Steps
                                          status="disabled"
                                          date=""
                                          statustext="Delivered"
                                        />
                                      </div>
                                    );
                                  } else if (value.td_item_status == 4) {
                                    return (
                                      <div className="row bs-wizard mt-5">
                                        <Steps
                                          status="complete"
                                          date={value.created_at}
                                          statustext="Order Placed"
                                        />
                                        <Steps
                                          status="complete"
                                          date={value.td_pickedup_date}
                                          statustext="Item Picked Up"
                                        />
                                        <Steps
                                          status="complete"
                                          date={value.td_shiped_date}
                                          statustext="Shipped"
                                        />
                                        <Steps
                                          status="complete"
                                          date={value.td_delivered_date}
                                          statustext="Delivered"
                                        />
                                      </div>
                                    );
                                  } else if (value.td_item_status == 5) {
                                    return (
                                      <div className="row bs-wizard mt-5">
                                        <Steps
                                          status="complete"
                                          date={value.created_at}
                                          statustext="Order Placed"
                                        />
                                        <Steps
                                          status="complete"
                                          date={value.td_cancelled_date}
                                          statustext="Cancelled"
                                        />
                                      </div>
                                    );
                                  } else if (value.td_item_status == 6) {
                                    return (
                                      <div className="row bs-wizard mt-5">
                                        <Steps
                                          status="complete"
                                          date={value.created_at}
                                          statustext="Order Placed"
                                        />
                                        <Steps
                                          status="complete"
                                          date={value.td_pickedup_date}
                                          statustext="Item Picked Up"
                                        />
                                        <Steps
                                          status="active"
                                          date={value.td_shiped_date}
                                          statustext="Shipped"
                                        />
                                        <Steps
                                          status="disabled"
                                          date={value.td_delivered_date}
                                          statustext="Delivered"
                                        />
                                      </div>
                                    );
                                  } else if (value.td_item_status == 7) {
                                    return (
                                      <div className="row bs-wizard mt-5">
                                        <Steps
                                          status="complete"
                                          date={value.created_at}
                                          statustext="Order Placed"
                                        />
                                        <Steps
                                          status="active"
                                          date={value.td_pickedup_date}
                                          statustext="Item Picked Up"
                                        />
                                        <Steps
                                          status="disabled"
                                          date={value.td_shiped_date}
                                          statustext="Shipped"
                                        />
                                        <Steps
                                          status="disabled"
                                          date={value.td_delivered_date}
                                          statustext="Delivered"
                                        />
                                      </div>
                                    );
                                  } else if (value.td_item_status == 2) {
                                    return (
                                      <div className="row bs-wizard mt-5">
                                        <Steps
                                          status="complete"
                                          date={value.created_at}
                                          statustext="Order Placed"
                                        />
                                        <Steps
                                          status="active"
                                          date={value.td_pendingpayment_date}
                                          statustext="Payment Pending"
                                        />
                                        <Steps
                                          status="disabled"
                                          date={value.td_shiped_date}
                                          statustext="Shipped"
                                        />
                                        <Steps
                                          status="disabled"
                                          date={value.td_delivered_date}
                                          statustext="Delivered"
                                        />
                                      </div>
                                    );
                                  } else if (value.td_item_status == 3) {
                                    return (
                                      <div className="row bs-wizard mt-5">
                                        <Steps
                                          status="complete"
                                          date={value.created_at}
                                          statustext="Order Placed"
                                        />
                                        <Steps
                                          status="active"
                                          date={value.td_onhold_date}
                                          statustext="On Hold"
                                        />
                                        <Steps
                                          status="disabled"
                                          date={value.td_shiped_date}
                                          statustext="Shipped"
                                        />
                                        <Steps
                                          status="disabled"
                                          date={value.td_delivered_date}
                                          statustext="Delivered"
                                        />
                                      </div>
                                    );
                                  }
                                })()}
                               
                              </div>
                            </div>
                          );
                        })}
                        <div className="card-table">
                          <div className="card-table-section">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Items</th>
                                  <th className="text-center">QTY</th>
                                  <th className="text-center">Price</th>
                                  <th className="text-center">Amount</th>
                                </tr>
                              </thead>

                              <tbody>
                                {itemsData.map((value, index) => {
                                  return (
                                    <tr>
                                     
                                      <td>
                                        {value.td_item_title}
                                        <br />
                                      </td>
                                      <td className="text-center">
                                        {value.td_item_qty}
                                      </td>
                                      <td className="text-center">
                                        {orderData.trans_currency}
                                        {numeral(
                                          value.td_item_sellling_price
                                        ).format("0,0.00")}
                                      </td>
                                      <td className="text-center">
                                        {orderData.trans_currency}
                                        {numeral(
                                          value.td_item_sellling_price *
                                            value.td_item_qty
                                        ).format("0,0.00")}
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr>
                                  <td colSpan="1"></td>
                                  <td colSpan=""></td>
                                  <td>Sub Total</td>
                                  <td className="text-center">
                                    {orderData.trans_currency}
                                    {numeral(orderData.item_sub_total).format(
                                      "0,0.00"
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2"></td>
                                  <td>Discount</td>
                                  <td className="text-center">
                                    -{orderData.trans_currency}
                                    {numeral(
                                      orderData.trans_discount_amount
                                    ).format("0,0.00")}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2"></td>
                                  <td>Coupon Discount</td>
                                  <td className="text-center">
                                    {orderData.trans_currency}
                                    {numeral(
                                      orderData.trans_coupon_dis_amt
                                    ).format("0,0.00")}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2"></td>
                                  <td>Delivery Charges</td>

                                  <td className="text-center">
                                    {orderData.trans_currency}
                                    {numeral(
                                      orderData.trans_delivery_amount
                                    ).format("0,0.00")}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2"></td>
                                  <td>
                                    <strong>Grand total</strong>
                                  </td>
                                  <td className="text-center">
                                    <strong>
                                      {orderData.trans_currency}
                                      {orderData.trans_amt}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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
        <MobileHeader
          PageName={"#" + orderData.trans_order_number}
          Route="account/orders"
          cartCount={parsedCartSession.length}
        />
        <div className="panel p-3">
          <div className="panel-header mb-3">Shipping & Billing Address</div>
          <p className="mb-0 mt-0">
            <strong>{orderData.trans_user_name}</strong>
          </p>
          <p className="tx-12">{orderData.trans_delivery_address}</p>
          <p className="mb-0 mt-0">
            <strong>Email Id: </strong>
            {orderData.trans_user_email}
          </p>
          <p className="mb-0 mt-0">
            <strong>Mobile No: </strong>
            {orderData.trans_user_mobile}
          </p>
        </div> 
        <div className="spacer1"></div>
        <div className="panel">
          {itemsData.map((value, index) => {
            return (
              <div className="oddetails-item" key={index} onClick={(e)=> navigate(`/account/order-status/${value.td_order_id}`)}>
                <div className="oddetails-item-media">
                  <img src={value.td_item_image} alt={value.td_item_image} />
                </div>
                <div className="oddetails-item-content">
                  <h6 className="mb-1 tx-13">{value.td_item_title}</h6>
                  <div className="price">
                    {value.td_item_unit && (
                      <p className="tx-12 mb-1">Variation: {value.td_item_unit}</p>
                    )}
                    <p className="tx-12 mb-0">₹{value.td_item_total}</p>
                  </div>
                </div>
                <div>
                  <a href={`/account/order-status/${value.td_order_id}`}><i class="d-icon-angle-right"></i></a>
                </div>
              </div>
            );
          })}
        </div>
        <div className="spacer1"></div>
        <div className="panel checkoutlist">
          <div className="panel-header">Price Details</div>
          <div className="panel-body">
            <div className="pcb-list mt-2">
              <ul>
                <li>
                  Item Total
                  <span className="ml-auto">
                    {orderData.trans_currency}
                    {numeral(orderData.item_sub_total).format("0,0.00")}
                  </span>
                </li>
                <li>
                  Discount
                  <span className="ml-auto tx-green">
                    -{orderData.trans_currency}
                    {numeral(orderData.trans_discount_amount).format("0,0.00")}
                  </span>
                </li>
                <li>
                  Coupon Discount
                  <span className="ml-auto tx-green">
                    {orderData.trans_currency}
                    {numeral(orderData.trans_coupon_dis_amt).format("0,0.00")}
                  </span>
                </li>
                <li>
                  {" "}
                  Shipping
                  <span className="ml-auto tx-green">
                    {orderData.trans_currency}
                    {numeral(orderData.trans_delivery_amount).format("0,0.00")}
                  </span>
                </li>
              </ul>
            </div>
            <hr />
            <div className="pcb-list-second">
              <ul>
                <li>
                  Total Amount
                  <span className="ml-auto">
                    {orderData.trans_currency}
                    {orderData.trans_amt}
                  </span>
                </li>
              </ul>
            </div>
            <hr />
          </div>
        </div>
      </MobileView>
      {showCancelModal && (
        <OrderCancelModal
          transId={transId}
          tdId={tdId}
          showmodal={showCancelModal}
          onChildData={setShowCancelModal}
          closeModal={handleCancelModal}
        />
      )}
    </>
  );
}
export default OrderDetails;
