import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../Components/Services/apiservices";
import numeral from "numeral";
import LoginModal from "../Modals/login_modal";
import sessionCartData from "../../Components/Elements/cart_session_data";
import { toast } from "react-toastify";
import SpinnerLoader from "../Elements/spinner_loader";
import constant from "../Services/constant";
import VariationModal from "./variation_modal";
import { Swiper, SwiperSlide } from "swiper/react";
import multiCurrency from "../../Components/Elements/multi_currrency";
function CartModal({ showcartmodal, onChildCartData }) {
  const [showCart, setShowCart] = useState(showcartmodal);
  const didMountRef = useRef(true);
  const [show, setShow] = useState(false);
  const [cartData, SetCartData] = useState([]);
  const [setSession, SetSession] = useState("");
  const [recommendedData, setRecommendedProductsData] = useState([]);
  const [productData, setProductData] = useState(null);
  const dataArray = sessionCartData();

  const parsedCartSession = dataArray[1];
  let { itemTotal } = 0;
  const handleShow = () => setShow(true);
  const handleChildData = (status) => {
    setShow(status);
  };
  const [showVariation, setShowVariation] = useState(false);
  const handleChildVariationModalData = (status) => {
    setShowVariation(status);
  };
  const handleShowVariation = (data) => {
    setProductData(data);
    setShowVariation(true);
  };
  let mrpValue = 0;
  let sellingPriceValue = 0;
  let discount = 0;
  useEffect(() => {
    if (didMountRef.current) {
      recommendedproductslist();
      SetSession(localStorage.getItem("USER_TOKEN")); 
    }
    didMountRef.current = false;
  }, []);
  const handleClose = () => {
    setShowCart(false);
    onChildCartData(false);
  };
  const removeProduct = (productData) => {
    setSpinnerLoading(true);
    let cartSession = localStorage.getItem("CART_SESSION");
    cartSession = cartSession ? JSON.parse(cartSession) : [];
    const existingProductIndex = cartSession.findIndex((item) => {
      return (
        item.product_id === productData.product_id &&
        JSON.stringify(item.product_variation) ===
          JSON.stringify(productData.product_variation)
      );
    });

    if (existingProductIndex !== -1) {
      cartSession.splice(existingProductIndex, 1);
      localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
    }
    setTimeout(() => {
      setSpinnerLoading(false);
    }, 500); 
  };
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const recommendedproductslist = () => {
    ApiService.fetchData("recommended-products-list").then((res) => {
      if (res.status === "success") {
        setRecommendedProductsData(res.recommendedproducts);
        setSpinnerLoading(false);
      } else {
        setSpinnerLoading(false);
      }
    });
  };
  const addtocart = (addproduct) => {
    setSpinnerLoading(true);
    let cartSession = localStorage.getItem("CART_SESSION");
    cartSession = cartSession ? JSON.parse(cartSession) : [];
    const product = {
      product_id: Number(addproduct.product_id),
      product_name: addproduct.product_name,
      product_image: addproduct.product_image
        ? addproduct.product_image
        : constant.DEFAULT_IMAGE,
      product_type: Number(addproduct.product_type),
      product_price: Number(addproduct.product_price),
      product_selling_price: Number(addproduct.product_selling_price),
      product_discount: addproduct.product_discount,
      product_variation: [],
    };
    const existingProductIndex = cartSession.findIndex((item) => {
      return (
        item.product_id === product.product_id &&
        JSON.stringify(item.product_variation) ===
          JSON.stringify(product.product_variation)
      );
    });
    if (addproduct.product_type === 0) {
      if (addproduct.product_inventory === 1) {
        if (Number(addproduct.product_stock) > 0) {
          if (addproduct.product_backorder !== 0) {
            if (existingProductIndex !== -1) {
              if (
                cartSession[existingProductIndex].quantity + 1 <=
                  Number(addproduct.product_stock) ||
                Number(addproduct.product_stock) === 0
              ) {
                if (
                  Number(addproduct.product_moq) === 0 ||
                  cartSession[existingProductIndex].quantity + 1 <=
                    Number(addproduct.product_moq)
                ) {
                  cartSession[existingProductIndex].quantity += 1;
                  toast.success("Quantity updated Successfully");
                } else {
                  toast.error(
                    "You can add maximum " +
                      addproduct.product_moq +
                      " quantity at a time!"
                  );
                  return false;
                }
              } else {
                toast.error("Product is out of stock");
                return false;
              }
            } else {
              cartSession.push({ ...product, quantity: 1 });
              toast.success("Product Added in cart Successfully");
            }
          } else {
            toast.error("Product is out of stock");
            return false;
          }
        } else {
          if (addproduct.product_backorder === 0) {
            toast.error("Product is out of stock");
            return false;
          } else {
            if (
              Number(addproduct.product_moq) === 0 ||
              cartSession[existingProductIndex].quantity + 1 <=
                Number(addproduct.product_moq)
            ) {
              cartSession[existingProductIndex].quantity += 1;
              toast.success("Quantity updated Successfully");
            } else {
              toast.error(
                "You can add maximum " +
                  addproduct.product_moq +
                  " quantity at a time!"
              );
              return false;
            }
          }
        }
      } else {
        if (existingProductIndex !== -1) {
          if (
            Number(addproduct.product_moq) === 0 ||
            cartSession[existingProductIndex].quantity + 1 <=
              Number(addproduct.product_moq)
          ) {
            cartSession[existingProductIndex].quantity += 1;
            toast.success("Quantity updated Successfully");
          } else {
            toast.error(
              "You can add maximum " +
                addproduct.product_moq +
                " quantity at a time!"
            );
            return false;
          }
        } else {
          cartSession.push({ ...product, quantity: 1 });
          toast.success("Product Added in cart Successfully");
        }
      }
    } else {
      if (existingProductIndex !== -1) {
        if (
          cartSession[existingProductIndex].quantity + 1 <=
            Number(addproduct.product_stock) ||
          Number(addproduct.product_stock) === 0
        ) {
          if (
            Number(addproduct.product_moq) === 0 ||
            cartSession[existingProductIndex].quantity + 1 <=
              Number(addproduct.product_moq)
          ) {
            cartSession[existingProductIndex].quantity += 1;
            toast.success("Quantity updated Successfully");
          } else {
            toast.error(
              "You can add maximum " +
                addproduct.product_moq +
                " quantity at a time!"
            );
            return false;
          }
        } else {
          toast.error("Product is out of stock");
          return false;
        }
      } else {
        cartSession.push({ ...product, quantity: 1 });
        toast.success("Product Added in cart Successfully");
      }
    }

    localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
    setTimeout(() => {
      setSpinnerLoading(false);
    }, 500); 
    localStorage.removeItem("COUPON_SESSION");
  };
  const productCarouselOptions = {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 2.5,
      },
      600: {
        slidesPerView: 2.5,
      },
      1000: {
        slidesPerView: 2.5,
      },
    },
  };
  return (
    <>
      {spinnerLoading && <SpinnerLoader />}
      <BrowserView>
      {recommendedData.length > 0 ?
        <div className="cartbox-recom text-center d-none d-md-block">
          <h6 className="tx-14">Recommendations For You</h6>
          <div className="cartbox-recom-inner">
            {recommendedData.map((value, index) => {
              return (
                <div className="product" key={value.product_id}>
                  <figure className="product-media">
                    <a href={"/product/" + value.product_slug}>
                      <img
                        src={
                          value.product_image != null
                            ? value.product_image
                            : constant.DEFAULT_IMAGE
                        }
                        alt={value.product_name}
                        width="280"
                        height="315"
                      />
                    </a>
                  </figure>
                  <div className="product-details">
                    <h3 className="product-name">
                      <a href={"/product/" + value.product_slug}>
                        {value.product_name}
                      </a>
                    </h3>
                    <div className="product-price">
                      <ins className="new-price">
                        {multiCurrency(value.product_selling_price)}
                        
                      </ins>
                    </div>
                    {value.product_type === 0 ? (
                      <button
                        className="btn btn-primary-line"
                        onClick={(e) => addtocart(value)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary-line"
                        onClick={() => {
                          handleShowVariation(value);
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
       : null}
      </BrowserView>

      <div className="cartbox">
        <div className="cartbox-header">
          <h4 className="cartbox-title">Shopping Cart</h4>
          <a
            href={"javscript:void(0)"}
            className="cartbox-close"
            onClick={handleClose}
          >
            <i className="d-icon-times"></i>
          </a>
        </div>
        {parsedCartSession.length > 0 ? (
          <>
            <div className="cartbox-scroll">
              {parsedCartSession.map((value, index) => {
                itemTotal = parsedCartSession.reduce(
                  (total, value) =>
                    total + value.product_selling_price * value.quantity,
                  0
                );
                
                mrpValue = parseFloat(value.product_price);
                sellingPriceValue = parseFloat(
                  value.product_selling_price
                );
                
                if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                  discount = ((mrpValue - sellingPriceValue) / mrpValue) * 100;
                  discount = discount.toFixed(2);
                }
                return (
                  <div className="product-cart" key={index}>
                    <a
                      href={"javscript:void(0)"}
                      className="product-remove"
                      onClick={(e) => removeProduct(value)}
                    >
                      <i className="fa fa-trash-alt"></i>
                    </a>
                    <figure className="product-media">
                      <a href={"javscript:void(0)"}>
                        <img src={value.product_image} />
                      </a>
                    </figure>
                    <div className="product-detail">
                      <a href={"javscript:void(0)"} className="product-name">
                        {value.product_name}
                      </a>
                      <div className="price-box">
                        <span className="product-quantity">
                          {value.quantity}
                        </span>
                        <span className="product-price">
                        {multiCurrency (value.product_selling_price)}
                        {discount > 0 ? (
                            <>
                              <del className="old-price">
                                {multiCurrency(value.product_price)}
                              </del>
                              <span className="off">{Math.round(discount)}% Off</span>
                            </>
                          ) : null} 
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* <div className="product-price">
                  <ins className="new-price">
                    {multiCurrency(productdata.product_selling_price)}
                  </ins>

                  {discountPercentage > 0 ? (
                    <>
                      <del className="old-price">
                        {multiCurrency(productdata.product_price)}
                      </del>
                      <span className="off">
                        {Math.round(discountPercentage)}% Off
                      </span>
                    </>
                  ) : null}
                </div> */}
            <MobileView>
            {recommendedData.length > 0 ?
            <div className="mcartbox-recom">
            <h6 className="tx-14 mb-3">Recommendations For You</h6>
            <Swiper {...productCarouselOptions}>
                    {recommendedData.map((value, indexProduct) => {
                      return (
                        <SwiperSlide key={indexProduct}>
                          <div className="product" key={indexProduct}>
                          <figure className="product-media">
                            <a href={"/product/" + value.product_slug}>
                              <img
                                src={
                                  value.product_image != null
                                    ? value.product_image
                                    : constant.DEFAULT_IMAGE
                                }
                                alt={value.product_name}
                                width="280"
                                height="315"
                              />
                            </a>
                          </figure>
                          <div className="product-details">
                            <h3 className="product-name">
                              <a href={"/product/" + value.product_slug}>
                                {value.product_name}
                              </a>
                            </h3>
                            <div className="product-price">
                              <ins className="new-price">
                              {multiCurrency(value.product_selling_price)}
                              
                              </ins>
                            </div>
                            {value.product_type === 0 ? (
                              <button
                                className="btn btn-primary-line btn-small"
                                onClick={(e) => addtocart(value)}
                              >
                                Add to Cart
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary-line btn-small"
                                onClick={() => {
                                  handleShowVariation(value);
                                }}
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
            </div>
             : null}
            </MobileView>
            <div className="cartbox-footer">
              <div className="cartbox-total">
                <span>Subtotal:</span>
                <span>{multiCurrency (itemTotal)}</span>
                
              </div>
              <div className="cartbox-action">
                <a href="/cart" className="cartbox-action-btn">
                  View Cart
                </a>
                {setSession ? (
                  <a href="/address" className="btn btn-primary">
                    Go to Checkout
                  </a>
                ) : (
                  <a
                    href="javascript:void(0)"
                    className="btn btn-primary"
                    onClick={handleShow}
                  >
                    Go to Checkout
                  </a>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="noimg">
            <img src="/img/empty-cart.webp" className="img-fluid mb-3" />
            <h6>Your cart is empty!</h6>
            <p>There is nothing in your cart. Let's add some items</p>
            <a href="/" className="btn btn-primary-outline btn-block btn-small">
              Continue Shopping
            </a>
          </div>
        )}
      </div>
      {show && <LoginModal showmodal={show} onChildData={handleChildData} />}
      {showVariation && (
        <VariationModal
          showvariationmodal={showVariation}
          productdata={productData}
          onChildData={handleChildVariationModalData}
        />
      )}
    </>
  );
}
export default CartModal;
