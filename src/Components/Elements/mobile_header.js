import React, { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import CartModal from '../Modals/cart_modal';
import { useLocation, useParams } from "react-router-dom";
function MobileHeader({ PageName, Route, cartCount=0}) {
  const didMountRef = useRef(true);
  const [showCart, setShowCart] = useState(false);
  const handleShowCart = () => setShowCart(true);
  const handleChildCartData = (status) => {
    setShowCart(status)
  };
  const handleClose = () => {
    setShowCart(false);
  };
  const [showHeaderStatus,SetShowHeaderStatus] = useState(false)
  const location = useLocation();
  const { slug } = useParams();
  useEffect(() => {
    if (didMountRef.current) {
      const currentPath = location.pathname;
      const isCategoryPage = currentPath.includes("/category");
      const isProductDetailsPage = currentPath.includes("/product/"+slug);
      const isTagPage = currentPath.includes("/collection/tag/"+slug);
      if (isCategoryPage || isProductDetailsPage || isTagPage) {
        SetShowHeaderStatus(true)
      } else {
        SetShowHeaderStatus(false)
      }
    }
    didMountRef.current = false;
  }, []); 
  return (
    <>
      <header className="mheader d-flex">
        <div className="mheader-left">
          <div className="mheader-title">
            <a href={"/" + Route}>
              <i className="d-icon-arrow-left"></i>
            </a>
            {PageName}
          </div>
        </div>
        {showHeaderStatus?
        <div className="mheader-right">
        <a className="search-link" href="/search" title="search">
          <i className="d-icon-search"></i>
        </a>
        <a
          className="cart-toggle"
          href="#"
          title="cart"
          onClick={handleShowCart}
        >
          <i className="d-icon-bag"></i>
          <span className="cart-count">{cartCount}</span>
        </a>
      </div>:null}
        
      </header>
      <Modal show={showCart} onHide={handleClose}  className="right cart-modal">
      {showCart && <CartModal showcartmodal={showCart} onChildCartData={handleChildCartData} />}
      </Modal>
    </>
  );
}
export default MobileHeader;
