import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import Container from "react-bootstrap/Container";
import { Col, Row } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import constant from "../../Components/Services/constant";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { CopyToClipboard } from "react-copy-to-clipboard";
function TrackOrder() {
  const { slug } = useParams();
  const didMountRef = useRef(true);
  const [pageData, setPageData] = useState({});
  const [pageContent, setPageContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [transTrackingUrl, setTransTrackingUrl] = useState("");
  const [transTrackingId, setTransTrackingId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    if (didMountRef.current) {
      const getPageData = {
        slug: "track-order",
      };
      ApiService.postData("page-content", getPageData).then((res) => {
        if (res.status == "success") {
          setPageData(res.data);
          setPageContent(res.data.page_content);
        }
      });
    }
    didMountRef.current = false;
  }, []);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const handleTrackOrder = () => {
    if (!orderId) {
      toast.error("Please enter your order ID.");
      return;
    }
    const dataString = {
      trans_order_number: orderId,
    };
    ApiService.postData("track-order", dataString).then((res) => {
      if (res.status === "success" && res.resUserData) {
        setTransTrackingId(res.resUserData.trans_tracking_id);
        setTransTrackingUrl(res.resUserData.trans_tracking_url);
      } 
      else if (res.status === "error" && res.message === "No order found with requested Order Id") {
        toast.error("No order found with requested Order Id");
      }
    });
  };
  return (
    <>
      <Helmet>
        <title>{pageData.page_meta_title}</title>
        <meta
          name="description"
          itemprop="description"
          content={
            pageData.page_meta_desc != null
              ? pageData.page_meta_desc
              : "Momabatti"
          }
        />
        {pageData.page_meta_keyword != null ? (
          <meta name="keywords" content={pageData.page_meta_keyword} />
        ) : (
          ""
        )}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={pageData.page_meta_title} />
        <meta name="twitter:url" content={window.location.href} />
        <meta
          property="og:image"
          content={constant.FRONT_URL + "img/logo.png"}
        />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:description"
          content={
            pageData.page_meta_desc != null
              ? pageData.page_meta_desc
              : "Momabatti"
          }
        />
        <meta name="twitter:title" content={pageData.page_meta_title} />
        <meta
          name="twitter:description"
          content={
            pageData.page_meta_desc != null
              ? pageData.page_meta_desc
              : "Momabatti"
          }
        />
        <meta
          property="twitter:image"
          content={constant.FRONT_URL + "img/logo.png"}
        />
      </Helmet>
      <ToastContainer />
      <Header state="inner-header" />
      <div className="subheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1>{pageData.page_name}</h1>
              <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>{pageData.page_name}</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </div>
      <section className="sec-pad">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <img src="/img/trackorder.png" className="img-fluid mb-3" />
            </div>
            <div className="col-lg-6">
              <div className="feedback-desktop">
                <h5 className="tx-theme mb-3">Track Your Order</h5>

                <div className="row g-3">
                  <div className="col-lg-12">
                    <div className="feedback-group mb-3">
                      <label>Enter Your Order Id</label>
                      <input
                        type="text"
                        name="Order"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="feedback-group  mb-3">
                  <button
                    type="button"
                    className="btn btn-primary-outline btn-medium me-3"
                    onClick={handleTrackOrder}
                  >
                    Submit
                  </button>
                </div>
                {transTrackingId && transTrackingUrl &&(
                <div className="panel p-3">
                  
                    <p>
                      Tracking ID: {transTrackingId}
                      <CopyToClipboard
                        text={transTrackingId}
                        onCopy={handleCopy}
                      >
                        <span
                          className="cursor-pointer"
                          title="Copy to clipboard"
                        >
                          {isCopied ? (
                            <i className="fas fa-check-circle text-success"></i>
                          ) : (
                            <i className="far fa-copy"></i>
                          )}
                        </span>
                      </CopyToClipboard>
                    </p>
                    <p>
                      Tracking URL:
                      <a
                        className="tx-theme"
                        href={transTrackingUrl}
                        target="_blank"
                      >
                        &nbsp; {transTrackingUrl}
                      </a>
                    </p>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {pageContent != null ? (
        <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
      ) : (
        ""
      )}
      <Footer />
    </>
  );
}
export default TrackOrder;
