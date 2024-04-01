import React, { useEffect, useRef, useState } from "react";
import constant from "../../Components/Services/constant";
import { ApiService } from "../../Components/Services/apiservices";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay} from "swiper/modules";
import "swiper/css"; 
import { BrowserView, MobileView } from "react-device-detect";
import Skeleton from "react-loading-skeleton";
import Highlight from "../Highlights";
// SwiperCore.use([Navigation, Pagination]);

function HomeTopBanner() {
    const didMountRef = useRef(true);
    const [resTopBannerData, setResTopBannerData] = useState([]);
    const [resMobileBannerData, setResMobileBannerData] = useState([]);
    const [loading , setLoading] = useState()
    const [imageUrl, setImageUrl] = useState("");
    useEffect(() => {
        // if (didMountRef.current) {
          getBannerData();
        // }
        // didMountRef.current = false;
      }, []);
    const getBannerData = () => {
      setLoading(true)
        ApiService.fetchData("top-banner-list").then((res) => {
          if (res.status == "success") {
            setResTopBannerData(res.resTopBannerData);
            setResMobileBannerData(res.resMobileBannerData);
            setImageUrl(res.slider_image_path);
            setLoading(false)
          }
        });
      };
    const renderCarouselItem = (value, index) => {
        if (value.slider_view === 2 && value.slider_video !== "") {
          return renderVideoItem(value, index);
        } else  if (value.slider_type === 1 && value.slider_url !== "") {
          return renderLinkItem(value, index);
        } else if (value.slider_type === 2 && value.cat_id) {
          return renderCategoryItem(value, index);
        } else if (value.slider_type === 3 && value.tag_id) {
          return renderTagItem(value, index);
        } else {
          return renderDefaultItem(value, index);
        }
        //return renderDefaultItem(value, index);
      };
      
      const renderVideoItem = (value, index) => {
        return (
          <div className="item" key={index}>
            <video
              src={value.slider_video ? imageUrl + value.slider_video : "/assets/img/v01.mp4"}
              autoPlay="autoplay"
              loop
              muted
              playsInline
            ></video>
          </div>
        );
      };
      
      const renderLinkItem = (value, index) => {
        return (
          <div className="item" key={index}>
            <a href={value.slider_url}>
              <img
                src={value.slider_image ? imageUrl + value.slider_image : constant.DEFAULT_IMAGE}
                alt={value.slider_name}
              />
            </a>
          </div>
        );
      };
      
      const renderCategoryItem = (value, index) => {
        return (
          <div className="item" key={index}>
            <a href={"/collection/category/" + value.cat_slug}>
              <img
                src={value.slider_image ? imageUrl + value.slider_image : constant.DEFAULT_IMAGE}
                alt={value.slider_name}
              />
            </a>
          </div>
        );
      };
      
      const renderTagItem = (value, index) => {
        return (
          <div className="item" key={index}>
            <a href={"/collection/tag/" + value.tag_slug}>
              <img
                src={value.slider_image ? imageUrl + value.slider_image : constant.DEFAULT_IMAGE}
                alt={value.slider_name}
              />
            </a>
          </div>
        );
      };
      
      const renderDefaultItem = (value, index) => {
        return (
          <div className="item" key={index}>
            <img
              src={value.slider_image ? imageUrl + value.slider_image : constant.DEFAULT_IMAGE}
              alt={value.slider_name}
            />
          </div>
        );
      };

  return (
    <>  <BrowserView>

    {loading == true ?
    <div className="home-slider">
        <Skeleton
          variant="text"
          width="100%"
          height={600}
            />
        </div>
:
     <div className="home-slider">{/* {...sliderOptions} */}
        <Swiper
          slidesPerView={1}
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
              slidesPerView: 1,
            },
            992: {
              slidesPerView: 1,
            },
          }}
        >
         {resTopBannerData
            ? resTopBannerData.map((value, index) => (
                <SwiperSlide key={index}>{renderCarouselItem(value, index)}</SwiperSlide>
              ))
            : null}
        </Swiper>

        <div style={{position: 'absolute', width: '100%', bottom: 0, zIndex:2}}>
          <Highlight />
        </div>
        
      </div>}
    </BrowserView>
    <MobileView>
    {loading == true ?
    <div className="home-slider">
         <Skeleton
           variant="text"                  
           height={350}
         />
        </div>
    
   : <div className="home-slider">{/* {...sliderOptions} */}
        <Swiper
          slidesPerView={1}
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
              slidesPerView: 1,
            },
            992: {
              slidesPerView: 1,
            },
          }}
        >
         {resMobileBannerData
            ? resMobileBannerData.map((value, index) => (
                <SwiperSlide key={index}>{renderCarouselItem(value, index)}</SwiperSlide>
              ))
            : null}
        </Swiper>
        
        </div>}
    </MobileView>
     
    </>
  );
}
export default HomeTopBanner;
