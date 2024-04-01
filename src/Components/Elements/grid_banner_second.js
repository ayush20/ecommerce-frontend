import React, { useEffect, useRef, useState } from "react";
import constant from "../Services/constant";
import { ApiService } from "../Services/apiservices";
import Skeleton from "react-loading-skeleton";
import { BrowserView, MobileView } from "react-device-detect";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
function GridBannerSecond() {
  const didMountRef = useRef(true);
  const [bottomCatProductBanner, setBottomCatProductBanner] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => {
    if (didMountRef.current) {
      getBannerData();
    }
    didMountRef.current = false;
  }, []);
  const getBannerData = () => {
    setLoading(true);
    ApiService.fetchData("bottom-cat-product-banner-list").then((res) => {
      if (res.status == "success") {
        setBottomCatProductBanner(res.bottomCatProductBanner);
        setImageUrl(res.slider_image_path);
        setLoading(false);
      }
    });
  };

  return (
    <>
      <BrowserView>
        {loading == true ? (
          <section className="sec-pad pt-0">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-6">
                  <div className="product">
                    <figure className="product-media">
                    <Skeleton variant="text" width={696} height={218} />
                    </figure>
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                  <div className="product">
                    <figure className="product-media">
                    <Skeleton variant="text" width={696} height={218} />
                    </figure>
                  </div>
                </div>
   
              </div>
            </div>
          </section>
        ) : bottomCatProductBanner.length > 0 &&(
          <section className="sec-pad pt-0">
            <div className="container">
              <div className="row">
                {bottomCatProductBanner.map((value, index) => {
                  return value.slider_view === 2 &&
                    value.slider_video !== "" ? (
                    value.slider_type === 1 && value.slider_url !== "" ? (
                      <div
                        className={"col-lg-" + value.slider_grid_type}
                        key={index}
                      >
                        <a
                          href={value.slider_url}
                          className="addbox overlay-zoom mb-3"
                        >
                          <video
                            src={
                              value.slider_video != null
                                ? imageUrl + value.slider_video
                                : "/assets/img/v01.mp4"
                            }
                            autoPlay="autoplay"
                            loop
                            muted
                            playsInline
                          ></video>
                        </a>
                      </div>
                    ) : value.slider_type === 2 && value.cat_id ? (
                      <div
                        className={"col-lg-" + value.slider_grid_type}
                        key={index}
                      >
                        <a
                          href={"/collection/category/" + value.cat_slug}
                          className="addbox overlay-zoom mb-3"
                        >
                          <video
                            src={
                              value.slider_video != null
                                ? imageUrl + value.slider_video
                                : "/assets/img/v01.mp4"
                            }
                            autoPlay="autoplay"
                            loop
                            muted
                            playsInline
                          ></video>
                        </a>
                      </div>
                    ) : value.slider_type === 3 && value.tag_id ? (
                      <div
                        className={"col-lg-" + value.slider_grid_type}
                        key={index}
                      >
                        <a
                          href={"/collection/tag/" + value.tag_slug}
                          className="addbox overlay-zoom mb-3"
                        >
                          <video
                            src={
                              value.slider_video != null
                                ? imageUrl + value.slider_video
                                : "/assets/img/v01.mp4"
                            }
                            autoPlay="autoplay"
                            loop
                            muted
                            playsInline
                          ></video>
                        </a>
                      </div>
                    ) : (
                      <div
                        className={"col-lg-" + value.slider_grid_type}
                        key={index}
                      >
                        <a
                          href={value.slider_url}
                          className="addbox overlay-zoom mb-3"
                        >
                          <video
                            src={
                              value.slider_video != null
                                ? imageUrl + value.slider_video
                                : "/assets/img/v01.mp4"
                            }
                            autoPlay="autoplay"
                            loop
                            muted
                            playsInline
                          ></video>
                        </a>
                      </div>
                    )
                  ) : value.slider_view === 1 &&
                    value.slider_type === 1 &&
                    value.slider_url !== "" ? (
                    <div
                      className={"col-lg-" + value.slider_grid_type}
                      key={index}
                    >
                      <a
                        href={value.slider_url}
                        className="addbox overlay-zoom mb-3"
                      >
                        <img
                          src={
                            value.slider_image != null
                              ? imageUrl + value.slider_image
                              : constant.DEFAULT_IMAGE
                          }
                          width="300px"
                          height="103px"
                          alt={value.slider_name}
                        />
                      </a>
                    </div>
                  ) : value.slider_view === 1 &&
                    value.slider_type === 2 &&
                    value.cat_id ? (
                    <div
                      className={"col-lg-" + value.slider_grid_type}
                      key={index}
                    >
                      <a
                        href={"/collection/category/" + value.cat_slug}
                        className="addbox overlay-zoom mb-3"
                      >
                        <img
                          src={
                            value.slider_image != null
                              ? imageUrl + value.slider_image
                              : constant.DEFAULT_IMAGE
                          }
                          width="300px"
                          height="103px"
                          alt={value.slider_name}
                        />
                      </a>
                    </div>
                  ) : value.slider_view === 1 &&
                    value.slider_type === 3 &&
                    value.tag_id ? (
                    <div
                      className={"col-lg-" + value.slider_grid_type}
                      key={index}
                    >
                      <a
                        href={"/collection/tag/" + value.tag_slug}
                        className="addbox overlay-zoom mb-3"
                      >
                        <img
                          src={
                            value.slider_image != null
                              ? imageUrl + value.slider_image
                              : constant.DEFAULT_IMAGE
                          }
                          width="300px"
                          height="103px"
                          alt={value.slider_name}
                        />
                      </a>
                    </div>
                  ) : (
                    <div
                      className={"col-lg-" + value.slider_grid_type}
                      key={index}
                    >
                      <a href={"#"} className="addbox overlay-zoom mb-3">
                        <img
                          src={
                            value.slider_image != null
                              ? imageUrl + value.slider_image
                              : constant.DEFAULT_IMAGE
                          }
                          width="300px"
                          height="103px"
                          alt={value.slider_name}
                        />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </BrowserView>
      <MobileView>
        {loading == true ? (
          <section className="sec-pad pt-0">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-6">
                  <div className="product">
                    <figure className="product-media">
                      <Skeleton variant="text" width={400} height={260} />
                    </figure>
                  </div>
                </div> 
              </div>
            </div>
          </section>
        ) : bottomCatProductBanner.length > 0 &&(
          <section className="sec-pad pt-0">
              <div className="container">
                <Swiper
                spaceBetween={10}
                navigation={false}
                loop={true}
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
                    slidesPerView: 1,
                  },
                  992: {
                    slidesPerView: 1,
                  },
                  }}
                >
              <div className="row">
                {bottomCatProductBanner.map((value, index) => {
                  return value.slider_view === 2 &&
                    value.slider_video !== "" ? (
                    value.slider_type === 1 && value.slider_url !== "" ? (
                      <SwiperSlide
                        className={"col-lg-" + value.slider_grid_type}
                        key={index}
                      >
                        <a
                          href={value.slider_url}
                          className="addbox overlay-zoom mb-3"
                        >
                          <video
                            src={
                              value.slider_video != null
                                ? imageUrl + value.slider_video
                                : "/assets/img/v01.mp4"
                            }
                            autoPlay="autoplay"
                            loop
                            muted
                            playsInline
                          ></video>
                        </a>
                      </SwiperSlide>
                    ) : value.slider_type === 2 && value.cat_id ? (
                      <SwiperSlide
                        className={"col-lg-" + value.slider_grid_type}
                        key={index}
                      >
                        <a
                          href={"/collection/category/" + value.cat_slug}
                          className="addbox overlay-zoom mb-3"
                        >
                          <video
                            src={
                              value.slider_video != null
                                ? imageUrl + value.slider_video
                                : "/assets/img/v01.mp4"
                            }
                            autoPlay="autoplay"
                            loop
                            muted
                            playsInline
                          ></video>
                        </a>
                      </SwiperSlide>
                    ) : value.slider_type === 3 && value.tag_id ? (
                      <SwiperSlide
                        className={"col-lg-" + value.slider_grid_type}
                        key={index}
                      >
                        <a
                          href={"/collection/tag/" + value.tag_slug}
                          className="addbox overlay-zoom mb-3"
                        >
                          <video
                            src={
                              value.slider_video != null
                                ? imageUrl + value.slider_video
                                : "/assets/img/v01.mp4"
                            }
                            autoPlay="autoplay"
                            loop
                            muted
                            playsInline
                          ></video>
                        </a>
                      </SwiperSlide>
                    ) : (
                      <SwiperSlide
                        className={"col-lg-" + value.slider_grid_type}
                        key={index}
                      >
                        <a
                          href={value.slider_url}
                          className="addbox overlay-zoom mb-3"
                        >
                          <video
                            src={
                              value.slider_video != null
                                ? imageUrl + value.slider_video
                                : "/assets/img/v01.mp4"
                            }
                            autoPlay="autoplay"
                            loop
                            muted
                            playsInline
                          ></video>
                        </a>
                      </SwiperSlide>
                    )
                  ) : value.slider_view === 1 &&
                    value.slider_type === 1 &&
                    value.slider_url !== "" ? (
                    <SwiperSlide
                      className={"col-lg-" + value.slider_grid_type}
                      key={index}
                    >
                      <a
                        href={value.slider_url}
                        className="addbox overlay-zoom mb-3"
                      >
                        <img
                          src={
                            value.slider_image != null
                              ? imageUrl + value.slider_image
                              : constant.DEFAULT_IMAGE
                          }
                          width="300px"
                          height="103px"
                          alt={value.slider_name}
                        />
                      </a>
                    </SwiperSlide>
                  ) : value.slider_view === 1 &&
                    value.slider_type === 2 &&
                    value.cat_id ? (
                    <SwiperSlide
                      className={"col-lg-" + value.slider_grid_type}
                      key={index}
                    >
                      <a
                        href={"/collection/category/" + value.cat_slug}
                        className="addbox overlay-zoom mb-3"
                      >
                        <img
                          src={
                            value.slider_image != null
                              ? imageUrl + value.slider_image
                              : constant.DEFAULT_IMAGE
                          }
                          width="300px"
                          height="103px"
                          alt={value.slider_name}
                        />
                      </a>
                    </SwiperSlide>
                  ) : value.slider_view === 1 &&
                    value.slider_type === 3 &&
                    value.tag_id ? (
                    <SwiperSlide
                      className={"col-lg-" + value.slider_grid_type}
                      key={index}
                    >
                      <a
                        href={"/collection/tag/" + value.tag_slug}
                        className="addbox overlay-zoom mb-3"
                      >
                        <img
                          src={
                            value.slider_image != null
                              ? imageUrl + value.slider_image
                              : constant.DEFAULT_IMAGE
                          }
                          width="300px"
                          height="103px"
                          alt={value.slider_name}
                        />
                      </a>
                    </SwiperSlide>
                  ) : (
                    <SwiperSlide
                      className={"col-lg-" + value.slider_grid_type}
                      key={index}
                    >
                      <a href={"#"} className="addbox overlay-zoom mb-3">
                        <img
                          src={
                            value.slider_image != null
                              ? imageUrl + value.slider_image
                              : constant.DEFAULT_IMAGE
                          }
                          width="300px"
                          height="103px"
                          alt={value.slider_name}
                        />
                      </a>
                    </SwiperSlide>
                  );
                })}
              </div>
              </Swiper>
            </div>
          </section>
        )}
      </MobileView>
    </>
  );
}
export default GridBannerSecond;
