import React, { useEffect, useState, useRef } from "react";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import Container from "react-bootstrap/Container";
import LoginModal from "../Modals/login_modal";
import CartModal from "../Modals/cart_modal";
import Modal from "react-bootstrap/Modal";
import MenuModal from "../Modals/menu_modal";
import { ApiService } from "../../Components/Services/apiservices";
import HeaderMenu from "../Elements/header_menu";
import sessionCartData from "../../Components/Elements/cart_session_data";
import SpinnerLoader from "../Elements/spinner_loader";
import multiCurrency from "../../Components/Elements/multi_currrency";
import constant from "../../Components/Services/constant";
import BannerModal from "../Modals/banner_modal";

import './header.css';

function Header({ cartCount = 0, state = "" }) {
  const didMountRef = useRef(true);
  const multiCurrencyData = multiCurrency();
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleChildData = (status) => {
    setShow(status);
  };
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const handleShowCart = () => setShowCart(true);
  const handleChildCartData = (status) => {
    setShowCart(status);
  };
  const [cartcounttest, setcartcounttest] = useState(cartCount);
  const handleClose = () => {
    setShowCart(false);
  };

  const [showMenuCart, setShowMenuCart] = useState(false);
  const handleShowMenuCart = () => setShowMenuCart(true);
  const handleChildMenuCartData = (status) => {
    setShowMenuCart(status);
  };
  const handleMenuClose = () => {
    setShowMenuCart(false);
  };
  const [settingData, setSettingData] = useState([]);
  const [settingImagePath, setSettingImagePath] = useState("");
  const [setSession, SetSession] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [headerdata, setHeaderData] = useState({});
  const [popupData, setPopupData] = useState([]);
  const [mobilePopup , setMobilePopup] = useState([])
  const [imageUrl, setImageUrl] = useState("");
  const [showBanner, setShowBanner] = useState();
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const handleBannerClose = () => {
    setShowBanner(false);
  };
  useEffect(() => {
    if (didMountRef.current) {
      getbannerData()
      handleChangeCurrency();
      getheaderdata();
      getSettingsData();    
      SetSession(localStorage.getItem("USER_TOKEN"));
    }
    didMountRef.current = false;
    if (isBrowser) {
      const handleScroll = () => {
        if (window.scrollY > 200) {
          document.getElementById("header_top").classList.add("fixed-head");
          const navbarHeight =
            document.querySelector(".fixed-header").offsetHeight;
          document.body.style.paddingTop = navbarHeight + "px";
        } else {
          document.getElementById("header_top").classList.remove("fixed-head");
          document.body.style.paddingTop = "0";
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const getbannerData = () => {
    ApiService.fetchData("popup-banner").then((res) => {
      if (res.status === "success") {
        setPopupData(res.resPopupBannerData);
        setImageUrl(res.slider_image_path);
        setMobilePopup(res.resPopupBannerMobileData);
        
        if (localStorage.getItem("MODALOPEN") !== "FALSE" && popupData && popupData.length > 0) {
          setShowBanner(true);
        } else {
          setShowBanner(false);
        }
        localStorage.setItem("MODALOPEN", "FALSE");
      }
    });
  };


  const getSettingsData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
        setSettingImagePath(res.setting_image_path);
        setWhatsappUrl(res.sitesettings.admin_whatsapp_no ? "https://wa.me/" + res.sitesettings.admin_whatsapp_no : "")
      
      }
    });
  };
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2) {
        fetchSearchResults();
      }
    }, 300); // Debounce time (adjust as needed)

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const getheaderdata = () => {
    ApiService.fetchData("header-data").then((res) => {
      if (res.status === "success") {
        setHeaderData(res.headerdata);
      }
    });
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchSearchResults = () => {
    const dataString = {
      query: searchTerm,
    };
    ApiService.postData("getsearchdata", dataString).then((res) => {
      if (res.status === "success") {
        setSearchResults(res.data);

        // setCatid(res.resCategory.cat_id);
      } else {
      }
    });
  };
  // Create a ref to the wrapper div to check if the click is outside the element
  const wrapperRef = useRef(null);

  // Function to handle clicks outside the search results
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  // Use useEffect to add event listener when the component mounts
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  const handleChangeCurrency = () => {
    const MultiCurrencySession = localStorage.getItem("MULTI_CURRENCY");
    const parsedMultiCurrencySession = MultiCurrencySession
      ? JSON.parse(MultiCurrencySession)
      : {};
    let selectedValue = "";

    if (parsedMultiCurrencySession) {
      selectedValue = parsedMultiCurrencySession.cr_currency_select;
    } else {
      selectedValue = selectedCurrency;
    }

    const dataString = {
      selectedValue: selectedValue,
    };
    setSpinnerLoading(true);
    ApiService.postData("currency-rates", dataString).then((res) => {
      if (res.status === "success") {
        setSelectedCurrency(selectedValue);
        localStorage.setItem(
          "MULTI_CURRENCY",
          JSON.stringify(res.rowCurrencyRates)
        );
        setSpinnerLoading(false);
      } else {
        setSpinnerLoading(false);
      }
    });
  };

  const handleChange = (event) => {
    const MultiCurrencySession = localStorage.getItem("MULTI_CURRENCY");
    const parsedMultiCurrencySession = MultiCurrencySession
      ? JSON.parse(MultiCurrencySession)
      : {};
    let selectedValue = "";
    if (event) {
      selectedValue = event.target.value;
    } else {
      if (parsedMultiCurrencySession) {
        selectedValue = parsedMultiCurrencySession.cr_currency_select;
      } else {
        selectedValue = selectedCurrency;
      }
    }
    const dataString = {
      selectedValue: selectedValue,
    };
    setSpinnerLoading(true);
    ApiService.postData("currency-rates", dataString).then((res) => {
      if (res.status === "success") {
        setSelectedCurrency(selectedValue);
        localStorage.setItem(
          "MULTI_CURRENCY",
          JSON.stringify(res.rowCurrencyRates)
        );
        setSpinnerLoading(false);
        window.location.reload();
      } else {
        setSpinnerLoading(false);
      }
    });
  };
  return (
    <>
      {spinnerLoading && <SpinnerLoader />}
      <div id="snow"></div>
      <BrowserView>
        {headerdata?.header_top ? (
          <div className="top-header">
            <Container>
              <div className="top-header-container row justify-space-between align-items-center">
                  <div className="header-text col-xs-10 col-lg-10 col-md-10 col-xs-12 col-sm-12 justify-content-center align-items-center"
                    dangerouslySetInnerHTML={{ __html: headerdata.header_top }}>

                  </div> 
                  {whatsappUrl != "" && <div className="col-xs-2 col-lg-2 col-md-2 col-xs-12 col-sm-12">
                      <a target="_blank" href={whatsappUrl}>
                        <div className="whatsapp-connect-info px-1 py-1">
                          <div className="mx-2">{settingData.admin_whatsapp_no}</div>
                          <img width={20} height={20} alt="Group" src="img/whatsapp1.png" />
                        </div>
                      </a>
                    </div>
                  }
              </div>
            </Container>
          </div>
        ) : null}
        <header
         className="header"
        >
          <div className={
            state == "" ? "fixed-header header-middle" : " fixed-header header-middle " + state
          }
          id="header_top">
            <Container>
              <div className="header-left">
                {/* <a href="/" className="logo">
                  <img src="/img/zinc_logo.png" alt="logo" width="140" height="43" />
                </a> */}
                <a href="/" className="logo me-5">
              
                  <img
                  src={settingData.logo != null ? settingImagePath + settingData.logo : "/img/logodefault.png"} alt={settingData.logo}
                    width={125}
                    height={52}
                  />
                </a>
                {/* <div className="header-search" onBlur={handleBlur}>
                  <form action="#" className="input-wrapper">
                    <input
                      type="text"
                      className="form-control"
                      name="search"
                      autoComplete="off"
                      placeholder="Search for products, brands & more..."
                      required=""
                      onChange={handleInputChange}
                      value={searchTerm}
                    />
                    {searchResults &&
                    searchResults.length > 0 &&
                    searchTerm.trim() !== "" ? (
                      <div className="header-search-list" id="search_input">
                        <ul>
                          {searchResults.map((value, index) => (
                            <a href={value.redirect}>
                              <li key={index}>{value.name}</li>
                            </a>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                    <button
                      className="btn btn-search"
                      type="submit"
                      title="submit-button"
                    >
                      <i className="d-icon-search"></i>
                    </button>
                  </form>
                </div> */}
              </div>
              <div className="header-center">
                {/* <nav className="navbar navbar-expand-lg navbar-light">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a className="nav-link" href="/meet-the-makers">
                        Meet the Makers
                      </a>
                    </li>
                    <li className="nav-item dropdown dropdown-hover">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                       About
                      </a>
                      <ul
                        className="dropdown-menu submenu"
                        aria-labelledby="navbarDropdown"
                      >
                         <li>
                          <a className="dropdown-item" href="/who-we-are">
                          Who We Are
                          </a>
                        </li>

                          <li>
                          <a className="dropdown-item" href="/our-story">
                            Our Story
                          </a>
                        </li>
                         <li>
                          <a className="dropdown-item" href="/our-team">
                           Our Team
                          </a>
                        </li> 
                        <li>
                          <a className="dropdown-item" href="/blogs">
                            Blog
                          </a>
                        </li>
                       
                       
                      </ul>
                    </li>
                    <li className="nav-item dropdown dropdown-hover">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Connect
                      </a>
                      <ul
                        className="dropdown-menu submenu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <a className="dropdown-item" href="/career">
                            Career
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="/feedback-form">
                          Feedback Form
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="/contact-us">
                          Contact Us 
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/gifting">
                       Gifting
                      </a>
                    </li>
                  </ul>
                </nav> */}

                <HeaderMenu />
              </div>
              <div className="header-right justify-content-end">
                {setSession ? (
                  <>
                    <a
                      className="login-link"
                      href="/account/account-overview"
                      title="login"
                    >
                      <i className="d-icon-user"></i>
                    </a>
                    <a
                      className="wishlist"
                      href="/account/wishlist"
                      title="wishlist"
                    >
                      <i className="d-icon-heart"></i>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      className="login-link"
                      href="javascript:void(0)"
                      title="login"
                      onClick={handleShow}
                    >
                      <i className="d-icon-user"></i>
                    </a>
                    <a
                      className="wishlist"
                      href="javascript:void(0)"
                      title="wishlist"
                      onClick={handleShow}
                    >
                      <i className="d-icon-heart"></i>
                    </a>
                  </>
                )}
                <a
                  className="cart-toggle"
                  href="javascript:void(0)"
                  title="cart"
                  onClick={handleShowCart}
                >
                  <i className="d-icon-bag"></i>
                  {showCart ? (
                    <span className="cart-count">{cartCount}</span>
                  ) : (
                    <span className="cart-count">
                      {parsedCartSession.length}
                    </span>
                  )}
                </a>
              </div>
            </Container>
          </div>
          {/* <div className="header-bottom">
            <Container>
              <HeaderMenu />
            </Container>
          </div> */}
        </header>
      </BrowserView>
      <MobileView>
        {headerdata?.header_top ? (
          <div className="top-header">
            <Container>
              <div className="top-header-container row justify-space-between align-items-center">
                  <marquee>
                    <div className="header-text col-xs-10 col-lg-10 col-md-10 col-xs-12 col-sm-12 justify-content-center align-items-center"
                      dangerouslySetInnerHTML={{ __html: headerdata.header_top }}>

                    </div> 
                  </marquee>
                  {whatsappUrl != "" && <div className="col-xs-2 col-lg-2 col-md-2 col-xs-12 col-sm-12">
                      <a target="_blank" href={whatsappUrl}>
                        <div className="whatsapp-connect-info px-1 py-1">
                          <div className="mx-2">{settingData.admin_whatsapp_no}</div>
                          <img width={20} height={20} alt="Group" src="img/whatsapp1.png" />
                        </div>
                      </a>
                    </div>
                  }
              </div>
            </Container>
          </div>
        ) : null}
        <header className="mheader d-flex">
          <div className="mheader-left">
            <a
              href="javascript:void(0)"
              className="sidenav-trigger"
              onClick={handleShowMenuCart}
            >
              <i className="d-icon-bars2"></i>
            </a>
            {/* <a href="/" className="logo me-2">
                  <img src="/img/zinc_logo.png" alt="logo" width="70" height="22" />
                </a> */}
            <a href="/" className="mlogo">
              <img src="/img/logo.png" alt="logo" width="70" height="27" />
            </a>
          </div>
          <div className="mheader-right">
            <a className="search-link" href="/search" title="search">
              <i className="d-icon-search"></i>
            </a>
            {setSession ? (
              <>
                <a
                  className="login-link"
                  href="/account/account-overview"
                  title="login"
                >
                  <i className="d-icon-user"></i>
                </a>
              </>
            ) : (
              <>
                <a
                  className="login-link"
                  href="javascript:void(0)"
                  title="login"
                  onClick={handleShow}
                >
                  <i className="d-icon-user"></i>
                </a>
              </>
            )}
            <a
              className="cart-toggle"
              href="javascript:void(0)"
              title="cart"
              onClick={handleShowCart}
            >
              <i className="d-icon-bag"></i>
              <span className="cart-count">{cartCount}</span>
            </a>
          </div>
        </header>
      </MobileView>
      {show && <LoginModal showmodal={show} onChildData={handleChildData} />}
      <Modal show={showCart} onHide={handleClose} className="right cart-modal">
        {showCart && (
          <CartModal
            showcartmodal={showCart}
            onChildCartData={handleChildCartData}
          />
        )}
      </Modal>

      <Modal
        show={showMenuCart}
        onHide={handleMenuClose}
        className="left menu-modal"
      >
        {showMenuCart && (
          <MenuModal
            showMenucartmodal={showMenuCart}
            onChildCartData={handleChildMenuCartData}
          />
        )}
      </Modal>
      
      <Modal show={showBanner} onHide={handleBannerClose}>
        {showBanner && popupData && popupData.length > 0 && (
          <BannerModal
            mobilePopup={mobilePopup}
            popupData={popupData}
            imageUrl={imageUrl}
          />
        )}
      </Modal>
    </>
  );
}
export default Header;
