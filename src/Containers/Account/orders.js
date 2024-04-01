import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
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
import moment from "moment";
import sessionCartData from "../../Components/Elements/cart_session_data";
function Orders() {
  const didMountRef = useRef(true);
  const [rowUserData, setRowUserData] = useState({});
  const [orderData, setOrderData] = useState([]);
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const navigate = useNavigate();
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  useEffect(() => {
    if (didMountRef.current) {
      getuserData();
      getorderData();

    }
    didMountRef.current = false;
  }, []);
  const getuserData = () => {
    ApiService.fetchData("get-user-data").then((res) => {
      if (res.status == "success") {
        setRowUserData(res.rowUserData);
      } else {
        localStorage.removeItem("USER_TOKEN")
        navigate("/");
      }
    });

   
  };
  const getorderData = () => {
    ApiService.fetchData("get-order-data").then((res) => {
      if (res.status == "success") {
        setOrderData(res.orderList);    
        setSpinnerLoading(false);
      } else{
        setSpinnerLoading(false);
      }
    });

   
  };
  const handleShopNow = () => {
    navigate("/");
  };

  const Step = ({ status, date, statustext }) => {
    const stepClasses = `col-3 bs-wizard-step ${status === 'active' ? 'active' : ''} ${
      status === 'complete' ? 'complete' : ''
    } ${status === 'disabled' ? 'disabled' : ''}`;
  
    return (
      <div className={stepClasses}>
        <div className="progress">
          <div className="progress-bar"></div>
        </div>
        <a href="#" className="bs-wizard-dot"></a>
        <div className="bs-wizard-info text-center">
          <p className="mb-0">{statustext}</p>
          {date?
            <p className="mb-0 tx-12">{moment(date).format("DD MMM YYYY")}</p>:''
          }
          
        </div>
      </div>
    );
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
                    <Breadcrumb.Item active>My Orders</Breadcrumb.Item>
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
                        <h4>My Orders</h4>
                      </div>
                     
                      <div className="acpanel-body" >
                        {spinnerLoading === false ?
                          orderData.length > 0 ? (
                            orderData.map((value,index)=>( 
                              <div className="order-box" key={index}>
                                <div className="info">
                                  <div className="info-delivery">
                                    <h6 className="mb-1 tx-14">Delivery Address</h6>
                                    <p className="mb-0 tx-13">
                                      <strong>{value.trans_user_name}</strong>
                                    </p>
                                    <p className="mb-0 tx-13">
                                    {value.trans_delivery_address}
                                    </p>
                                    <p className="mb-0 tx-13">
                                      Email Id : {value.trans_user_email}
                                    </p>
                                    <p className="mb-0 tx-13">
                                      Phone number : {value.trans_user_mobile}
                                    </p>
                                    <div className="orderitems">
                                      <ul>
                                        {value.items.map((itemsValue, itemsIndex) => {
                                          return (
                                            <li key={itemsIndex}><img src={itemsValue.td_item_image}></img></li>
                                            );
                                        })}
                                      </ul>
                                    </div> 
                                  </div>
                                </div>
                                <div className="bcode">
                                  <div className="orderid-box mb-2">
                                    <h6 className="mb-0">ORDER ID</h6>
                                    <p className="mb-0 tx-13">{value.trans_order_number}</p>
                                  </div>
                                  <p className="tx-color-03 mb-0 tx-13">ORDER ON</p>
                                  <p className="tx-12">
                                  {moment(value.trans_datetime).format("ddd, DD MMM YYYY")}
                                <br />
                                {moment(value.trans_datetime, "HH:mm").format("hh:mm A")}
                              
                                  </p>
                                  <a
                                    href={`/account/order-details/${value.trans_order_number}`}
                                    className="btn btn-primary-outline btn-medium btn-block"
                                  >
                                    View Details
                                  </a>
                                </div>
                              </div>
                            ))
                          ) : 
                          <div className="noimg text-center">
                            <img src="/img/no-orders.webp" style={{width: '250px'}} className="mb-3"/>
                            <h6>No orders found!</h6>
                            <p>Look like you haven't made your order yet</p>
                            <Button className="btn btn-primary-outline btn-medium btn01" onClick={handleShopNow}>Shop Now</Button>
                          </div>
                        :null}
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
          <MobileHeader PageName="Your Orders" Route="account/account-overview" cartCount={parsedCartSession.length}/>
          {spinnerLoading === false?
          <main className="main">
          {
          orderData.length > 0 ? (
            orderData.map((value,index)=>( 
            <div className="morderbox" key={index}>
              <div className="morderbox-body">
                <div className="row">
                  <div className="col-7">
                    <h6 className="mb-1 tx-12">Order Id: {value.trans_order_number}</h6>
                    <p className="mb-1 tx-13">Total Amount: ₹{value.trans_amt}</p>
                    <p className="mb-0 tx-13 tx-color-03">Total Items: {value.itemscount}</p>
                  </div>
                  <div className="col-5 tx-right">
                    <p className="mb-1 tx-13 tx-color-03">Placed On</p>
                    <p className="mb-0 tx-12 tx-color-03">{moment(value.trans_datetime).format("ddd, DD MMM YYYY")} @  {moment(value.trans_datetime, "HH:mm").format("hh:mm A")}</p>
                  </div>
                </div>
                       
              </div>
              <div className="morderbox-footer"> 
                <div className="morderbox-link">
                <a  href={`/account/order-details/${value.trans_order_number}`}>View Details<i className="d-icon-arrow-right"></i></a>
                </div>
              </div>
            </div>
             ))
            ) : <div className="noimg text-center">
             <img src="/img/no-orders.webp" style={{width: '250px'}} className="mb-3"/>
             <h6>No orders found!</h6>
             <p>Look like you haven't made your order yet</p>
             <Button className="btn btn-primary-outline btn-medium btn01" onClick={handleShopNow}>Shop Now</Button>
           </div>
           }
          </main>:null}
          
      
      </MobileView>
    </>
  );
}
export default Orders;
