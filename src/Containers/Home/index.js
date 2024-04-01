import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../Components/Services/apiservices";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import constant from "../../Components/Services/constant"; 
import Testimonials from "../../Components/Elements/testimonials";
import Certification from "../../Components/Elements/certification";
import CategoryWiseProducts from "../../Components/Elements/category_wise_products";
import TagWiseProducts from "../../Components/Elements/tag_wise_products";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import HomeTopBanner from "../../Components/Elements/home_top_banner";
import FeaturedCategories from "../../Components/Elements/featured_categories";
import GridBannerFirst from "../../Components/Elements/grid_banner_first";
import GridBannerSecond from "../../Components/Elements/grid_banner_second";
import FeaturedVideoProducts from "../../Components/Elements/featured_video_products";
import sessionCartData from "../../Components/Elements/cart_session_data";
import { Helmet } from "react-helmet";
import GridBannerThird from "../../Components/Elements/grid_banner_third";
import "./home.css";
import OccasionWiseProducts from "../../Components/Elements/occasion_wise_products";
import SpaceWiseProducts from "../../Components/Elements/space_wise_products";
import Highlight from "../../Components/Highlights";

function Home() { 
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const didMountRef = useRef(true); 
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const [cartCount, setCartCount] = useState(parsedCartSession.length);
  const [pageData , setPageData] = useState("")
  const [settingData, setSettingData] = useState([]);
  const [settingImagePath, setSettingImagePath] = useState("");
  useEffect(() => {
    if(didMountRef.current){
      getSettingsData();
      setTimeout(() => {
        setSpinnerLoading(false);
      }, 1000);

      const getPageData = {
        slug: "home",
      };
      ApiService.postData("page-content", getPageData).then((res) => {
        if (res.status == "success") {
          setPageData(res.data)
          
        } else {
          
        }
      });
    }
    didMountRef.current = false;
  }, []);
  const handleCartCount = (status) => {
    const dataArray = sessionCartData();
    const parsedCartSession = dataArray[1];
    setCartCount(parsedCartSession.length)
  };
  const getSettingsData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
        setSettingImagePath(res.setting_image_path)
       
      }
    });
  };
  return (
    <>
      <Helmet>
      <title>{pageData.page_meta_title}</title>
      <meta name="description" itemprop="description" content={pageData.page_meta_desc != null ? pageData.page_meta_desc :"Momabatti"} />
      {pageData.page_meta_keyword != null ?<meta name="keywords" content={pageData.page_meta_keyword} />:""}
      <link rel="canonical" href={window.location.href} />
      <meta property="og:title" content={pageData.page_meta_title} />
      <meta property="og:image" content= {constant.FRONT_URL+'img/logo.png'}/>
      <meta property="og:url" content={window.location.href} />
      <meta property="og:description" content= {pageData.page_meta_desc != null ?pageData.page_meta_desc:"Momabatti"} />
      <meta name="twitter:title" content={pageData.page_meta_title} />
      <meta name="twitter:description" content={pageData.page_meta_desc != null ?pageData.page_meta_desc:"Momabatti"} />
      <meta property="twitter:image" content={constant.FRONT_URL + 'img/logo.png'} />
      <meta name="twitter:url" content={window.location.href} />
      </Helmet>

      <BrowserView>
        {spinnerLoading && <SpinnerLoader />}
        <Header cartCount={cartCount}/>
        <HomeTopBanner />
        <div className="sec-pad"></div>
        {/* <BestSellers /> */}
        {/* <GridBannerFirst />  */}
         <TagWiseProducts onParentData={handleCartCount} />
         {/* <div className="sec-pad"></div> */}

         <FeaturedCategories />

         <OccasionWiseProducts />
         
         <SpaceWiseProducts />
        {/* <GridBannerThird /> */}
        {/* <FeaturedVideoProducts /> */}
        {/* <CategoryWiseProducts onParentData={handleCartCount}/> */}
        {/* <GridBannerSecond />  */}
        <Testimonials />
        {/* <Certification /> */}
        {/* <section className="sec-pad">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-7">
                <img src={settingData.boso_logo != null ? settingImagePath + settingData.boso_logo : "/img/boso.png"} alt={settingData.boso_logo} className="footer-top-logo" width='200px' height='205px'/>
                <h2>BUY ONE SUPPORT ONE</h2> 
                <h6 className="line24">We’re an exclusive artisans’ & farmers’ marketplace, bringing you home-grown, traditionally made, artisanal & earth-friendly products that inspire a way of conscious living. Every time you buy from heartswithfingers, you’re directly supporting a budding micro-enterprise on its journey towards sustainability.

                </h6>
                <a href="/who-we-are" className="btn-primary-outline btn btn-medium mt-3">Learn More</a>
              </div>
            </div>
          </div>
        </section> */}
        <div style={{background: '#000'}}>
          <Highlight />
        </div>
        <Footer />
      </BrowserView>
      <MobileView>
        {spinnerLoading && <SpinnerLoader />}
        <Header cartCount={cartCount}/>
        <HomeTopBanner />
        <TagWiseProducts onParentData={handleCartCount} />
        <FeaturedCategories /> 
        <OccasionWiseProducts />
         
         <SpaceWiseProducts />

        {/* <GridBannerFirst /> 
        <TagWiseProducts onParentData={handleCartCount} />
        <GridBannerThird />
        <FeaturedVideoProducts />
        <CategoryWiseProducts onParentData={handleCartCount}/>
        <GridBannerSecond /> */}
        <Testimonials />
        {/* <Certification />
        <section className="sec-pad">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-7">
              <img src={settingData.boso_logo != null ? settingImagePath + settingData.boso_logo : constant.DEFAULT_IMAGE} alt={settingData.logo} className="footer-top-logo" width='200px' height='205px'/>
                <h4>BUY ONE SUPPORT ONE</h4> 
                <h6 className="line24 tx-12">We’re an exclusive artisans’ & farmers’ marketplace, bringing you home-grown, traditionally made, artisanal & earth-friendly products that inspire a way of conscious living. Every time you buy from heartswithfingers, you’re directly supporting a budding micro-enterprise on its journey towards sustainability.</h6>
                <a href="/who-we-are" className="btn-primary-outline btn btn-medium mt-3">Learn More</a>
              </div>
            </div>
          </div>
        </section> */}
        <div style={{background: '#000'}}>
          <Highlight />
        </div>
        <Footer />
      </MobileView>
    </>
  );
}
export default Home;
