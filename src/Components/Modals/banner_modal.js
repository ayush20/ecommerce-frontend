import React, { useEffect, useRef, useState } from "react";
import constant from "../../Components/Services/constant";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ApiService } from "../../Components/Services/apiservices";
import SpinnerLoader from '../../Components/Elements/spinner_loader';
import Alert from 'react-bootstrap/Alert';
import { BrowserView, MobileView } from "react-device-detect";
function BannerModal({popupData , imageUrl , mobilePopup}) {
  const didMountRef = useRef(true);

  const [show, setShow] = useState();
  const [settingData, setSettingData] = useState([]);

  useEffect(() => {
    if(didMountRef.current){

    getSettingsData()
   
    }
    didMountRef.current = false;

  }, []);

  useEffect(()=>{
    if(localStorage.getItem("MODALOPEN") != "FALSE"){
               
      } 
  })

  const getSettingsData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
         
      }
    });
  };

  const renderCarouselItem = (value, index) => {
    if (value.slider_type === 1 && value.slider_url !== "") {
      return renderLinkItem(value, index);
    } else  if (value.slider_type === 2 && value.cat_id !== "") {
      return renderCategoryItem(value, index);
    } else if (value.slider_type === 3 && value.tag_id) {
      return renderTagItem(value, index);
    } else {
      return renderDefaultItem(value, index);
    }

  };

  const renderLinkItem = (value, index) => {
    return (
      <div  key={index}>
        <a href={value.slider_url}>
          <img
            src={value.slider_image ? imageUrl + value.slider_image : constant.DEFAULT_IMAGE}
            alt={value.slider_name} className="w-100"
          />
        </a>
      </div>
    );
  };
  
  const renderCategoryItem = (value, index) => {
    return (
      <div key={index} >
        <a href={"/collection/category/" + value.cat_slug}>
          <img
            src={value.slider_image ? imageUrl + value.slider_image : constant.DEFAULT_IMAGE}
            alt={value.slider_name} className="w-100"
          />
        </a>
      </div>
    );
  };
  
  const renderTagItem = (value, index) => {
    return (
      <div  key={index}>
        <a href={"/collection/tag/" + value.tag_slug}>
          <img
            src={value.slider_image ? imageUrl + value.slider_image : constant.DEFAULT_IMAGE}
            alt={value.slider_name}
            className="w-100"
          />
        </a>
      </div>
    );
  };
  
  const renderDefaultItem = (value, index) => {
    return (
      <div key={index} >
        <img
          src={value.slider_image ? imageUrl + value.slider_image : "/img/banner.jpg"}
          alt={value.slider_name}
          className="w-100"
        />
      </div>
    );
  };

 
  const handleClose = () =>{
    setShow(false)
    // handleChildBannerFomrData(false)

  };


  return (
    <> 
    <BrowserView>
    {popupData && <div>{renderCarouselItem(popupData, 0)}</div>}
      </BrowserView>

    <MobileView>
    {mobilePopup && <div>{renderCarouselItem(mobilePopup, 0)}</div>}
      </MobileView>      
      
    </>
  );
}
export default BannerModal;
