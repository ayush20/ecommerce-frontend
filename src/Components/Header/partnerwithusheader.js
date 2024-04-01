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

function PartnerWithUsHeader({ cartCount = 0, state = "" }) {
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

  useEffect(() => {
    if (didMountRef.current) {
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

  const getSettingsData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
        setSettingImagePath(res.setting_image_path)
       
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
      <BrowserView>
        {headerdata?.header_top ? (
          <div className="top-header">
            <Container>
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-6">
                  <marquee>{headerdata.header_top}</marquee>
                </div>
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
                <a href="/" className="logo">
              
                  <img
                  src={settingData.logo != null ? settingImagePath + settingData.logo : "/img/logodefault.png"} alt={settingData.logo}
                    width={125}
                    height={52}
                  />
                </a>
             
              </div>
              <div className="header-center">
                <nav className="navbar navbar-expand-lg navbar-light">
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
                        {/* <li>
                          <a className="dropdown-item" href="/our-team">
                           Our Team
                          </a>
                        </li> */}
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
                    {/* <li className="nav-item">
                      <a className="nav-link" href="/gifting">
                       Gifting
                      </a>
                    </li> */}
                  </ul>
                </nav>
              </div>
              <div className="header-right justify-content-end">
              {setSession ? (
                  <>
                
                </>
             
              ) : (
              <>
                {/* <a href="https://seller.heartswithfingers.com/"  className="btn btn-primary-outline btn-medium me-3" target="_blank">Login</a> */}
              </>
            )}
             <a href="https://seller.heartswithfingers.com/"  className="btn btn-primary-outline btn-medium me-3" target="_blank">Seller Login</a>
              <a href="https://seller.heartswithfingers.com/seller-registration" className="btn btn-primary btn-medium me-3" target="_blank">Start Selling</a>
              
              </div>
            </Container>
          </div>
        
        </header>
      </BrowserView>
      <MobileView>
        {headerdata?.header_top ? (
          <div className="top-header">
            <Container>
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-12 ">
                  <marquee>{headerdata.header_top}</marquee>
                </div>
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
            <a href="/" className="mlogo">
              <img src="/img/logo.png" alt="logo" width="90" height="37" />
            </a>
          </div>
          <div className="mheader-right">
            
            {setSession ? (
              <>
                {/* <a
                  className="login-link"
                  href="/account/account-overview"
                  title="login"
                >
                  <i className="d-icon-user"></i>
                </a> */}
              </>
            ) : (
              <>
                {/* <a
                  className="login-link"
                  href="javascript:void(0)"
                  title="login"
                  onClick={handleShow}
                >
                  <i className="d-icon-user"></i>
                </a> */}
              </>
            )}
            {/* <a
              className="cart-toggle"
              href="javascript:void(0)"
              title="cart"
              onClick={handleShowCart}
            >
              <i className="d-icon-bag"></i>
              <span className="cart-count">{cartCount}</span>
            </a> */}
            <a href="https://seller.heartswithfingers.com/"  className="btn btn-primary-outline btn-medium me-3" target="_blank">Seller Login</a>
              <a href="https://seller.heartswithfingers.com/seller-registration" className="btn btn-primary btn-medium me-3" target="_blank">Start Selling</a>
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
    </>
  );
}
export default PartnerWithUsHeader;
