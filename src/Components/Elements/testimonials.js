import React, { useEffect, useRef, useState } from "react";
import constant from "../../Components/Services/constant";
import { ApiService } from "../../Components/Services/apiservices";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import Skeleton from 'react-loading-skeleton'
import {Autoplay } from "swiper/modules";
function Testimonials() {
  const didMountRef = useRef(true);
  const [resTestimonialData, setResTestimonialData] = useState([]);
  const [testimonialImagePath, setTestimonialImagePath] = useState([]);
  const [loading , setLoading] = useState()
  const testimonialCarouselOptions = {
    loop: true,
    spaceBetween:15,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      600: {
        slidesPerView: 3,
      },
      1000: {
        slidesPerView:3,
      },
    },
  };

  useEffect(() => {
    if (didMountRef.current) {
      getTestimonialData();
    }
    didMountRef.current = false;
  }, []);
  const getTestimonialData = () => {
    setLoading(true)
    ApiService.fetchData("featured-testimonial").then((res) => {
      if (res.status == "success") {
        setResTestimonialData(res.resTestimonialData);
        setTestimonialImagePath(res.testimonial_image_path);
        setLoading(false)
      }
    });
  };
  
  return (
    <>
    {resTestimonialData.length > 0 && (

    <section className="sec-pad testimonials">
      <div className="container">
        <div className="section-title mb-3">
       
          <h2 className="testimonials-heading">Our clients trust us</h2>

          <p className="testimonials-desc col-lg-6 col-xl-8 col-md-10 col-xs-12 col-sm-12 mb-4">From The Extraordinary to the Exceptional, Our Best Seller offer a Diverse Range of Premium Products Tailored to Exceed your Desires</p>
          
        </div>
        {loading == true ?
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-4">
                         <div className="testimonial-grid" >
                         <Skeleton
                                  variant="text"
                                  width={420}
                                  height={260}
                                />
                  </div>
          </div>
          <div className="col-lg-4">
                         <div className="testimonial-grid" >
                         <Skeleton
                                  variant="text"
                                  width={420}
                                  height={260}
                                />
                  </div>
          </div>
          <div className="col-lg-4">
                         <div className="testimonial-grid" >
                         <Skeleton
                                  variant="text"
                                  width={420}
                                  height={260}
                                />
                  </div>
          </div>
        </div>
        :
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-12">
          <Swiper {...testimonialCarouselOptions}  modules={[Autoplay]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }} className="testimonial">
              {resTestimonialData.map((value, index) => {
                return (
                  <SwiperSlide key={index}>
                  <div className="testimonial-grid" key={index}>
                    <div>
                      <h3>"</h3>
                    </div>
                    <div
                      className="content"
                      dangerouslySetInnerHTML={{
                        __html: value.testimonial_desc,
                      }}
                    ></div>
                    <div className="d-flex justify-content-start mt-4">
                      <div>
                        <h6 className="testimonial-author">{value.testimonial_name}</h6>
                      </div>
                    </div>
                  </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>}
      </div>
    </section>
    )}
    </>
  );
}
export default Testimonials;
