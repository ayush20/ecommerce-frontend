import React, { useEffect, useState, useRef } from "react";
import numeral from "numeral";
import { ApiService } from "../../Components/Services/apiservices";
import { BrowserView, MobileView } from "react-device-detect";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../../Components/Elements/mobile_header";
import { useParams } from "react-router-dom";
import moment from "moment";
import sessionCartData from "../../Components/Elements/cart_session_data";

function OrderStatus() {
  const didMountRef = useRef(true);
  const [rowUserData, setRowUserData] = useState({});
  const [orderData, setOrderData] = useState({});
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

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
      } else {
        localStorage.removeItem("USER_TOKEN");
        navigate("/");
      }
    });
  };

  const getOrderData = () => {
    const getOrderDetail = {
      trans_id: id,
    };
    ApiService.postData("get-order-status", getOrderDetail).then((res) => {
      if (res.status === "success") {
          setOrderData(res.row_orders_data);
          setSpinnerLoading(false);
      }
    });
  };
  const Step = ({ status, date, statustext }) => {
    const stepClasses = `bs-wizard-step ${
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

  return (
    <>
      {spinnerLoading && <SpinnerLoader />}
      <MobileView>
        {spinnerLoading === false ? (
          <>
            <MobileHeader
              PageName={"#" + orderData.transaction.trans_order_number}
              Route={"account/order-details/"+orderData.transaction.trans_order_number}
              cartCount={parsedCartSession.length}
            />
            <div className="panel">
              <div className="oddetails-item">
                <div className="oddetails-item-media">
                  <img
                    src={orderData.td_item_image}
                    alt={orderData.td_item_image}
                  />
                </div>
                <div className="oddetails-item-content">
                  <h6 className="mb-1 tx-13">{orderData.td_item_title}</h6>
                  <div className="price">
                    {orderData.td_item_unit && (
                      <p className="tx-12 mb-1">
                        Variation: {orderData.td_item_unit}
                      </p>
                    )}
                    <p className="tx-12 mb-0">₹{orderData.td_item_total}</p>
                  </div>
                </div> 
              </div>
            </div>
            <div className="spacer1"></div>
            <div className="panel vsteprocess">
              {(() => {
                if (orderData.td_item_status == 1) {
                  return (
                    <ul className="StepProgress">
                      <Step
                        status="is-done"
                        date={orderData.created_at}
                        statustext="Order Placed"
                      />
                      <Step status="" date="" statustext="Item Picked Up" />
                      <Step status="" date="" statustext="Shipped" />
                      <Step status="" date="" statustext="Delivered" />
                    </ul>
                  );
                } else if (orderData.td_item_status == 4) {
                  return (
                    <ul className="StepProgress">
                      <Step
                        status="is-done"
                        date={orderData.created_at}
                        statustext="Order Placed"
                      />
                      <Step
                        status="is-done"
                        date={orderData.td_pickedup_date}
                        statustext="Item Picked Up"
                      />
                      <Step
                        status="is-done"
                        date={orderData.td_shiped_date}
                        statustext="Shipped"
                      />
                      <Step
                        status="is-done"
                        date={orderData.td_delivered_date}
                        statustext="Delivered"
                      />
                    </ul>
                  );
                } else if (orderData.td_item_status == 5) {
                  return (
                    <ul className="StepProgress">
                      <Step
                        status="is-done"
                        date={orderData.created_at}
                        statustext="Order Placed"
                      />
                      <Step
                        status="is-done"
                        date={orderData.td_cancelled_date}
                        statustext="Cancelled"
                      />
                    </ul>
                  );
                } else if (orderData.td_item_status == 6) {
                  return (
                    <ul className="StepProgress">
                      <Step
                        status="is-done"
                        date={orderData.created_at}
                        statustext="Order Placed"
                      />
                      <Step
                        status="is-done"
                        date={orderData.td_pickedup_date}
                        statustext="Item Picked Up"
                      />
                      <Step
                        status="is-done"
                        date={orderData.td_shiped_date}
                        statustext="Shipped"
                      />
                      <Step
                        status=""
                        date={orderData.td_delivered_date}
                        statustext="Delivered"
                      />
                    </ul>
                  );
                } else if (orderData.td_item_status == 7) {
                  return (
                    <ul className="StepProgress">
                      <Step
                        status="is-done"
                        date={orderData.created_at}
                        statustext="Order Placed"
                      />
                      <Step
                        status="is-done"
                        date={orderData.td_pickedup_date}
                        statustext="Item Picked Up"
                      />
                      <Step
                        status=""
                        date={orderData.td_shiped_date}
                        statustext="Shipped"
                      />
                      <Step
                        status=""
                        date={orderData.td_delivered_date}
                        statustext="Delivered"
                      />
                    </ul>
                  );
                } else if (orderData.td_item_status == 2) {
                  return (
                    <ul className="StepProgress">
                      <Step
                        status="is-done"
                        date={orderData.created_at}
                        statustext="Order Placed"
                      />
                      <Step
                        status="is-done"
                        date={orderData.td_pendingpayment_date}
                        statustext="Payment Pending"
                      />
                      <Step
                        status=""
                        date={orderData.td_shiped_date}
                        statustext="Shipped"
                      />
                      <Step
                        status=""
                        date={orderData.td_delivered_date}
                        statustext="Delivered"
                      />
                    </ul>
                  );
                } else if (orderData.td_item_status == 3) {
                  return (
                    <ul className="StepProgress">
                      <Step
                        status="is-done"
                        date={orderData.created_at}
                        statustext="Order Placed"
                      />
                      <Step
                        status="is-done"
                        date={orderData.td_onhold_date}
                        statustext="On Hold"
                      />
                      <Step
                        status=""
                        date={orderData.td_shiped_date}
                        statustext="Shipped"
                      />
                      <Step
                        status=""
                        date={orderData.td_delivered_date}
                        statustext="Delivered"
                      />
                    </ul>
                  );
                }
              })()}
            </div>
          </>
        ) : null}
      </MobileView>
    </>
  );
}
export default OrderStatus;
