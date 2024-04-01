import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../Components/Services/apiservices";
import { useNavigate,useParams } from "react-router-dom";

import numeral from "numeral";
function CancelPayment() {
  const didMountRef = useRef(true);
  const [orderData, setOrderData] = useState({});
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    if (didMountRef.current) {
    }
    didMountRef.current = false;
  }, []);
   
  return (
    <>
     <div className="container mt-5">
      <div className="row align-items-center justify-content-center">
        <div className="col-lg-4">
          <div className="p-3 text-center">
            <img src="/img/warning.png" className="mb-3"/>
            <h4>Transaction Failed!</h4>
            <p className="tx-15">We are unable to process your transaction at this time. Please try again later</p>
            <a href="/">
                <button className="btn btn-primary-outline btn-small">
                  OK, Got it!
                </button>
              </a>
         
          </div>
        </div>
      </div>
     </div>
    </>
  );
}
export default CancelPayment;
