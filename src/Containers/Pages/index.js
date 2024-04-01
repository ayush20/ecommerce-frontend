import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import { BrowserView, MobileView } from "react-device-detect";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import MobileHeader from "../../Components/Elements/mobile_header";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { Helmet } from "react-helmet";
import constant from "../../Components/Services/constant";

function Pages() {
  const { slug } = useParams();
  const didMountRef = useRef(true);
  const [pageData, setPageData] = useState({});
  const [pageContent, setPageContent] = useState("");
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [headerImage , setHeaderImage] = useState("")
  useEffect(() => {
    if (didMountRef.current) {
      const getPageData = {
        slug: slug,
      };
      ApiService.postData("page-content", getPageData).then((res) => {
        if (res.status == "success") {
          setPageData(res.data);
          setPageContent(res.data.page_content);
          setHeaderImage(res.page_header_image_path)
         
          setSpinnerLoading(false);
        } else {
          setSpinnerLoading(false);
        }
      }); 
    }
    didMountRef.current = false;
  });

  return (
    <>
      <Helmet>
      <title>{pageData.page_meta_title}</title>
        <meta name="description" itemprop="description" content={pageData.page_meta_desc != null ? pageData.page_meta_desc :"Momabatti"} />
        {pageData.page_meta_keyword != null ?<meta name="keywords" content={pageData.page_meta_keyword} />:""}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={pageData.page_meta_title} />
        <meta name="twitter:url" content={window.location.href} />
             <meta property="og:image" content= {constant.FRONT_URL+'img/logo.png'}/>
        <meta property="og:url" content={window.location.href} />
       <meta property="og:description" content= {pageData.page_meta_desc != null ?pageData.page_meta_desc:"Momabatti"} />
        <meta name="twitter:title" content={pageData.page_meta_title} />
       <meta name="twitter:description" content={pageData.page_meta_desc != null ?pageData.page_meta_desc:"Momabatti"} />
            <meta property="twitter:image" content= {constant.FRONT_URL+'img/logo.png'}/>
      </Helmet>
      {spinnerLoading && <SpinnerLoader />}
      <BrowserView>
        <Header state="inner-header" />
        {(slug === "who-we-are" || slug === "our-story") && (
                  <div class="makers-home-header background-image d-flex justify-content-center align-items-center makersimg" style={{backgroundImage:`url(${headerImage + '/' + pageData.page_header_image})`}}>
                  <div class="container ">
                  <div class="row justify-content-center ">
                  <div class="col-lg-12 col-sm-8 col-md-offset-2 text-white text-center">
                  
                  </div>
                  </div>
                  </div>
                  </div>
        )}


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



        {pageContent != null ? (
          <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
        ) : (
          ""
        )}

        <Footer />
      </BrowserView>
      <MobileView>
        <MobileHeader PageName={pageData.page_name} Route="account/about-us" />

        {pageContent != null ? (
          <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
        ) : (
          ""
        )}
      </MobileView>
    </>
  );
}
export default Pages;
