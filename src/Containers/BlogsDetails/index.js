import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import constant from "../../Components/Services/constant";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams } from "react-router-dom";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import BlogsDetailsSidebar from "../BlogsDetailsSidebar";
import { Helmet } from "react-helmet";

function BlogsDetails() {
  const [blogDetailData, setBlogDetailData] = useState({});
  const [blogCategoryData, setBlogCategoryData] = useState([]);
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const { slug } = useParams();
  const didMountRef = useRef(true);
  useEffect(() => {
    if (didMountRef.current) {
      getBlogData();
    }

    didMountRef.current = false;
  });

  const getBlogData = () => {
    const getBlogDetail = {
      blog_slug: slug,
    };
    ApiService.postData("blog-details", getBlogDetail).then((res) => {
      if (res.status == "success") {
        setBlogDetailData(res.data);
        console.log("Blog Detail Data:", res.data);
        setBlogImageUrl(res.blog_image_path);
        setBlogCategoryData(res.categoryData);
        console.log("Blog Detail Data:", res.categoryData);
      }
      
    });
  };
  return (
    <>
        <Helmet>
        <title>{blogDetailData.blog_meta_title}</title>
        <meta name="description" itemprop="description" content={blogDetailData.blog_meta_desc != null ? blogDetailData.blog_meta_desc :""} />
        {blogDetailData.blog_meta_keyword != null ?<meta name="keywords" content={blogDetailData.blog_meta_keyword} />:""}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={blogDetailData.blog_meta_title} />
        <meta name="twitter:url" content={window.location.href} />
             <meta property="og:image" content= {constant.FRONT_URL+'img/logo.png'}/>
        <meta property="og:url" content={window.location.href} />
       <meta property="og:description" content={blogDetailData.blog_meta_desc != null ? blogDetailData.blog_meta_desc :""} />
        <meta name="twitter:title" content={blogDetailData.blog_meta_title} />
       <meta name="twitter:description" content={blogDetailData.blog_meta_desc != null ? blogDetailData.blog_meta_desc :""}/>
            <meta property="twitter:image" content= {constant.FRONT_URL+'img/logo.png'}/>
      </Helmet>
     <Header state="inner-header" />
      
      <section className="sec-pad">
      <Container>
      <Row>
      <Col lg={8}>
              <div className="listbog-details">
                <div className="thumbnail">
                {
                  blogDetailData.blog_image !=null ? 
                  <img
                    src={
                      blogDetailData.blog_image != null
                        ? blogImageUrl + "/" + blogDetailData.blog_image
                        : constant.DEFAULT_IMAGE
                    }
                    alt={blogDetailData.blog_image}
                  />
                  :"" }
                </div>
                <div className="content">
                {
                  blogDetailData.blog_name !=null ? 
                  <h1>{blogDetailData.blog_name}</h1>
                  :"" }
                  <ul className="blog-meta mb-3">
                  <li><i className="fas fa-calendar-alt"></i> {moment(blogDetailData.created_at).format("DD-MM-YYYY")}</li>
                  <li><i className="fas fa-user"></i>Admin</li>
                   </ul>
                   <div className="desc">
                   {blogDetailData.blog_desc != null ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blogDetailData.blog_desc,
                    }}
                  ></div>
                ) : (
                  ""
                )}
                   </div>
                </div>
                <div>           
                </div>
                
              </div>
              </Col>

              <Col lg={4}>
              {blogCategoryData.length > 0 && (  
              <>
              <h3>Categories</h3>
              {
                blogCategoryData.map((value) => (
                    <li><a href={`/blogs/category/` + value.category_slug}>{value.category_name}</a></li>
                    ))}
              </>
            )}
              </Col>
            </Row>
          </Container>
      </section>

      <Footer />
    </>
  );
}
export default BlogsDetails;
