import React, { useEffect, useRef, useState } from "react";
import constant from "../Services/constant";
import { ApiService } from "../Services/apiservices";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Swiper, SwiperSlide } from "swiper/react";
import StarRating from "./starrating";
import multiCurrency from "../../Components/Elements/multi_currrency";
import numeral from "numeral";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
function FeaturedVideoProducts() {
  const didMountRef = useRef(true);
  const [resProductsData, setResProductsData] = useState([]);
  const [loading, setLoading] = useState();
  useEffect(() => {
    if (didMountRef.current) {
      featuredvideoproductlist();
    }
    didMountRef.current = false;
  }, []);
  const featuredvideoproductlist = () => {
    setLoading(true);
    ApiService.fetchData("featured-video-product-list").then((res) => {
      if (res.status == "success") {
        setResProductsData(res.resProductsData);
        setLoading(false);
      }
    });
  };
  const productvCarouselOptions = {
    loop: false,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false, 

    },
    breakpoints: {
      0: {
        slidesPerView: 2.1,
      },
      600: {
        slidesPerView: 1.5,
      },
      1000: {
        slidesPerView: 4.05,
      },
    },
  };
  return (
    <>
      {loading == true ? (
          <section className="sec-pad pt-0">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-3">
                <figure className="product-media">
                  <Skeleton variant="text" width={300} height={400} />
                </figure>
              </div>
              <div className="col-lg-3">
                <figure className="product-media">
                  <Skeleton variant="text" width={300} height={400} />
                </figure>
              </div>
              <div className="col-lg-3">
                <figure className="product-media">
                  <Skeleton variant="text" width={300} height={400} />
                </figure>
              </div>
              <div className="col-lg-3">
                <figure className="product-media">
                  <Skeleton variant="text" width={300} height={400} />
                </figure>
              </div>
            </div>
          </div>
        </section>
      ) : resProductsData.length > 0 &&(
        <section className="sec-pad pt-0">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-12">
                <Swiper {...productvCarouselOptions}>
                  {resProductsData.map((value, index) => {
                    let mrpValue = parseFloat(value.product_price);
                    let sellingPriceValue = parseFloat(
                      value.product_selling_price
                    );
                    let discount = 0;
                    if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                      discount = (
                        ((mrpValue - sellingPriceValue) / mrpValue) *
                        100
                      );
                    } else {
                      discount = 0;
                    }
                    return (
                      <SwiperSlide key={index}>
                        <div className="product product-wvideo" key={index}>
                          <figure className="product-media">
                            {value.product_video ? (
                              <a href={"/product/" + value.product_slug}>
                              <video
                                src={value.product_video}
                                autoPlay="autoplay"
                                loop
                                muted
                                playsInline
                              ></video>
                               </a>
                            ) : (
                              <img
                                src={
                                  value.product_image != null
                                    ? value.product_image
                                    : constant.DEFAULT_IMAGE
                                }
                                alt={value.product_name}
                                width="280"
                                height="315"
                              />
                            )}
                          </figure>
                          <div className="product-details">
                            <h3 className="product-name">
                              <a href={"/product/" + value.product_slug}>
                                {value.product_name}
                              </a>
                            </h3>
                            <div className="product-price">
                              <ins className="new-price">
                                {multiCurrency(value.product_selling_price)}
                              </ins>
                              {discount > 0 ? (
                                <>
                                  <del className="old-price">
                                    {multiCurrency(value.product_price)}
                                  </del>
                                  <span className="off">{Math.round(discount)}% Off</span>
                                </>
                              ) : null}
                            </div>
                            {value.product_rating &&
                            value.product_rating > 0 ? (
                              <div className="ratings-container">
                                <StarRating
                                  numberOfStars={value.product_rating}
                                />
                                <span>( {value.product_review} reviews )</span>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
export default FeaturedVideoProducts;
