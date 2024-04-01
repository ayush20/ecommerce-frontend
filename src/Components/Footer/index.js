import React, { useEffect, useRef, useState } from "react";
import constant from "../../Components/Services/constant";
import { ApiService } from "../../Components/Services/apiservices";
import { BrowserView, MobileView } from "react-device-detect";
import { validEmail } from '../../Components/Elements/Regex';
import LoginModal from "../Modals/login_modal";
import Alert from 'react-bootstrap/Alert';
import { useLocation } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

function Footer() {
  const location = useLocation();
  const didMountRef = useRef(true);
  const [show, setShow] = useState(false);
  const [settingData, setSettingData] = useState([]);
  const [settingImagePath, setSettingImagePath] = useState("");
  const [footer1, setFooter1] = useState("");
  const [footer2, setFooter2] = useState("");
  const [footer3, setFooter3] = useState("");
  const [footer4, setFooter4] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [setSession,SetSession] = useState('')
  const [whatsappUrl , setWhatsappUrl] = useState('')
  const [accountStatus,SetAccountStatus] = useState(false)
  const handleShow = () => setShow(true);
  const handleChildData = (status) => {
    setShow(status)
  };
  const [newsletterDetails, setNewsletterDetails] = useState({ 
    newsletter_email: "",
  });  
  useEffect(() => {
    if (didMountRef.current) {
      getSettingsData();
      getFooterData();
      SetSession(localStorage.getItem('USER_TOKEN'))
      const currentPath = location.pathname;
      const isAccountOverview = currentPath.includes("/account/account-overview");
      const isAddressPage = currentPath.includes("/account/address");
      const isWishlistPage = currentPath.includes("/account/wishlist");
      const ishelpandsupportPage = currentPath.includes("/account/help-and-support");
      const isaboutusPage = currentPath.includes("/account/about-us");

      if (isAccountOverview || isWishlistPage || isAddressPage || ishelpandsupportPage || isaboutusPage) {
        SetAccountStatus(true)
      } else {
        SetAccountStatus(false)
      }
    }
    didMountRef.current = false;
  }, []);
  const getSettingsData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
        setSettingImagePath(res.setting_image_path)
        setWhatsappUrl(res.sitesettings.admin_whatsapp_no ? "https://wa.me/" + res.sitesettings.admin_whatsapp_no : "")
       
      }
    });
  };
  const getFooterData = () => {
    ApiService.fetchData("footer").then((res) => {
      if (res.status === "success") {
        if (res.footerData?.footer_desc1) { 
          setFooter1(res.footerData.footer_desc1);
        }
        if (res.footerData?.footer_desc2) { 
          setFooter2(res.footerData.footer_desc2);
        }
        if (res.footerData?.footer_desc3) { 
          setFooter3(res.footerData.footer_desc3);
        }
        if (res.footerData?.footer_desc4) { 
          setFooter4(res.footerData.footer_desc4);
        }
      }
    });
  };

  const onTodoChange = (e) => {
    const { name, value } = e.target;
    setNewsletterDetails((prevState) => ({
      ...prevState,
      [name]: value,
    })); 
  };

  const resetNewsletterForm = () => {
    setNewsletterDetails({ newsletter_email: "" });
  };
  const newsletterProcess = () => {
    let counter = 0;
    const myElements = document.getElementsByClassName("newsletterRequired");
    for (let i = 0; i < myElements.length; i++) {
      if (myElements[i].value === '') {
        myElements[i].style.border = '1px solid red';
        counter++;
      } else {
        myElements[i].style.border = '';
      }
    }
    if (counter === 0) {
      setErrorMessage("");
      if (!validEmail.test(newsletterDetails.newsletter_email)) {
        setErrorMessage("Please enter valid Email Id");
        return false;
      }   
      ApiService.postData('newsletter-process',newsletterDetails).then((res) => {
        if (res.status === "success") {
          setSuccessMessage(res.message)
          resetNewsletterForm();
          setTimeout(() => {
            setSuccessMessage('')
          }, 2000);
        }else{
          setErrorMessage(res.message)
          setTimeout(() => {
            setErrorMessage('')
          }, 2000);
        }
      });
    } 
  };

  return (
    <>
      <BrowserView>
        <footer>
          <div className="container">
            
            <div className="row">
              <div className="col-lg-4">
                <a href="/" className="footer-logo mb-3 ">
            
                  <img
                    src={settingData.footer_logo != null ? settingImagePath + settingData.footer_logo : constant.DEFAULT_IMAGE} alt={settingData.footer_logo}
                    width={125}
                    height={64}
                  />
                </a>
                <div className="footer-desc" dangerouslySetInnerHTML={{ __html: footer1 }}></div>
                <div className="footer-contact">
                <ul>
                  <li>
                    <span className="footer-contact-label">Address</span>
                    <a href="https://maps.app.goo.gl/8cg74tKrujcy9REV9" target="new">
                      {/* <i className="d-icon-map mr-5"></i> */}
                      <span>{settingData.address}</span>
                    </a>
                  </li>
                  <li>
                  <span className="footer-contact-label">Email ID</span>

                    <a href={"mailto:" + settingData.admin_email}> 
                      {/* <i className="fa fa-envelope  mr-5"></i> */}
                      <span >{settingData.admin_email}</span>
                    </a>
                  </li>
                  <li>
                    <span className="footer-contact-label">Phone number</span>
                    <a href={"tel:" + settingData.admin_mobile}> 
                      {/* <i className="d-icon-phone mr-5"></i> */}
                      <span>{settingData.admin_mobile}</span>
                    </a>

                  
                  </li>
                </ul>
                </div>
            
              </div>
              <div
                className="col-lg-1 col-12"
              ></div>
              <div
                className="col-lg-2 col-6"
                dangerouslySetInnerHTML={{ __html: footer2 }}
              ></div>
              <div
                className="col-lg-2 col-6"
                dangerouslySetInnerHTML={{ __html: footer3 }}
                
              ></div>
              <div className="col-lg-3" >
              <div
                dangerouslySetInnerHTML={{ __html: footer4 }}
                
              ></div>

              {/*   <h6 className="footer-title">Newsletter</h6>
                <p>
                Enter your email address to register 
                </p>
                {errorMessage && (<Alert variant="danger">{errorMessage}</Alert>)}
                {successMessage && (<Alert variant="success">{successMessage}</Alert>)}
                <div className="subscribe-form mb-4">
                  <input
                    className="email newsletterRequired"
                    type="email"
                    placeholder="Enter your email here.."
                    name="newsletter_email"
                    value={newsletterDetails.newsletter_email}
                    onChange={(e) => onTodoChange(e)}
                  />
                  <div className="subscribe-button">
                    <input
                      id="mc-embedded-subscribe"
                      className="button"
                      type="button"
                      name="subscribe"
                      value="Subscribe"
                      onClick={newsletterProcess}
                    />
                  </div>
                </div> */}
                <h6 className="footer-title">Social media</h6>

                <div className="footer-social">
                <ul>
                  {settingData.facebook_url != null ? (
                    <li>
                      <a href={settingData.facebook_url} target="new">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  {settingData.linkedin_url != null ? (
                    <li>
                      <a href={settingData.linkedin_url} target="new">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {settingData.twitter_url != null ? (
                    <li>
                      <a href={settingData.twitter_url} target="new">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {settingData.youtube_url != null ? (
                    <li>
                      <a href={settingData.youtube_url} target="new">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {settingData.instagram_url != null ? (
                    <li>
                      <a href={settingData.instagram_url} target="new">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {settingData.pinterest_url != null ? (
                    <li>
                      <a href={settingData.pinterest_url} target="new">
                        <i className="fab fa-pinterest"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
              </div>
            </div>
          </div>
        </footer>
        <div className="copyright">
          <div className="container">
            <div className="row">
              <div className="col-lg-2">
                <a href={settingData.twitter_url} target="new">
                  Terms and Conditions
                </a>
              </div>
              <div className="col-lg-2">
                <a href={settingData.twitter_url} target="new">
                  Privacy Policy
                </a>
              </div>
              <div className="col-lg-8" style={{justifyContent:'flex-end', display:'flex'}}>
                Copyright @ 2023 | All Right Reserved {settingData.site_title}
              </div>
              
              {/* <div className="col-lg-6">
                <div className="paymet-icon">
                <img src="/img/payments.png" className="img-fluid"></img>
                </div>
                
              </div> */}
            </div>
          </div>
        </div>
        {whatsappUrl ? (
          <div className="whatsapp"><a href={whatsappUrl} target="_blank"><img src="/img/whatsapp1.png" alt="WhatsApp" /></a></div>) : null}
       
      </BrowserView>

      <MobileView>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              
            {/* <a href="/" className="footer-logo mb-3 me-3">
                   <img
                  src="/img/zinc_footer.png" alt={settingData.footer_logo}
                    width={100}
                    height={31}
                  />

                </a> */}
                <a href="/" className="footer-logo mb-3">
                <img
          src={settingData.footer_logo != null ? settingImagePath + settingData.footer_logo : "/img/logofooterdef.png"} alt={settingData.footer_logo}
            width={100}
            height={38}
          />

                </a>
             

              <div className="mb-4 footer-contact">
              <div className="footer-contact-label">Address</div>
              <a href="https://maps.app.goo.gl/8cg74tKrujcy9REV9" target="new">
                  <i className="d-icon-map mr-5"></i>
                  <span>{settingData.address}</span>
                  </a>
              </div>
              <div className="mb-4 footer-contact">
              <div className="footer-contact-label">Email ID</div>
                <a href={"mailto:" + settingData.admin_email}>
                   {settingData.admin_email}
                </a>
              </div>
              <div className="mb-4 footer-contact">
              <div className="footer-contact-label">Phone number</div> 
                <a href={"tel:" + settingData.admin_mobile}>
                   {settingData.admin_mobile}
                </a>
              </div>
            </div>
            <div
              className="col-lg-2 col-6"
              dangerouslySetInnerHTML={{ __html: footer2 }}
            ></div>
            <div
              className="col-lg-2 col-6"
              dangerouslySetInnerHTML={{ __html: footer3 }}
            ></div>
            <div
              className="col-lg-2 col-6"
              dangerouslySetInnerHTML={{ __html: footer4 }}
            ></div>
            <div className="col-lg-4">
            {/* <h6 className="footer-title">Newsletter</h6>
                <p>
                Enter your email address to register 
                </p>
                {errorMessage && (<Alert variant="danger">{errorMessage}</Alert>)}
                {successMessage && (<Alert variant="success">{successMessage}</Alert>)}
                <div className="subscribe-form mb-4">
                  <input
                    className="email newsletterRequired"
                    type="email"
                    placeholder="Enter your email here.."
                    name="newsletter_email"
                    value={newsletterDetails.newsletter_email}
                    onChange={(e) => onTodoChange(e)}
                  />
                  <div className="subscribe-button">
                    <input
                      id="mc-embedded-subscribe"
                      className="button"
                      type="button"
                      name="subscribe"
                      value="Subscribe"
                      onClick={newsletterProcess}
                    />
                  </div>
                </div> */}
              <h6 className="footer-title">Social Media </h6>

              <div className="footer-social">
                <ul>
                  {settingData.facebook_url != null ? (
                    <li>
                      <a href={settingData.facebook_url} target="new">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  {settingData.linkedin_url != null ? (
                    <li>
                      <a href={settingData.linkedin_url} target="new">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {settingData.twitter_url != null ? (
                    <li>
                      <a href={settingData.twitter_url} target="new">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {settingData.youtube_url != null ? (
                    <li>
                      <a href={settingData.youtube_url} target="new">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {settingData.instagram_url != null ? (
                    <li>
                      <a href={settingData.instagram_url} target="new">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {settingData.pinterest_url != null ? (
                    <li>
                      <a href={settingData.pinterest_url} target="new">
                        <i className="fab fa-pinterest"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        </footer>
        <div className="appBottomMenu">
        
            <a href="/" className={location.pathname ==="/" ? "item active" : "item"}><div className="col"><i className="d-icon-home"></i><span>Home</span></div>
            </a>
            <a href="/category" className={location.pathname.includes("/category") ? "item active" : "item"}>
           
                <div className="col">
                <i className="d-icon-layer"></i>
                <span>Categories</span>
                </div>
            </a>
            {setSession?
             <a href="/account/orders" className={location.pathname.includes("/account/orders") ? "item active" : "item"}>
         
                <div className="col">
                <i className="d-icon-truck"></i>
                <span>Orders</span>
                </div>
            </a>:
            <a href="#" className="item" onClick={handleShow}>
                <div className="col">
                <i className="d-icon-truck"></i>
                <span>Orders</span>
                </div>
            </a> }
            <a href="/cart" className={location.pathname.includes("/cart") ? "item active" : "item"}>
                <div className="col">
                <i className="d-icon-bag"></i>
                <span>Cart</span>
                </div>
            </a>
            {setSession?
             <a href="/account/account-overview" className={accountStatus ? "item active" : "item"}>
            <div className="col">
            <i className="d-icon-user"></i>
            <span>Account</span>
            </div>
            </a>:<a href="#" className="item" onClick={handleShow}>
                <div className="col">
                <i className="d-icon-user"></i>
                <span>Account</span>
                </div>
            </a>
            }
            
        </div>
        {show && <LoginModal showmodal={show} onChildData={handleChildData} />} 
      </MobileView>
      {/* <div className="whatsapp-mobile"><a href={whatsappUrl} target="new"><img src="/img/whatsapp1.png" ></img></a></div> */}
      <ScrollToTop smooth  style={{ bottom: "124px", right: "23px" }} > <i className="fas fa-chevron-up"></i> </ScrollToTop>

    </>
  );
}
export default Footer;
