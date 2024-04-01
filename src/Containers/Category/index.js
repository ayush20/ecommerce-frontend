import React, { useRef, useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import MobileHeader from "../../Components/Elements/mobile_header";
import { ApiService } from "../../Components/Services/apiservices";
import { useState } from "react";
import constant from "../../Components/Services/constant";
import { useNavigate } from "react-router-dom";
import sessionCartData from "../../Components/Elements/cart_session_data";
import { Helmet } from "react-helmet";
function Category() {
  const didMountRef = useRef(true);
  const [categoryData, setCategoryData] = useState([]);
  const [baseUrl, setBaseUrl] = useState("");
  const [pageData, setPageData] = useState("");
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const navigate = useNavigate();
  useEffect(() => {
    const getPageData = {
      slug: "category",
    };
    ApiService.postData("page-content", getPageData).then((res) => {
      if (res.status == "success") {
        setPageData(res.data);
      } else {
      }
    });
    ApiService.fetchData("all-categories").then((res) => {
      if (res.status === "success") {
        setCategoryData(res.resCategory);
        setBaseUrl(res.category_image_path);
      } else {
      }
    });
    didMountRef.current = false;
  }, []);

  const toggleSubcategory = (index) => {
    const subcategoryElement = document.querySelector(`.subcategory-${index}`);
    if (subcategoryElement) {
      subcategoryElement.style.display =
        subcategoryElement.style.display === "none" ? "block" : "none";
    }
  };

  const gotocategoryslug = (slug, subcategory) => {
    if (subcategory == 0) {
      navigate("/collection/category/" + slug);
    }
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
      <BrowserView>
        <Header state="inner-header" cartCount={parsedCartSession.length} />

        <Footer />
      </BrowserView>

      <MobileView>
        <MobileHeader
          PageName="Category"
          Route=""
          cartCount={parsedCartSession.length}
        />
        <main className="main">
          <div className="page-content">
            {categoryData.map((value, index) => (
              <div className="mcatbox-section" key={index}>
                <div className="mcatbox">
                  <div className="mcatbox-inner">
                    <div
                      className="mcatbox-media"
                      onClick={() =>
                        navigate("/collection/category/" + value.cat_slug)
                      }
                    >
                      <img
                        src={
                          value.cat_image != null
                            ? baseUrl + value.cat_image
                            : constant.DEFAULT_IMAGE
                        }
                      />
                    </div>
                    <div
                      className="mcatbox-content"
                      onClick={() =>
                        navigate("/collection/category/" + value.cat_slug)
                      }
                    >
                      <h6>{value.cat_name}</h6>
                      {value.cat_desc != null ? <p>{value.cat_desc}</p> : ""}
                    </div>
                    <div className="mcatbox-arrow">
                      {value.children.length > 0 && (
                        <i
                          className="d-icon-angle-right"
                          onClick={() => toggleSubcategory(index)}
                        ></i>
                      )}
                    </div>
                  </div>
                </div>
                {value.children && value.children.length > 0 && (
                  <div
                    className={`mcatbox-list subcategory-${index}`}
                    style={{ display: "none" }}
                    key={index}
                  >
                    <ul>
                      {value.children.map((subvalue, subindex) => (
                        <a
                          href={"/collection/category/" + subvalue.cat_slug}
                          key={subindex}
                        >
                          <li>
                            {subvalue.cat_name}
                            <i className="d-icon-angle-right"></i>
                          </li>
                        </a>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </MobileView>
    </>
  );
}
export default Category;
