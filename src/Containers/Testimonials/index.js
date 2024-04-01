import React, { useEffect, useRef, useState } from "react";
import constant from "../../Components/Services/constant";
import { ApiService } from "../../Components/Services/apiservices";
import Container from "react-bootstrap/Container";
import { Col, Row } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { Helmet } from "react-helmet";

function Testimonials() {
  const didMountRef = useRef(true);
  const [resTestimonialData, setResTestimonialData] = useState([]);
  const [testimonialImagePath, setTestimonialImagePath] = useState([]);
  const [pageData, setPageData] = useState({});
  const [pageContent, setPageContent] = useState("");


  useEffect(() => {
    if (didMountRef.current) {
        const getPageData = {
            slug: "testimonials",
          };
        ApiService.postData("page-content", getPageData).then(
            (res) => {
                if (res.status == "success") {              
                    setPageData(res.data);
                    setPageContent(res.data.page_content);
                }
        })
        
    }
    getTestimonialData();

    didMountRef.current = false;
  }, []);
  const getTestimonialData = () => {
    ApiService.fetchData("featured-testimonial").then((res) => {
      if (res.status == "success") {
        setResTestimonialData(res.resTestimonialData);
        setTestimonialImagePath(res.testimonial_image_path);
      }
    });
  };
  
  return (
    <>
     <Helmet>
     <title>{pageData.page_meta_title}</title>
        <meta name="description" itemprop="description" content={pageData.page_meta_desc != null ? pageData.page_meta_desc :""} />
        {pageData.page_meta_keyword != null ?<meta name="keywords" content={pageData.page_meta_keyword} />:""}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={pageData.page_meta_title} />
        <meta name="twitter:url" content={window.location.href} />
             <meta property="og:image" content= {constant.FRONT_URL+'img/logo.png'}/>
        <meta property="og:url" content={window.location.href} />
        {pageData.page_meta_desc != null ?<meta property="og:description" content={pageData.page_meta_desc} />:""}
        <meta name="twitter:title" content={pageData.page_meta_title} />
        {pageData.page_meta_desc != null ?<meta name="twitter:description" content={pageData.page_meta_desc} />:""}
            <meta property="twitter:image" content= {constant.FRONT_URL+'img/logo.png'}/>
      </Helmet>
    <Header state="inner-header"  />
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
        <div className="row">
        {resTestimonialData.map((value, index) => {
               return (
            <Col lg={4} key={index} className="testimonial mb-3">
             
                  <div className="testimonial-grid" key={index}>
                    <div
                      className="content"
                      dangerouslySetInnerHTML={{
                        __html: value.testimonial_desc,
                      }}
                    ></div>
                    <div className="d-flex justify-content-start mt-4">
                      <div className="thumbnail">
                        <img
                          src={
                            value.testimonial_image != null
                              ? testimonialImagePath +
                                "/" +
                                value.testimonial_image
                              : constant.DEFAULT_IMAGE
                          }
                          alt="Testimonial"
                        />
                      </div>
                      <div className="m-4">
                        <h6>{value.testimonial_name}</h6>
                      </div>
                    </div>
                  </div>     
               
          </Col>
           );
              })}
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
}
export default Testimonials;
