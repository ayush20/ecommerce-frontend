import React, { useEffect, useState, useRef } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import { useNavigate } from "react-router-dom";
import constant from "../../Components/Services/constant";
function HeaderMenu() {
  const didMountRef = useRef(true);
  const [menuData, setMenuData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (didMountRef.current) {
      menuelist();
    }
    didMountRef.current = false;
  }, []);
  const menuelist = () => {
    ApiService.fetchData("menue-list").then((res) => {
      if (res.status === "success") {
        setMenuData(res.data);
        setImageUrl(res.imageUrl);
      }
    });
  };
  const gotToPage = (route) => {
    navigate(route);
  };
  return (
    <>
<div className="main-menu">
        <nav className="navbar navbar-expand-lg navbar-light">
          <ul className="navbar-nav">
            {menuData.length > 0
              ? menuData.map((parent, indexParent) => {
                  if (parent.menu_mega === 0) {
                    if (parent.children.length > 0) {
                      if (parent.menu_categoryid > 0) {
                        return (
                          <li
                            className="nav-item dropdown dropdown-hover"
                            key={indexParent}
                          >
                            <a
                              className="nav-link"
                              href={"/collection/category/" + parent.categories.cat_slug}
                              id="navbarDropdown"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {parent.menu_name}
                            </a>
                            <ul
                              className="dropdown-menu submenu"
                              aria-labelledby="navbarDropdown"
                            >
                              {parent.children.map(
                                (firstChild, indexFirstChild) => {
                                  if (firstChild.menu_categoryid > 0) {
                                    return (
                                      <li key={indexFirstChild}>
                                        <a
                                          className="dropdown-item"
                                          href={
                                            "/collection/category/" +
                                            firstChild.categories.cat_slug
                                          }
                                        >
                                          {firstChild.menu_name}
                                        </a>
                                      </li>
                                    );
                                  } else if (firstChild.menu_pageid > 0) {
                                    return (
                                      <li key={indexFirstChild}>
                                        <a
                                          className="dropdown-item"
                                          href={"/" + firstChild.pages.page_url}
                                        >
                                          {firstChild.menu_name}
                                        </a>
                                      </li>
                                    );
                                  } else {
                                    return (
                                      <li key={indexFirstChild}>
                                        <a
                                          className="dropdown-item"
                                          href={firstChild.menu_customlink}
                                        >
                                          {firstChild.menu_name}
                                        </a>
                                      </li>
                                    );
                                  }
                                }
                              )}
                            </ul>
                          </li>
                        );
                      } else if (parent.menu_pageid > 0) {
                        return (
                          <li
                            className="nav-item dropdown dropdown-hover"
                            key={indexParent}
                          >
                            <a
                              className="nav-link"
                              href={"/" + parent.pages.page_url}
                              id="navbarDropdown"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {parent.menu_name}
                            </a>
                            <ul
                              className="dropdown-menu submenu"
                              aria-labelledby="navbarDropdown"
                            >
                              {parent.children.map(
                                (firstChild, indexFirstChild) => {
                                  if (firstChild.menu_categoryid > 0) {
                                    return (
                                      <li key={indexFirstChild}>
                                        <a
                                          className="dropdown-item"
                                          href={
                                            "/collection/category/" +
                                            firstChild.categories.cat_slug
                                          }
                                        >
                                          {firstChild.menu_name}
                                        </a>
                                      </li>
                                    );
                                  } else if (firstChild.menu_pageid > 0) {
                                    return (
                                      <li key={indexFirstChild}>
                                        <a
                                          className="dropdown-item"
                                          href={"/" + firstChild.pages.page_url}
                                        >
                                          {firstChild.menu_name}
                                        </a>
                                      </li>
                                    );
                                  } else {
                                    return (
                                      <li key={indexFirstChild}>
                                        <a
                                          className="dropdown-item"
                                          href={firstChild.menu_customlink}
                                        >
                                          {firstChild.menu_name}
                                        </a>
                                      </li>
                                    );
                                  }
                                }
                              )}
                            </ul>
                          </li>
                        );
                      } else {
                        return (
                          <li
                            className="nav-item dropdown dropdown-hover"
                            key={indexParent}
                          >
                            <a
                              className="nav-link"
                              href={parent.menu_customlink}
                              id="navbarDropdown"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {parent.menu_name}
                            </a>
                            <ul
                              className="dropdown-menu submenu"
                              aria-labelledby="navbarDropdown"
                            >
                              {parent.children.map(
                                (firstChild, indexFirstChild) => {
                                  if (firstChild.menu_categoryid > 0) {
                                    return (
                                      <li key={indexFirstChild}>
                                        <a
                                          className="dropdown-item"
                                          href={
                                            "/collection/category/" +
                                            firstChild.categories.cat_slug
                                          }
                                        >
                                          {firstChild.menu_name}
                                        </a>
                                      </li>
                                    );
                                  } else if (firstChild.menu_pageid > 0) {
                                    return (
                                      <li key={indexFirstChild}>
                                        <a
                                          className="dropdown-item"
                                          href={"/" + firstChild.pages.page_url}
                                        >
                                          {firstChild.menu_name}
                                        </a>
                                      </li>
                                    );
                                  } else {
                                    return (
                                      <li key={indexFirstChild}>
                                        <a
                                          className="dropdown-item"
                                          href={firstChild.menu_customlink}
                                        >
                                          {firstChild.menu_name}
                                        </a>
                                      </li>
                                    );
                                  }
                                }
                              )}
                            </ul>
                          </li>
                        );
                      }
                    } else {
                      if (parent.menu_categoryid > 0) {
                        return (
                          <li className="nav-item" key={indexParent}>
                            <a
                              className="nav-link"
                              aria-current="page"
                              href={"/collection/category/" + parent.categories.cat_slug}
                            >
                              {parent.menu_name}
                            </a>
                          </li>
                        );
                      } else if (parent.menu_pageid > 0) {
                        return (
                          <li className="nav-item" key={indexParent}>
                            <a
                              className="nav-link"
                              aria-current="page"
                              href={"/" + parent.pages.page_url}
                            >
                              {parent.menu_name}
                            </a>
                          </li>
                        );
                      } else {
                        return (
                          <li className="nav-item" key={indexParent}>
                            <a
                              className="nav-link"
                              aria-current="page"
                              href={parent.menu_customlink}
                            >
                              {parent.menu_name}
                            </a>
                          </li>
                        );
                      }
                    }
                  } else {
                    if (parent.children.length > 0) {
                      if (parent.menu_categoryid > 0) {
                        return (
                          <li
                            className="nav-item dropdown mega-droupdown dropdown-hover"
                            key={indexParent}
                          >
                            <a
                              className="nav-link"
                              href={"/collection/category/" + parent.categories.cat_slug}
                              id="navbarDropdown"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {parent.menu_name}
                            </a>
                            <div
                              className="mega-menu dropdown-menu"
                              aria-labelledby="navbarDropdown"
                            >
                              <div className="container">
                                <div className="row g-3">
                                  {parent.children.map(
                                    (firstChild, indexFirstChild) => {
                                      if (firstChild.menu_categoryid > 0) {
                                        if (firstChild.menu_show_image === 1) {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mega-menu-imgbox">
                                                <a
                                                  href={
                                                    "/collection/category/" +
                                                    firstChild.categories
                                                      .cat_slug
                                                  }
                                                >
                                                  <img
                                                    src={
                                                      firstChild.menu_image !=
                                                      null
                                                        ? imageUrl +
                                                          firstChild.menu_image
                                                        : constant.DEFAULT_IMAGE
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                  />
                                                  {firstChild.menu_desc?
                                                  <div
                                                  className="mega-menu-imgbox-content"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      firstChild.menu_desc,
                                                  }}
                                                ></div>:null}
                                                  
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mmlist">
                                                <div className="mmlist-title">
                                                  <a
                                                    href={
                                                      "/collection/category/" +
                                                      firstChild.categories
                                                        .cat_slug
                                                    }
                                                  >
                                                    {firstChild.menu_name}
                                                  </a>
                                                </div>
                                                <ul>
                                                  {firstChild.children.map(
                                                    (
                                                      thirdChild,
                                                      indexThirdChild
                                                    ) => {
                                                      if (
                                                        thirdChild.menu_categoryid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/collection/category/" +
                                                                thirdChild
                                                                  .categories
                                                                  .cat_slug
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else if (
                                                        thirdChild.menu_pageid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/" +
                                                                thirdChild.pages
                                                                  .page_url
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                thirdChild.menu_customlink
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else if (firstChild.menu_pageid > 0) {
                                        if (firstChild.menu_show_image === 1) {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mega-menu-imgbox">
                                                <a
                                                  href={
                                                    "/" +
                                                    firstChild.pages.page_url
                                                  }
                                                >
                                                  <img
                                                    src={
                                                      firstChild.menu_image !=
                                                      null
                                                        ? imageUrl +
                                                          firstChild.menu_image
                                                        : constant.DEFAULT_IMAGE
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                  />
                                                  {firstChild.menu_desc?
                                                  <div
                                                  className="mega-menu-imgbox-content"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      firstChild.menu_desc,
                                                  }}
                                                ></div>:null}
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mmlist">
                                                <div className="mmlist-title">
                                                  <a
                                                    href={
                                                      "/" +
                                                      firstChild.pages.page_url
                                                    }
                                                  >
                                                    {firstChild.menu_name}
                                                  </a>
                                                </div>
                                                <ul>
                                                  {firstChild.children.map(
                                                    (
                                                      thirdChild,
                                                      indexThirdChild
                                                    ) => {
                                                      if (
                                                        thirdChild.menu_categoryid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/collection/category/" +
                                                                thirdChild
                                                                  .categories
                                                                  .cat_slug
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else if (
                                                        thirdChild.menu_pageid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/" +
                                                                thirdChild.pages
                                                                  .page_url
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                thirdChild.menu_customlink
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else {
                                        if (firstChild.menu_show_image === 1) {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mega-menu-imgbox">
                                                <a
                                                  href={ firstChild.menu_customlink }
                                                >
                                                  <img
                                                    src={
                                                      firstChild.menu_image !=
                                                      null
                                                        ? imageUrl +
                                                          firstChild.menu_image
                                                        : constant.DEFAULT_IMAGE
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                  />
                                                  {firstChild.menu_desc?
                                                  <div
                                                  className="mega-menu-imgbox-content"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      firstChild.menu_desc,
                                                  }}
                                                ></div>:null}
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mmlist">
                                                <div className="mmlist-title">
                                                  <a
                                                    href={
                                                      firstChild.menu_customlink
                                                    }
                                                  >
                                                    {firstChild.menu_name}
                                                  </a>
                                                </div>
                                                <ul>
                                                  {firstChild.children.map(
                                                    (
                                                      thirdChild,
                                                      indexThirdChild
                                                    ) => {
                                                      if (
                                                        thirdChild.menu_categoryid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/collection/category/" +
                                                                thirdChild
                                                                  .categories
                                                                  .cat_slug
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else if (
                                                        thirdChild.menu_pageid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/" +
                                                                thirdChild.pages
                                                                  .page_url
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                thirdChild.menu_customlink
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }
                                      }
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      } else if (parent.menu_pageid > 0) {
                        return (
                          <li
                            className="nav-item dropdown mega-droupdown dropdown-hover"
                            key={indexParent}
                          >
                            <a
                              className="nav-link "
                              href={"/" + parent.pages.page_url}
                              id="navbarDropdown"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {parent.menu_name}
                            </a>
                            <div
                              className="mega-menu dropdown-menu"
                              aria-labelledby="navbarDropdown"
                            >
                              <div className="container">
                                <div className="row g-3">
                                  {parent.children.map(
                                    (firstChild, indexFirstChild) => {
                                      if (firstChild.menu_categoryid > 0) {
                                        if (firstChild.menu_show_image === 1) {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mega-menu-imgbox">
                                                <a
                                                  href={
                                                    "/collection/category/" +
                                                    firstChild.categories
                                                      .cat_slug
                                                  }
                                                >
                                                  <img
                                                    src={
                                                      firstChild.menu_image !=
                                                      null
                                                        ? imageUrl +
                                                          firstChild.menu_image
                                                        : constant.DEFAULT_IMAGE
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                  />
                                                  {firstChild.menu_desc?
                                                  <div
                                                  className="mega-menu-imgbox-content"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      firstChild.menu_desc,
                                                  }}
                                                ></div>:null}
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mmlist">
                                                <div className="mmlist-title">
                                                  <a
                                                    href={
                                                      "/collection/category/" +
                                                      firstChild.categories
                                                        .cat_slug
                                                    }
                                                  >
                                                    {firstChild.menu_name}
                                                  </a>
                                                </div>
                                                <ul>
                                                  {firstChild.children.map(
                                                    (
                                                      thirdChild,
                                                      indexThirdChild
                                                    ) => {
                                                      if (
                                                        thirdChild.menu_categoryid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/collection/category/" +
                                                                thirdChild
                                                                  .categories
                                                                  .cat_slug
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else if (
                                                        thirdChild.menu_pageid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/" +
                                                                thirdChild.pages
                                                                  .page_url
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                thirdChild.menu_customlink
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else if (firstChild.menu_pageid > 0) {
                                        if (firstChild.menu_show_image === 1) {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mega-menu-imgbox">
                                                <a
                                                  href={
                                                    "/" +
                                                    firstChild.pages.page_url
                                                  }
                                                >
                                                  <img
                                                    src={
                                                      firstChild.menu_image !=
                                                      null
                                                        ? imageUrl +
                                                          firstChild.menu_image
                                                        : constant.DEFAULT_IMAGE
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                  />
                                                  {firstChild.menu_desc?
                                                  <div
                                                  className="mega-menu-imgbox-content"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      firstChild.menu_desc,
                                                  }}
                                                ></div>:null}
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mmlist">
                                                <div className="mmlist-title">
                                                  <a
                                                    href={
                                                      "/" +
                                                      firstChild.pages.page_url
                                                    }
                                                  >
                                                    {firstChild.menu_name}
                                                  </a>
                                                </div>
                                                <ul>
                                                  {firstChild.children.map(
                                                    (
                                                      thirdChild,
                                                      indexThirdChild
                                                    ) => {
                                                      if (
                                                        thirdChild.menu_categoryid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/collection/category/" +
                                                                thirdChild
                                                                  .categories
                                                                  .cat_slug
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else if (
                                                        thirdChild.menu_pageid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/" +
                                                                thirdChild.pages
                                                                  .page_url
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                thirdChild.menu_customlink
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else {
                                        if (firstChild.menu_show_image === 1) {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mega-menu-imgbox">
                                                <a
                                                  href={
                                                    firstChild.menu_customlink
                                                  }
                                                >
                                                  <img
                                                    src={
                                                      firstChild.menu_image !=
                                                      null
                                                        ? imageUrl +
                                                          firstChild.menu_image
                                                        : constant.DEFAULT_IMAGE
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                  />
                                                  {firstChild.menu_desc?
                                                  <div
                                                  className="mega-menu-imgbox-content"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      firstChild.menu_desc,
                                                  }}
                                                ></div>:null}
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mmlist">
                                                <div className="mmlist-title">
                                                  <a
                                                    href={
                                                      firstChild.menu_customlink
                                                    }
                                                  >
                                                    {firstChild.menu_name}
                                                  </a>
                                                </div>
                                                <ul>
                                                  {firstChild.children.map(
                                                    (
                                                      thirdChild,
                                                      indexThirdChild
                                                    ) => {
                                                      if (
                                                        thirdChild.menu_categoryid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/collection/category/" +
                                                                thirdChild
                                                                  .categories
                                                                  .cat_slug
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else if (
                                                        thirdChild.menu_pageid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/" +
                                                                thirdChild.pages
                                                                  .page_url
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                thirdChild.menu_customlink
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }
                                      }
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      } else {
                        return (
                          <li
                            className="nav-item dropdown mega-droupdown dropdown-hover"
                            key={indexParent}
                          >
                            <a
                              className="nav-link"
                              href={parent.menu_customlink}
                              id="navbarDropdown"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {parent.menu_name}
                            </a>
                            <div
                              className="mega-menu dropdown-menu"
                              aria-labelledby="navbarDropdown"
                            >
                              <div className="container">
                                <div className="row g-3">
                                  {parent.children.map(
                                    (firstChild, indexFirstChild) => {
                                      if (firstChild.menu_categoryid > 0) {
                                        if (firstChild.menu_show_image === 1) {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mega-menu-imgbox">
                                                <a
                                                  href={
                                                    "/collection/category/" +
                                                    firstChild.categories
                                                      .cat_slug
                                                  }
                                                >
                                                  <img
                                                    src={
                                                      firstChild.menu_image !=
                                                      null
                                                        ? imageUrl +
                                                          firstChild.menu_image
                                                        : constant.DEFAULT_IMAGE
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                  />
                                                  {firstChild.menu_desc?
                                                  <div
                                                  className="mega-menu-imgbox-content"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      firstChild.menu_desc,
                                                  }}
                                                ></div>:null}
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mmlist">
                                                <div className="mmlist-title">
                                                  <a
                                                    href={
                                                      "/collection/category/" +
                                                      firstChild.categories
                                                        .cat_slug
                                                    }
                                                  >
                                                    {firstChild.menu_name}
                                                  </a>
                                                </div>
                                                <ul>
                                                  {firstChild.children.map(
                                                    (
                                                      thirdChild,
                                                      indexThirdChild
                                                    ) => {
                                                      if (
                                                        thirdChild.menu_categoryid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/collection/category/" +
                                                                thirdChild
                                                                  .categories
                                                                  .cat_slug
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else if (
                                                        thirdChild.menu_pageid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/" +
                                                                thirdChild.pages
                                                                  .page_url
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                thirdChild.menu_customlink
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else if (firstChild.menu_pageid > 0) {
                                        if (firstChild.menu_show_image === 1) {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mega-menu-imgbox">
                                                <a
                                                  href={
                                                    "/" +
                                                    firstChild.pages.page_url
                                                  }
                                                >
                                                  <img
                                                    src={
                                                      firstChild.menu_image !=
                                                      null
                                                        ? imageUrl +
                                                          firstChild.menu_image
                                                        : constant.DEFAULT_IMAGE
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                  />
                                                  {firstChild.menu_desc?
                                                  <div
                                                  className="mega-menu-imgbox-content"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      firstChild.menu_desc,
                                                  }}
                                                ></div>:null}
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mmlist">
                                                <div className="mmlist-title">
                                                  <a
                                                    href={
                                                      "/" +
                                                      firstChild.pages.page_url
                                                    }
                                                  >
                                                    {firstChild.menu_name}
                                                  </a>
                                                </div>
                                                <ul>
                                                  {firstChild.children.map(
                                                    (
                                                      thirdChild,
                                                      indexThirdChild
                                                    ) => {
                                                      if (
                                                        thirdChild.menu_categoryid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/collection/category/" +
                                                                thirdChild
                                                                  .categories
                                                                  .cat_slug
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else if (
                                                        thirdChild.menu_pageid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/" +
                                                                thirdChild.pages
                                                                  .page_url
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                thirdChild.menu_customlink
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else {
                                        if (firstChild.menu_show_image === 1) {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mega-menu-imgbox">
                                                <a href={firstChild.menu_customlink} >
                                                  <img
                                                    src={
                                                      firstChild.menu_image !=
                                                      null
                                                        ? imageUrl +
                                                          firstChild.menu_image
                                                        : constant.DEFAULT_IMAGE
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                  />
                                                  {firstChild.menu_desc?
                                                  <div
                                                  className="mega-menu-imgbox-content"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      firstChild.menu_desc,
                                                  }}
                                                ></div>:null}
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="col"
                                              key={indexFirstChild}
                                            >
                                              <div className="mmlist">
                                                <div className="mmlist-title">
                                                  <a
                                                    href={
                                                      firstChild.menu_customlink
                                                    }
                                                  >
                                                    {firstChild.menu_name}
                                                  </a>
                                                </div>
                                                <ul>
                                                  {firstChild.children.map(
                                                    (
                                                      thirdChild,
                                                      indexThirdChild
                                                    ) => {
                                                      if (
                                                        thirdChild.menu_categoryid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/collection/category/" +
                                                                thirdChild
                                                                  .categories
                                                                  .cat_slug
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else if (
                                                        thirdChild.menu_pageid >
                                                        0
                                                      ) {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                "/" +
                                                                thirdChild.pages
                                                                  .page_url
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      } else {
                                                        return (
                                                          <li
                                                            key={
                                                              indexThirdChild
                                                            }
                                                          >
                                                            <a
                                                              href={
                                                                thirdChild.menu_customlink
                                                              }
                                                            >
                                                              {
                                                                thirdChild.menu_name
                                                              }
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }
                                      }
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      }
                    }
                  }
                })
              : null}
          </ul>
          
        </nav>
      </div>
    </>
  );
}
export default HeaderMenu;
