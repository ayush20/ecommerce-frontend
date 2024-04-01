import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import constant from "../../Components/Services/constant";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";
import { Col, Row } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams } from "react-router-dom";
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { Helmet } from "react-helmet";
import moment from "moment";
function Blog(){
    const { slug } = useParams();
    const didMountRef = useRef(true);
    const [pageData, setPageData] = useState({});
    const [pageContent, setPageContent] = useState("");
    const [blogData, setBlogData] = useState([]);
    const [blogImagePath, setBlogImagePath] = useState([]);
    useEffect(() => {
            if (didMountRef.current) {
              getBlogData();
    const getPageData = {
        slug: "blogs",
      };
    ApiService.postData("page-content", getPageData).then(
        (res) => {
            if (res.status == "success") {              
                setPageData(res.data);
             
            }
    })}

    didMountRef.current = false;
  });

  const getBlogData = () => {
    ApiService.fetchData("blog-list").then((res) => {
      if (res.status == "success") {
        setBlogData(res.blogsData);
        setBlogImagePath(res.blog_image_path);
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
        <Container>
        <Row>
        {blogData.map((value,index)=>( 
        <Col lg={4} key={index} className="mb-5">
          <div className="listbog">
            <div className="thumbnail">
            <a href={`/blogs/${value.blog_slug}`}>
              <img src={value.blog_image != null ? blogImagePath + "/" + value.blog_image : constant.DEFAULT_IMAGE} alt={value.blog_image}/>
            </a>
            </div>
            <div className="content">
            <div className="read-more-btn">
            <a className="btn-icon-round" href={`/blogs/${value.blog_slug}`}><i className="d-icon-arrow-right"></i></a>
            </div>
            <h5 className="title"><a href={`/blogs/${value.blog_slug}`}>{value.blog_name}</a></h5>
            <ul className="blog-meta">
            
            <li><a href={`/blogs/${value.blog_slug}`}><i className="fas fa-calendar-alt"></i>{moment(value.created_at).format('MMM D, YYYY')}</a>
                                    </li>
            <li><a href={`/blogs/${value.blog_slug}`}><i className="fas fa-user"></i>Admin</a></li>
                    </ul>
            </div>            
          </div> 
       </Col>
 ))} 
      
            </Row>
          </Container>
        </section>

        <Footer/>
        </>
    )
}
export default Blog
