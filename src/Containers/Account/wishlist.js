import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/Services/apiservices";
import constant from "../../Components/Services/constant";
import { BrowserView, MobileView } from "react-device-detect";
import AccountSidebar from "./account_sidebar";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../../Components/Elements/mobile_header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sessionCartData from "../../Components/Elements/cart_session_data";
import StarRating from "../../Components/Elements/starrating";
import multiCurrency from "../../Components/Elements/multi_currrency";
function Wishlist() {
  const didMountRef = useRef(true);
  const [homeCategoriesData, setHomeCategoriesData] = useState([]);
  const [rowUserData, setRowUserData] = useState({});
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const [setSession, SetSession] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (didMountRef.current) {
      getuserData();
      getHomeCategoryData();
    }
    didMountRef.current = false;
  }, []);
  const getuserData = () => {
    ApiService.fetchData("get-user-data").then((res) => {
      if (res.status == "success") {
        setRowUserData(res.rowUserData);
        setSpinnerLoading(false);
      } else {
        localStorage.removeItem("USER_TOKEN");
        setSpinnerLoading(false);
        navigate("/");
      }
    });
  };
  const getHomeCategoryData = () => {
    ApiService.fetchData("user-fav-data").then((res) => {
      if (res.status == "success") {
        setHomeCategoriesData(res.favdata);
      }
    });
  };

  const addtofav = (productId) => {
    const dataString = {
      product_id: productId,
    };
    setSpinnerLoading(true);
    ApiService.postData("remove-fav-wishlist", dataString).then((res) => {
      if (res.data.status == "success") {
        setSpinnerLoading(false);
        setHomeCategoriesData(res.data.favdata);
      }
    });
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        
        draggable
        
        theme="light"
      />
      {spinnerLoading && <SpinnerLoader />}
      <BrowserView>
      <Header state="inner-header" cartCount={parsedCartSession.length}/>
        <main className="main">
          <div className="subheader">
            <Container>
              <Row>
                <Col lg={12}>
                  <Breadcrumb className="breadcrumb-inner">
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>My Wishlist</Breadcrumb.Item>
                  </Breadcrumb>
                </Col>
              </Row>
            </Container>
          </div>

          <div className="page-content mt-4 mb-4">
            <section>
              <Container>
                <Row>
                  <AccountSidebar rowUserData={rowUserData} />
                  <Col lg={9}>
                    <div className="acpanel">
                      <div className="acpanel-header">
                        <h4>My Wishlist</h4>
                      </div>
                      <div className="acpanel-body">
                         
                          <div className="row">
                            {homeCategoriesData.length > 0 ? (
                              homeCategoriesData.map(
                                (subvalue, indexProduct) => {
                                  let mrpValue = parseFloat(
                                    subvalue.product.product_price
                                  );
                                  let sellingPriceValue = parseFloat(
                                    subvalue.product.product_selling_price
                                  );
                                  let discount = 0;
                                  if (
                                    !isNaN(mrpValue) &&
                                    !isNaN(sellingPriceValue)
                                  ) {
                                    discount = Math.round(
                                      ((mrpValue - sellingPriceValue) /
                                        mrpValue) *
                                      100
                                    );
                                  } else {
                                    discount = 0;
                                  }
                                  return (
                                    <div
                                      className="col-lg-3 col-6"
                                      key={indexProduct}
                                    >
                                      <div className="product">
                                        <figure className="product-media">
                                           {subvalue.product.product_type === 0 ? (
                                              subvalue.product.product_inventory === 1 ? (
                                                subvalue.product.product_stock === 0 ? (
                                                  subvalue.product.product_backorder === 0 || subvalue.product.product_backorder === 1 ? (
                                                  <div className="stock-text-p mb-0"> Out of Stock</div>
                                                  ) : (
                                                    null
                                                  )
                                                ) : (
                                                  null
                                                )
                                              ) : (
                                                null
                                              )
                                            ) : (
                                              subvalue.product.product_stock === 0 ? (
                                                <div className="stock-text-p mb-0"> Out of Stock</div>
                                              ) : (
                                                null
                                              )
                                            )}
                                          <a
                                            href={
                                              "/product/" +
                                              subvalue.product.product_slug
                                            }
                                          >
                                           
                                            <img
                                              src={
                                                subvalue.product
                                                  .product_image != null
                                                  ? subvalue.product
                                                      .product_image
                                                  : constant.DEFAULT_IMAGE
                                              }
                                              alt={
                                                subvalue.product.product_name
                                              }
                                              width="280"
                                              height="315"
                                            />
                                          </a>
                                          {subvalue.product.product_tag_name !=
                                          "" ? (
                                            <div className="product-label-group">
                                              {subvalue.product.product_tag_name
                                                .split(", ")
                                                .map((tagvalue, indextag) => {
                                                  return (
                                                    <label
                                                      className="product-label label-new"
                                                      key={indextag}
                                                    >
                                                      {tagvalue}
                                                    </label>
                                                  );
                                                })}
                                            </div>
                                          ) : null}
                                          <div className="product-action-vertical">
                                            <a
                                              href="javascript:void(0)"
                                              className="btn-product-icon btn-wishlist"
                                              title="Add to wishlist"
                                              onClick={(e) =>
                                                addtofav(
                                                  subvalue.product.product_id
                                                )
                                              }
                                            >
                                              <i
                                                className="fas fa-trash"
                                                id={
                                                  "wishlisticon" +
                                                  subvalue.product.product_id
                                                }
                                              ></i>
                                            </a>
                                          </div>
                                        </figure>
                                        <div className="product-details">
                                          <h3 className="product-name">
                                            <a
                                              href={
                                                "/product/" +
                                                subvalue.product.product_slug
                                              }
                                            >
                                              {subvalue.product.product_name}
                                            </a>
                                          </h3>
                                          <div className="product-price">
                                            <ins className="new-price">
                                            {multiCurrency(subvalue.product
                                                  .product_selling_price)}
                                              
                                            </ins>
                                            {discount > 0 ? (
                                              <>
                                                <del className="old-price">
                                                {multiCurrency(subvalue.product
                                                  .product_price)}
                                                 
                                                </del>
                                                <span className="off">
                                                  {discount}% Off
                                                </span>
                                              </>
                                            ) : null}
                                          </div>
                                    {subvalue.product.product_rating && subvalue.product.product_rating>0 ?
                                  <div className="ratings-container">
                                  <StarRating numberOfStars={subvalue.product.product_rating} />
                                  <span>( {subvalue.product.product_review} reviews )</span>
                                  </div>:''}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )
                            ) : (
                              <div className="noimg">
                                <img
                                  src="/img/empty-cart.webp"
                                  className="mb-3"
                                />
                                <h6>Your wishlist is empty!</h6>
                                <p>
                                  There is nothing in your wishlist. Let's add
                                  some items
                                </p>
                                <a
                                  href="/"
                                  className="btn btn-primary-outline  btn-medium"
                                >
                                  Continue Shopping
                                </a>
                              </div>
                            )}
                          </div>
                         
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </section>
          </div>
        </main>
        <Footer />
      </BrowserView>

      <MobileView>
        <MobileHeader
          PageName="Collection & Wishlist"
          Route="account/account-overview"
          cartCount={parsedCartSession.length}
        />
        <div className="page-content mt-3">
          <div className="container">
             
              <div className="row">
                {homeCategoriesData.length > 0 ? (
                  homeCategoriesData.map((subvalue, indexProduct) => {
                    let mrpValue = parseFloat(subvalue.product.product_price);
                    let sellingPriceValue = parseFloat(
                      subvalue.product.product_selling_price
                    );
                    let discount = 0;
                    if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                      discount = Math.round(
                        ((mrpValue - sellingPriceValue) / mrpValue) *
                        100
                      );
                    } else {
                      discount = 0;
                    }
                    return (
                      <div className="col-lg-3 col-6" key={indexProduct}>
                        <div className="product">
                          <figure className="product-media">
                            {subvalue.product.product_type === 0 ? (
                                              subvalue.product.product_inventory === 1 ? (
                                                subvalue.product.product_stock === 0 ? (
                                                  subvalue.product.product_backorder === 0 || subvalue.product.product_backorder === 1 ? (
                                                  <div className="stock-text-p mb-0"> Out of Stock</div>
                                                  ) : (
                                                    null
                                                  )
                                                ) : (
                                                  null
                                                )
                                              ) : (
                                                null
                                              )
                                            ) : (
                                              subvalue.product.product_stock === 0 ? (
                                                <div className="stock-text-p mb-0"> Out of Stock</div>
                                              ) : (
                                                null
                                              )
                                            )}
                            <a
                              href={
                                "/product/" +
                                subvalue.product.product_slug
                              }
                            > 
                              <img
                                src={
                                  subvalue.product.product_image != null
                                    ? subvalue.product.product_image
                                    : constant.DEFAULT_IMAGE
                                }
                                alt={subvalue.product.product_name}
                                width="280"
                                height="315"
                              />
                            </a>
                            {subvalue.product.product_tag_name != "" ? (
                              <div className="product-label-group">
                                {subvalue.product.product_tag_name
                                  .split(", ")
                                  .map((tagvalue, indextag) => {
                                    return (
                                      <label
                                        className="product-label label-new"
                                        key={indextag}
                                      >
                                        {tagvalue}
                                      </label>
                                    );
                                  })}
                              </div>
                            ) : null}
                            <div className="product-action-vertical">
                              <a
                                href="javascript:void(0)"
                                className="btn-product-icon btn-wishlist"
                                title="Add to wishlist"
                                onClick={(e) =>
                                  addtofav(subvalue.product.product_id)
                                }
                              >
                                <i
                                  className="fas fa-trash"
                                  id={
                                    "wishlisticon" + subvalue.product.product_id
                                  }
                                ></i>
                              </a>
                            </div>
                          </figure>
                          <div className="product-details">
                            <h3 className="product-name">
                              <a
                                href={
                                  "/product/" +
                                  subvalue.product.product_slug
                                }
                              >
                                {subvalue.product.product_name}
                              </a>
                            </h3>
                            <div className="product-price">
                              <ins className="new-price">
                              {multiCurrency(subvalue.product
                                                  .product_selling_price)}
                                
                              </ins>
                              {discount > 0 ? (
                                <>
                                  <del className="old-price">
                                  {multiCurrency(subvalue.product.product_price)}
                                
                                  </del>
                                  <span className="off">{discount}% Off</span>
                                </>
                              ) : null}
                            </div>
                            {subvalue.product.product_rating && subvalue.product.product_rating>0 ?
                                  <div className="ratings-container">
                                  <StarRating numberOfStars={subvalue.product.product_rating} />
                                  <span>( {subvalue.product.product_review} reviews )</span>
                                  </div>:''}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="noimg">
                    <img
                      src="/img/empty-cart.webp"
                      className="img-fluid mb-3"
                    />
                    <h6>Your wishlist is empty!</h6>
                    <p>
                      There is nothing in your wishlist. Let's add some items
                    </p>
                    <a href="/" className="btn btn-primary-outline btn-medium">
                      Continue Shopping
                    </a>
                  </div>
                )}
              </div>
             
          </div>
        </div>
      </MobileView>
    </>
  );
}
export default Wishlist;
