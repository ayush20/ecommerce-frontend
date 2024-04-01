import React, { useEffect, useRef, useState } from "react";
import constant from "../../Components/Services/constant";
import { ApiService } from "../../Components/Services/apiservices";
import { BrowserView, MobileView } from "react-device-detect";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay} from "swiper/modules";
import Skeleton from 'react-loading-skeleton'
function FeaturedCategories() {
  const didMountRef = useRef(true);
  const [resCategoryData, setResCategoryData] = useState([]);
  const [CategoryImagePath, setCategoryImagePath] = useState('');
  
  const catCarouselOptions = {
    loop: false,
    spaceBetween: 15,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 7.5,
      },
      600: {
        slidesPerView: 3,
      },
      1000: {
        slidesPerView: 7.1,
      },
    },
  };
  useEffect(() => {
    if(didMountRef.current){
        getCategoryData();
    }
    didMountRef.current = false;
  }, []);
  const getCategoryData = () => {
    ApiService.fetchData("featured-category").then((res) => {
      if (res.status == "success") {
        setResCategoryData(res.resCategory);
        setCategoryImagePath(res.category_image_path);
      }
    });
  };

  return (
    <> 
    <BrowserView>
      <div className="container">
        <div className="section-title d-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0 tag-title">Shop by category</h2>
          <a className="btn-tag-all" href={"/collection/category"}>
            All <i className="d-icon-arrow-right"></i>
          </a>
        </div>
        <div className="row">
          <p className="tag-meta-desc col-lg-6 col-md-10 col-sm-12 col-xs-12 col-xl-8">
            From The Extraordinary to the Exceptional, Our Best Seller offer a Diverse Range of Premium Products Tailored to Exceed your Desires
          </p>
        </div>
      </div>

    {resCategoryData.length > 0 && (
      <section className="sec-pad pt-0">
          <div className="container">

          {resCategoryData.map((value, index) => <div className="category-card mb-4">
              <div className="category-media col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <img
                  src={
                    value.cat_image != null
                      ? CategoryImagePath + value.cat_image
                      : constant.DEFAULT_IMAGE
                  }
                  // height={320}
                  // width={320}
                  alt={value.cat_name}
                />
              </div>
              <div className="category-details col-xl-8 col-lg-8 col-md-8 col-sm-6 col-xs-6">
                <div className="catbox-title">{value.cat_name}</div>
                <div className="catbox-desc">{value.cat_desc}</div>
                <a className="btn-category-products" href={"/collection/category/" + value.cat_slug}>
                  Explore products <i className="d-icon-arrow-right"></i>
                </a>
              </div>
            </div>
          )}

          {/* <Swiper 
          spaceBetween={15}
          navigation={false}
          loop={false}
          pagination={false}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            0: {
              slidesPerView: 5.5,
            },
            768: {
              slidesPerView: 3,
            },
            992: {
              slidesPerView: 7.1,
            },
          }}
          >
              {resCategoryData.map((value, index) => {
                return (
                  <SwiperSlide key={index}>
                  <a href={"/collection/category/"+value.cat_slug} className="catbox item" key={index}>
                    <div className="catbox-media">
                      <img
                        src={
                          value.cat_image != null
                            ? CategoryImagePath + value.cat_image
                            : constant.DEFAULT_IMAGE
                        }
                        alt={value.cat_name}
                      />
                    </div>
                    <div className="catbox-title">{value.cat_name}</div>
                  </a>
                  </SwiperSlide>
                );
              })}
      </Swiper> */}
          </div>
        </section>
)}
    </BrowserView>
    <MobileView>
    <div className="container">
        <div className="section-title d-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0 tag-title">Shop by category</h2>
          <a className="btn-tag-all" href={"/collection/category"}>
            All <i className="d-icon-arrow-right"></i>
          </a>
        </div>
        <div className="row">
          <p className="tag-meta-desc col-lg-6 col-md-10 col-sm-12 col-xs-12 col-xl-8">
            From The Extraordinary to the Exceptional, Our Best Seller offer a Diverse Range of Premium Products Tailored to Exceed your Desires
          </p>
        </div>
      </div>

    {resCategoryData.length > 0 && (
      <section className="sec-pad pt-2 pb-2 mobile-cat">
        
         
          {/* <Swiper 
          spaceBetween={10}
          navigation={false}
          loop={false}
          pagination={false}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 3,
            },
            992: {
              slidesPerView: 7.1,
            },
          }}
          >
              {resCategoryData.map((value, index) => {
                return (
                  <SwiperSlide key={index}>

                    
                  <a href={"/collection/category/"+value.cat_slug} className="catbox item" key={index}>
                  <div className="category-card">
                    <div className="category-media col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4">
                      <img
                        src={
                          value.cat_image != null
                            ? CategoryImagePath + value.cat_image
                            : constant.DEFAULT_IMAGE
                        }
                        // height={320}
                        // width={400}
                        alt={value.cat_name}
                      />
                    </div>
                    <div className="category-details col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-8">
                      <div className="catbox-title">{value.cat_name}</div>
                      <div className="catbox-desc">{value.cat_desc}</div>
                      <a className="btn-category-products" href={"/collection/category/" + value.cat_slug}>
                        Explore products <i className="d-icon-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                  </a>

                  
                   </SwiperSlide> 
                );
              })}
            </Swiper> */}

            {resCategoryData.map((value, index) => <div className="category-card mb-4">
              <div className="category-media col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <img
                  src={
                    value.cat_image != null
                      ? CategoryImagePath + value.cat_image
                      : constant.DEFAULT_IMAGE
                  }
                  // height={320}
                  // width={320}
                  alt={value.cat_name}
                />
              </div>
              <div className="category-details col-xl-8 col-lg-8 col-md-8 col-sm-6 col-xs-6">
                <div className="catbox-title">{value.cat_name}</div>
                <div className="catbox-desc">{value.cat_desc}</div>
                <a className="btn-category-products" href={"/collection/category/" + value.cat_slug}>
                  Explore products <i className="d-icon-arrow-right"></i>
                </a>
              </div>
            </div>
          )}
     
        </section>
)}
    </MobileView>
    
    </>
  );
}
export default FeaturedCategories;
