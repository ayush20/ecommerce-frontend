import React, { useEffect, useRef, useState } from "react";
import constant from "../../Components/Services/constant";
import { ApiService } from "../../Components/Services/apiservices";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import QuickViewModal from "../Modals/quick_view_modal";
import LoginModal from "../Modals/login_modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import StarRating from "./starrating";
import VariationModal from "../Modals/variation_modal";
import multiCurrency from "../../Components/Elements/multi_currrency";
import Skeleton from "react-loading-skeleton";
function CategoryWiseProducts({ onParentData }) {
  const didMountRef = useRef(true);
  const [homeCategoriesData, setHomeCategoriesData] = useState([]);
  const [productData, setProductData] = useState(null);
  const [showQuick, setShowQuick] = useState(false);
  const [loading, setLoading] = useState();
  const handleShowQuickModal = (data) => {
    setProductData(data);
    setShowQuick(true);
  };

  const handleChildQuickModalData = (status) => {
    setShowQuick(status);
  };
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleChildData = (status) => {
    setShow(status);
  };

  const [showVariation, setShowVariation] = useState(false);
  const handleChildVariationModalData = (status) => {
    setShowVariation(status);
    onParentData(status);
  };
  const handleShowVariation = (data) => {
    setProductData(data);
    setShowVariation(true);
  };
  const [setSession, SetSession] = useState("");
  const productCarouselOptions = {
    loop: true,
    spaceBetween: 15,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 2.2,
      },
      600: {
        slidesPerView: 2,
      },
      1000: {
        slidesPerView: 5,
      },
    },
  };

  useEffect(() => {
    if (didMountRef.current) {
      SetSession(localStorage.getItem("USER_TOKEN"));
      getHomeCategoryData();
    }
    didMountRef.current = false;
  }, [homeCategoriesData]);
  const getHomeCategoryData = () => {
    setLoading(true);
    ApiService.fetchData("category-wise-products").then((res) => {
      if (res.status == "success") {
        setHomeCategoriesData(res.categoriesData);
        setLoading(false);
      }
    });
  };

  const addtofav = (productId) => {
    const dataString = {
      product_id: productId,
    };
    ApiService.postData("add-to-fav", dataString).then((res) => {
      if (res.data.status == "success") {
        var element = document.getElementById("wishlisticon" + productId);
        element.classList.remove("d-icon-heart", "d-icon-heart-full");
        element.classList.add(res.data.notification);
        if (res.data.notification === "d-icon-heart") {
          toast.success("Removed from wishlist");
        } else {
          toast.success("Added to Wishlist");
        }
      }
    });
  };

  const addtocart = (addproduct) => {
    //localStorage.clear();return ;
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
    cartSession = localStorage.getItem("CART_SESSION");
    cartSession = cartSession ? JSON.parse(cartSession) : [];
    localStorage.removeItem("COUPON_SESSION");
    onParentData(false);
  };

  return (
    <>
      {loading == true ? (
        <section className="sec-pad pt-0">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="product">
                  <figure className="product-media">
                    <Skeleton variant="text" width={300} height={300} />
                  </figure>
                  <div className="product-details">
                    <h3 className="product-name">
                      <Skeleton variant="text" width={150} />
                    </h3>
                    <div className="product-price">
                      <Skeleton variant="text" width={150} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="product">
                  <figure className="product-media">
                    <Skeleton variant="text" width={300} height={300} />
                  </figure>
                  <div className="product-details">
                    <h3 className="product-name">
                      <Skeleton variant="text" width={150} />
                    </h3>
                    <div className="product-price">
                      <Skeleton variant="text" width={150} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="product">
                  <figure className="product-media">
                    <Skeleton variant="text" width={300} height={300} />
                  </figure>
                  <div className="product-details">
                    <h3 className="product-name">
                      <Skeleton variant="text" width={150} />
                    </h3>
                    <div className="product-price">
                      <Skeleton variant="text" width={150} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="product">
                  <figure className="product-media">
                    <Skeleton variant="text" width={300} height={300} />
                  </figure>
                  <div className="product-details">
                    <h3 className="product-name">
                      <Skeleton variant="text" width={150} />
                    </h3>
                    <div className="product-price">
                      <Skeleton variant="text" width={150} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : homeCategoriesData.length > 0 ?(
        <>
          {homeCategoriesData.map((value, index) => {
            if (value.catProducts.length > 0) {
              if (value.cat_grid_type === 1) {
                return (
                  <section className="sec-pad pt-0" key={index}>
                    <div className="container" key={index}>
                      <div className="section-title d-flex align-items-center justify-content-between mb-4">
                        <h2 className="mb-0">{value.cat_name}</h2>
                        <a href={"/collection/category/" + value.cat_slug}>
                          View All <i className="d-icon-arrow-right"></i>
                        </a>
                      </div>
                      <div className="row">
                        {value.catProducts.map((subvalue, indexProduct) => {
                          let mrpValue = parseFloat(subvalue.product_price);
                          let sellingPriceValue = parseFloat(
                            subvalue.product_selling_price
                          );
                          let discount = 0;
                          if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                            discount = (
                              ((mrpValue - sellingPriceValue) / mrpValue) *
                              100
                            );
                          }
                          return (
                            <div className="col-lg-3 col-6" key={indexProduct}>
                              <div className="product">
                                <figure className="product-media">
                                  <a
                                    href={
                                      "/product/" +
                                      subvalue.product_slug
                                    }
                                  >
                                    {subvalue.product_type === 0 ? (
                                        subvalue.product_inventory === 1 ? (
                                          subvalue.product_stock === 0 ? (
                                            subvalue.product_backorder === 0 || subvalue.product_backorder === 1 ? (
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
                                        subvalue.product_stock === 0 ? (
                                          <div className="stock-text-p mb-0"> Out of Stock</div>
                                        ) : (
                                          null
                                        )
                                      )}
                                    
                                    <img
                                      src={
                                        subvalue.product_image != null
                                          ? subvalue.product_image
                                          : constant.DEFAULT_IMAGE
                                      }
                                      alt={subvalue.product_name}
                                      width="280"
                                      height="315"
                                    />
                                    {subvalue.gallery.length > 0 ? (
                                      <img
                                        src={
                                          subvalue.gallery[0].gallery_image
                                            ? subvalue.gallery[0].gallery_image
                                            : constant.DEFAULT_IMAGE
                                        }
                                        alt={subvalue.product_name}
                                        width="280"
                                        height="315"
                                      />
                                    ) : null}
                                  </a>
                                  {subvalue.product_tag_name != "" ? (
                                    <div className="product-label-group">
                                      {subvalue.product_tag_name
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
                                    {setSession ? (
                                      subvalue.ufp_id > 0 ? (
                                        <a
                                          href="javascript:void(0)"
                                          className="btn-product-icon btn-wishlist"
                                          title="Add to wishlists"
                                          onClick={(e) =>
                                            addtofav(subvalue.product_id)
                                          }
                                        >
                                          <i
                                            className="d-icon-heart-full"
                                            id={
                                              "wishlisticon" +
                                              subvalue.product_id
                                            }
                                          ></i>
                                        </a>
                                      ) : (
                                        <a
                                          href="javascript:void(0)"
                                          className="btn-product-icon btn-wishlist"
                                          title="Add to wishlist"
                                          onClick={(e) =>
                                            addtofav(subvalue.product_id)
                                          }
                                        >
                                          <i
                                            className="d-icon-heart"
                                            id={
                                              "wishlisticon" +
                                              subvalue.product_id
                                            }
                                          ></i>
                                        </a>
                                      )
                                    ) : (
                                      <a
                                        href="javascript:void(0)"
                                        className="btn-product-icon btn-wishlist"
                                        title="Add to wishlist"
                                        onClick={handleShow}
                                      >
                                        <i className="d-icon-heart"></i>
                                      </a>
                                    )}
                                  </div>
                                  <div className="product-action">
                                    <a
                                      href="javascript:void(0)"
                                      className="btn-product btn-quickview"
                                      title="Quick View"
                                      onClick={() => {
                                        handleShowQuickModal(subvalue);
                                      }}
                                    >
                                      Quick View
                                    </a>
                                  </div>
                                </figure>
                                <div className="product-details">
                                  <div className="product-details-inner">
                                    <h3 className="product-name">
                                      <a
                                        href={
                                          "/product/" +
                                          subvalue.product_slug
                                        }
                                      >
                                        {subvalue.product_name}
                                      </a>
                                    </h3>
                                    <div className="product-price">
                                      <ins className="new-price">
                                        {multiCurrency(
                                          subvalue.product_selling_price
                                        )}
                                      </ins>
                                      {discount > 0 ? (
                                        <>
                                          <del className="old-price">
                                            {multiCurrency(
                                              subvalue.product_price
                                            )}
                                          </del>
                                          <span className="off">
                                            {Math.round(discount)}% Off
                                          </span>
                                        </>
                                      ) : null}
                                    </div>
                                    {value.product_rating &&
                                    value.product_rating > 0 ? (
                                      <div className="ratings-container">
                                        <StarRating
                                          numberOfStars={
                                            subvalue.product_rating
                                          }
                                        />
                                        <span>
                                          ( {subvalue.product_review} reviews )
                                        </span>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div>
                                    {subvalue.product_type === 0 ? (
                                      <button
                                        className="btn btn-primary-outline btn-small"
                                        onClick={(e) => addtocart(subvalue)}
                                      >
                                        Add To Cart
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-primary-outline btn-small"
                                        onClick={() => {
                                          handleShowVariation(subvalue);
                                        }}
                                      >
                                        Add To Cart
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              } else {
                return (
                  <section className="sec-pad pt-0" key={index}>
                    <div className="container" key={index}>
                      <div className="section-title d-flex align-items-center justify-content-between mb-4">
                        <h2 className="mb-0">{value.cat_name}</h2>
                        <a href={"/collection/category/" + value.cat_slug}>
                          View All <i className="d-icon-arrow-right"></i>
                        </a>
                      </div>
                      <Swiper {...productCarouselOptions}>
                        {value.catProducts.map((subvalue, indexProduct) => {
                          let mrpValue = parseFloat(subvalue.product_price);
                          let sellingPriceValue = parseFloat(
                            subvalue.product_selling_price
                          );
                          let discount = 0;
                          if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                            discount = (
                              ((mrpValue - sellingPriceValue) / mrpValue) *
                              100
                            );
                          }
                          return (
                            <SwiperSlide key={indexProduct}>
                              <div className="product" key={indexProduct}>
                                <figure className="product-media">
                                  <a
                                    href={
                                      "/product/" +
                                      subvalue.product_slug
                                    }
                                  > 
                                    
                                      {subvalue.product_type === 0 ? (
                                        subvalue.product_inventory === 1 ? (
                                          subvalue.product_stock === 0 ? (
                                            subvalue.product_backorder === 0 || subvalue.product_backorder === 1 ? (
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
                                        subvalue.product_stock === 0 ? (
                                          <div className="stock-text-p mb-0"> Out of Stock</div>
                                        ) : (
                                          null
                                        )
                                      )}
                                    
                                    <img
                                      src={
                                        subvalue.product_image != null
                                          ? subvalue.product_image
                                          : constant.DEFAULT_IMAGE
                                      }
                                      alt={subvalue.product_name}
                                      width="280"
                                      height="315"
                                    />
                                    {subvalue.gallery.length > 0 ? (
                                      <img
                                        src={
                                          subvalue.gallery[0].gallery_image
                                            ? subvalue.gallery[0].gallery_image
                                            : constant.DEFAULT_IMAGE
                                        }
                                        alt={subvalue.product_name}
                                        width="280"
                                        height="315"
                                      />
                                    ) : null}
                                  </a>
                                  {subvalue.product_tag_name != "" ? (
                                    <div className="product-label-group">
                                      {subvalue.product_tag_name
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
                                    {setSession ? (
                                      subvalue.ufp_id > 0 ? (
                                        <a
                                          href="javascript:void(0)"
                                          className="btn-product-icon btn-wishlist"
                                          title="Add to wishlists"
                                          onClick={(e) =>
                                            addtofav(subvalue.product_id)
                                          }
                                        >
                                          <i
                                            className="d-icon-heart-full"
                                            id={
                                              "wishlisticon" +
                                              subvalue.product_id
                                            }
                                          ></i>
                                        </a>
                                      ) : (
                                        <a
                                          href="javascript:void(0)"
                                          className="btn-product-icon btn-wishlist"
                                          title="Add to wishlist"
                                          onClick={(e) =>
                                            addtofav(subvalue.product_id)
                                          }
                                        >
                                          <i
                                            className="d-icon-heart"
                                            id={
                                              "wishlisticon" +
                                              subvalue.product_id
                                            }
                                          ></i>
                                        </a>
                                      )
                                    ) : (
                                      <a
                                        href="javascript:void(0)"
                                        className="btn-product-icon btn-wishlist"
                                        title="Add to wishlist"
                                        onClick={handleShow}
                                      >
                                        <i className="d-icon-heart"></i>
                                      </a>
                                    )}
                                  </div>
                                  <div className="product-action">
                                    <a
                                      href="javscript:void(0);"
                                      className="btn-product btn-quickview"
                                      title="Quick View"
                                      onClick={() => {
                                        handleShowQuickModal(subvalue);
                                      }}
                                    >
                                      Quick View
                                    </a>
                                  </div>
                                </figure>
                                <div className="product-details">
                                  <div className="product-details-inner">
                                    <h3 className="product-name">
                                      <a
                                        href={
                                          "/product/" +
                                          subvalue.product_slug
                                        }
                                      >
                                        {subvalue.product_name}
                                      </a>
                                    </h3>
                                    <div className="product-price">
                                      <ins className="new-price">
                                        {multiCurrency(
                                          subvalue.product_selling_price
                                        )}
                                      </ins>
                                      {discount > 0 ? (
                                        <>
                                          <del className="old-price">
                                            {multiCurrency(
                                              subvalue.product_price
                                            )}
                                          </del>
                                          <span className="off">
                                            {Math.round(discount)}% Off
                                          </span>
                                        </>
                                      ) : null}
                                    </div>
                                    {subvalue.product_rating &&
                                    subvalue.product_rating > 0 ? (
                                      <div className="ratings-container">
                                        <StarRating
                                          numberOfStars={
                                            subvalue.product_rating
                                          }
                                        />
                                        <span>
                                          ( {subvalue.product_review} reviews )
                                        </span>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div>
                                    {subvalue.product_type === 0 ? (
                                      <button
                                        className="btn btn-primary-outline btn-small"
                                        onClick={(e) => addtocart(subvalue)}
                                      >
                                        Add To Cart
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-primary-outline btn-small"
                                        onClick={() => {
                                          handleShowVariation(subvalue);
                                        }}
                                      >
                                        Add To Cart
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </div>
                  </section>
                );
              }
            }
          })}
        </>
      ):null}
      {show && <LoginModal showmodal={show} onChildData={handleChildData} />}
      {showQuick && (
        <QuickViewModal
          showmodal={showQuick}
          productdata={productData}
          onChildData={handleChildQuickModalData}
        />
      )}
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
export default CategoryWiseProducts;
