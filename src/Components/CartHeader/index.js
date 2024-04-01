import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect"; 
function CartHeader() {
  const didMountRef = useRef(true);
  const location = useLocation();
  const [setSession, SetSession] = useState("");
  useEffect(() => {
    if (didMountRef.current) {
       SetSession(localStorage.getItem("USER_TOKEN")); 
    }
    didMountRef.current = false;
  }, []);
  return (
    <>
     <BrowserView>
      <header className='header cartheader'>
        <div className='container'>
          <div className='header-left'>
            <a className='logo' href="/"><img src="/img/logo.png" alt="logo" width="125" height="52"/></a>
          </div>
          <div className='header-center'>
            <div className='step-by'>
            <h3 className={location.pathname.includes("/cart") ? "title-simple title-step title-step1 active" : "title-simple title-step title-step1"}>
              <a href="/cart">My Cart</a>
            </h3>
            <h3 className={location.pathname.includes("/address") ? "title-simple title-step title-step1 active" : "title-simple title-step title-step1"}>
              {setSession?<a href="/address">Address</a>:<a href="javascript:void(0);">Address</a>}
            </h3>
            <h3 className={location.pathname.includes("/checkout") ? "title-simple title-step title-step1 active" : "title-simple title-step title-step1"}>
              {setSession?<a href="/checkout">Payment</a>:<a href="javascript:void(0);">Payment</a>}
              </h3>
            </div>
          </div>
          <div className="header-right justify-content-end">
                <img src="/img/100SECURE.png" className='secure-img' />
            </div>
        </div>
      </header>
      </BrowserView>
      <MobileView>
        <header className="mheader d-flex">
          <div className="mheader-left">
            <div className="mheader-title">
              <a href={location.pathname.includes("/cart") ?'/':location.pathname.includes("/address") ?'/cart':location.pathname.includes("/checkout") ?'/address':'/'}><i className="d-icon-arrow-left"></i></a>
            
            {location.pathname.includes("/cart") ?'Shopping Cart':location.pathname.includes("/address") ?'Address':location.pathname.includes("/checkout") ?'Checkout':'Shopping Cart'}
            </div>
          </div>
          <div className="mheader-right">({location.pathname.includes("/cart") ?1:location.pathname.includes("/address") ?2:location.pathname.includes("/checkout") ?3:1}/3)</div>
        </header>
      </MobileView>
    </>
  );
}
export default CartHeader;
