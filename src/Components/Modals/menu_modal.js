import React, { useEffect, useState, useRef } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import { useNavigate } from "react-router-dom";
import LoginModal from "../Modals/login_modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

function MenuModal({ showMenuCart, handleChildMenuCartData }) {
  const didMountRef = useRef(true);
  const [setSession, SetSession] = useState("");
  const navigate = useNavigate();
  const [rowUserData, setRowUserData] = useState({});
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [categoryData , setCategoryData]  = useState([])
  const [menuData, setMenuData] = useState([]);
  const handleChildData = (status) => {
    setShow(status);
  };
  useEffect(() => {
    if (didMountRef.current) {
      SetSession(localStorage.getItem("USER_TOKEN"));
      getuserData();
      getAllCategoryData();
      menuelist()
    }
    didMountRef.current = false;
  }, []);

  const menuelist = () => {
    ApiService.fetchData("menue-list").then((res) => {
      if (res.status === "success") {
        setMenuData(res.data);
      }
    });
  };

  const getuserData = () => {
    ApiService.fetchData("get-user-data").then((res) => {
      if (res.status == "success") {
        setRowUserData(res.rowUserData);
      }
    });
  };
  const getAllCategoryData = () => {
    ApiService.fetchData(
      "all-categories"
    ).then((res) => {
      if (res.status === "success") {
          setCategoryData(res.resCategory)        
      } else {
        
      }
    });
  }

  const goToPage = (route) => {
    navigate(route);
  };

  const [showSettingsSubMenu, setShowSettingsSubMenu] = useState(false);
  const [showHelpSubMenu, setShowHelpSubMenu] = useState(-1);
  const [showHelpFirstSubMenu, setShowHelpFirstSubMenu] = useState(-1);

  const toggleSettingsSubMenu = () => {
    setShowSettingsSubMenu((prevShow) => !prevShow);
  };

  const toggleHelpSubMenu = (index) => {
    setShowHelpSubMenu((prevIndex) => (prevIndex === index ? -1 : index));
  };
  const toggleHelpFirstSubMenu = (index) => {
    setShowHelpFirstSubMenu((prevIndex) => (prevIndex === index ? -1 : index));
  };
  return (
    <>
      {setSession ? (
        <div
          className="msprofile d-flex align-items-center"
          onClick={(e) => goToPage("/account/account-overview")}
        >
          <div className="msprofile-media">
            <img src="/img/user.png" />
          </div>
          <div className="msprofile-content">
            <h6 className="mb-0 tx-14">Hi! {rowUserData.user_fname}</h6>
            <p className="tx-13 tx-color-02 mb-0">{rowUserData.user_email}</p>
          </div>
          <div className="msprofile-arrow">
            <i className="d-icon-angle-right"></i>
          </div>
        </div>
      ) : (
        <div
          className="msprofile d-flex align-items-center"
          onClick={handleShow}
        >
          <div className="msprofile-media">
            <img src="/img/user.png" />
          </div>
          <div className="msprofile-content">
            <h6 className="mb-0 tx-14">Hi Guest!</h6>
            <p className="tx-13 tx-color-02 mb-0">Login / Register</p>
          </div>
          <div className="msprofile-arrow">
            <i className="d-icon-angle-right"></i>
          </div>
        </div>
      )}
      <div className="sidemenu">
        <ul>
          {menuData.map((parent, index) => {
          const hasChildren = parent.children && parent.children.length > 0;
          const isSubMenuOpen = showHelpSubMenu === index;
          return (
            <li className={hasChildren ? 'sub-menu' : ''} key={parent.menu_slug}>
              <div className='sub-menu-inner'>
                {parent.menu_categoryid > 0 ? 
                <a href={"/collection/category/" + parent.menu_slug} >
                  {parent.menu_name}
                </a>:parent.menu_pageid > 0 ? <a href={"/" + parent.pages.page_url} >
                  {parent.menu_name}
                </a>:<a href={parent.menu_customlink} >
                  {parent.menu_name}
                </a>}
                {hasChildren && (
                  <div className='right' onClick={() => toggleHelpSubMenu(index)}>
                    <FontAwesomeIcon icon={isSubMenuOpen ? faCaretUp : faCaretDown} />
                  </div>
                )}
              </div>
              {hasChildren && isSubMenuOpen && (
                <ul> 
                  {parent.children.map((firstChild, indexFirstChild) => {
                    const hasFirstChildren = firstChild.children && firstChild.children.length > 0;
                    const isFirstSubMenuOpen = showHelpFirstSubMenu === indexFirstChild;
                    if (firstChild.menu_show_image !== 1) {
                      return (
                        <li className={hasFirstChildren ? 'sub-menu' : ''} key={firstChild.menu_slug}>
                          <div className='sub-menu-inner'>
                            {firstChild.menu_categoryid > 0 ?
                              <a href={"/collection/category/" + firstChild.menu_slug} >
                                {firstChild.menu_name}
                              </a> : firstChild.menu_pageid > 0 ? <a href={"/" + firstChild.pages.page_url} >
                                {firstChild.menu_name}
                              </a> : <a href={firstChild.menu_customlink} >
                                {firstChild.menu_name}
                              </a>}
                            {hasFirstChildren && (
                              <div className='right' onClick={() => toggleHelpFirstSubMenu(indexFirstChild)}>
                                <FontAwesomeIcon icon={isFirstSubMenuOpen ? faCaretUp : faCaretDown} />
                              </div>
                            )}
                          </div>
                          {hasFirstChildren && isFirstSubMenuOpen && (
                            <ul>
                              {firstChild.children.map((thirdChild,indexThirdChild) => (
                                <li key={thirdChild.cat_slug}>
                                   <div className='sub-menu-inner'>
                                  {thirdChild.menu_categoryid > 0 ?
                                  <a href={"/collection/category/" + thirdChild.menu_slug} >
                                    {thirdChild.menu_name}
                                  </a> : thirdChild.menu_pageid > 0 ? <a href={"/" + thirdChild.pages.page_url} >
                                    {thirdChild.menu_name}
                                  </a> : <a href={thirdChild.menu_customlink} >
                                    {thirdChild.menu_name}
                                      </a>}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
            </li>
          );
        })} 
      </ul>
      </div>
      <hr></hr>
      <div className="mslist">
        <ul>
        <li onClick={(e) => goToPage("/meet-the-makers")}>Meet The Makers</li>
          {setSession ? (
            <>
              <li onClick={(e) => goToPage("/account/orders")}>My Orders</li>
              <li onClick={(e) => goToPage("/account/address")}>Addresses</li>
              <li onClick={(e) => goToPage("/account/wishlist")}>
                Collection & Wishlist
              </li>
            </>
          ) : (
            <>
              <li onClick={handleShow}>My Orders</li>
              <li onClick={handleShow}>Addresses</li>
              <li onClick={handleShow}>Collection & Wishlist</li>
            </>
          )}

          <li onClick={(e) => goToPage("/account/help-and-support")}>
            Help & Support
          </li>
        </ul>
      </div>
      {show && <LoginModal showmodal={show} onChildData={handleChildData} />}
    </>
  );
}
export default MenuModal;
