import React, { useEffect, useRef, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import constant from "../../Components/Services/constant";
import { ApiService } from "../../Components/Services/apiservices";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Skeleton from 'react-loading-skeleton'
import {Autoplay } from "swiper/modules";
function Certification() {
  const didMountRef = useRef(true);

    const [resCertificate, setResCertificate] = useState([]);
    const [certificateImagePath, setCertificateImagePath] = useState([]);
    const breakpoints = {
     
      320: {
        slidesPerView: 3
      },
     
      480: {
        slidesPerView: 3
      },
   
      768: {
        slidesPerView: 4
      },
   
      1024: {
        slidesPerView: 6
      }
    };
  useEffect(() => {
    if(didMountRef.current){
    getCertificateData();
    }
    didMountRef.current = false;
  }, []);
  const getCertificateData = () => {
    ApiService.fetchData("featured-certificate").then((res) => {
      if (res.status == "success") {
        setResCertificate(res.resCertificate);
        setCertificateImagePath(res.certificate_image_path);
      }
    });
  };

  return (
    <>
    {resCertificate.length > 0 && (
    <section className="sec-pad">
      <div className="container">
      <div className="section-title text-center mb-3">
            <h2>Certification</h2>
          </div>
          {/* <Swiper {...certificationCarouselOptions} className="certificate"> */}

    
          <Swiper
           breakpoints={breakpoints}
          slidesPerView={6}
            spaceBetween={15}
      
            className="certificate"
            modules={[Autoplay]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            >
{resCertificate.map((value, index) => {
  return (
    <SwiperSlide key={index}>
    <div className="certificatebox overlay-zoom" key={index}>
      <img
        src={
          value.partner_image != null
            ? certificateImagePath + value.partner_image
            : constant.DEFAULT_IMAGE
        }
        alt={value.partner_name}
     
      />
    </div>
    </SwiperSlide>
  );
})}
</Swiper>
      </div>
    </section>
    )}
    </>
  );
}
export default Certification;
