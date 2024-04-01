import React, { useEffect, useState, useRef } from "react"; 
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { BrowserView, MobileView } from "react-device-detect";
import SpinnerLoader from "../../Components/Elements/spinner_loader";

function Error404() {
  const didMountRef = useRef(true);
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  useEffect(() => {
    if (didMountRef.current) {
        setSpinnerLoading(false)
    }
    didMountRef.current = false;
  }, []);

  return (
    <>
      <BrowserView>
        <Header />
        <section className="sec-pad text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-12" >
                <h4>Page Not Found</h4>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </BrowserView>

      <MobileView>
        <section className="sec-pad text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-12" >
                <h4>Page Not Found</h4>
              </div>
            </div>
          </div>
        </section>
      </MobileView>
    </>
  );
}
export default Error404;
