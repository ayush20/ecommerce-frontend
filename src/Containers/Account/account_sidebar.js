import React from "react";
import Col from "react-bootstrap/Col";
import { ApiService } from "../../Components/Services/apiservices";
import { useLocation, useNavigate } from "react-router-dom";
function AccountSidebar({ rowUserData }) {
  const location = useLocation();
  const navigate = useNavigate()
  const logoutUser =() =>{
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      ApiService.fetchData("logout-user").then((res) => {
        localStorage.removeItem("USER_TOKEN")
        navigate('/')
      });
    }
  }
  return (
    <>
       <Col lg={3}>
        <div className="account-sidebar">
          <div className="account-user mb-3">
            <div className="au-imag"><img src="/img/user.png"/></div>
            <a href="/account/profile">
              <div className="au-content">
                <h6 className="mb-0">Hi! {rowUserData.user_fname}</h6>
                <p className="mb-0">{rowUserData.user_email}</p>
              </div>
            </a>
          </div>
          <div className="aclist mb-3">
            <ul>
            
              <li className={location.pathname ==="/account/account-overview" ? "active" : ""}>
                <a href="/account/account-overview">
                  Account Overview<i className="d-icon-angle-right"></i>
                </a>
              </li>
              <li className={location.pathname ==="/account/profile" ? "active" : ""}>
                <a href="/account/profile">
                  Profile<i className="d-icon-angle-right"></i>
                </a>
              </li>
              <li className={location.pathname ==="/account/address" ? "active" : ""}>
                <a href="/account/address">
                  Address<i className="d-icon-angle-right"></i>
                </a>
              </li>
              <li className={location.pathname ==="/account/orders" ? "active" : ""}>
                <a href="/account/orders">
                  My Orders<i className="d-icon-angle-right"></i>
                </a>
              </li>
              <li className={location.pathname ==="/account/wishlist" ? "active" : ""}>
                <a href="/account/wishlist">
                  My Wishlist<i className="d-icon-angle-right"></i>
                </a>
              </li>
              <li className={location.pathname ==="/account/change-password" ? "active" : ""}>
                <a href="/account/change-password">
                  Change Password<i className="d-icon-angle-right"></i>
                </a>
              </li>
              <li className={location.pathname ==="/account/help-and-support" ? "active" : ""}>
                <a href="/account/help-and-support">
                Help & Support<i className="d-icon-angle-right"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="aclist">
            <ul>
              <li>
                <a href="#" className="pb-0 pt-0" onClick={logoutUser}>
                  Logout<i className="d-icon-angle-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Col>
    </>
  );
}
export default AccountSidebar;
