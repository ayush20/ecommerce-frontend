import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../Components/Services/apiservices";
import MobileHeader from "../../Components/Elements/mobile_header";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import constant from "../../Components/Services/constant";
import numeral from "numeral";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import SubmitReviewModal from "../../Components/Modals/submitreview_modal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import LoginModal from "../../Components/Modals/login_modal";
import QuickViewModal from "../../Components/Modals/quick_view_modal";
import sessionCartData from "../../Components/Elements/cart_session_data";
import StarRating from "../../Components/Elements/starrating";
import moment from "moment";
import multiCurrency from "../../Components/Elements/multi_currrency";
import { Helmet } from "react-helmet";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import ViewAllReviewModal from "../../Components/Modals/view_all_review_modal";

function Productdetails() {
  const didMountRef = useRef(true);
  const Navigate = useNavigate();
  const [rowProductsData, setProductsData] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const parsedRecentlyProductsSession = dataArray[4];
  const [cartCount, setCartCount] = useState(parsedCartSession.length);
  const [settingData, setSettingData] = useState([]);
  const [settingImagePath, setSettingImagePath] = useState("");
  const [adminData, setAdminData] = useState({});
  const [variationData, setVariationData] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [arySelectedData, setArySelectedData] = useState([]);
  const [selvararray, setSelvararray] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [ReviewData, setReviewData] = useState([]);
  const [PercentageData, setPercentageData] = useState([]);
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [SubmitReview, setSubmitReview] = useState(false);
  const [productData, setProductData] = useState(null);
  const [showQuick, setShowQuick] = useState(false);
  const [showViewAllReview, setShowViewAllReview] = useState(false);
  const [setSession, SetSession] = useState("");
  const [visitor, SetVisitor] = useState();
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [recentlyViewedData, setRecentlyViewedData] = useState(
    parsedRecentlyProductsSession
  );

  const { slug } = useParams();
  let mrpValue = 0;
  let sellingPriceValue = 0;
  let discount = 0;
  useEffect(() => {
    setSpinnerLoading(true);
    if (didMountRef.current) {
      SetSession(localStorage.getItem("USER_TOKEN"));
      getProductDetails();
      getSettingsData();
      SetVisitor(Math.floor(Math.random() * (99 - 10 + 1)) + 10);
    }
    didMountRef.current = false;
  }, []);

  const recentlyProducts = (value) => {
    let recentlyProductsSession = localStorage.getItem("RECENTLY_VIEWED");
    recentlyProductsSession = recentlyProductsSession
      ? JSON.parse(recentlyProductsSession)
      : [];

    if (!Array.isArray(recentlyProductsSession)) {
      recentlyProductsSession = [];
    }

    const existingProductIndex = recentlyProductsSession.findIndex((item) => {
      return item.product_id === value.product_id;
    });

    if (existingProductIndex !== -1) {
      recentlyProductsSession[existingProductIndex] = value;
    } else {
      if (recentlyProductsSession.length >= 10) {
        recentlyProductsSession.shift();
      }
      recentlyProductsSession.push(value);
      localStorage.setItem(
        "RECENTLY_VIEWED",
        JSON.stringify(recentlyProductsSession)
      );
    }
  };

  const handleChildData = (status) => {
    setShow(status);
  };

  const handleChildQuickModalData = (status) => {
    setShowQuick(status);
  };
  const handleShowQuickModal = (data) => {
    setProductData(data);
    setShowQuick(true);
  };

  const handleChildViewAllReviewModalData = (status) => {
    setShowViewAllReview(status);
  };
  const handleShowViewAllReviewModal = (data) => {
    setReviewData(data);
    setShowViewAllReview(true);
  };

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
        slidesPerView: 3.2,
      },
      1000: {
        slidesPerView: 3.5,
      },
    },
  };
  const getSettingsData = () => {
    ApiService.fetchData("settings").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
        setSettingImagePath(res.setting_image_path);
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
        getProductDetails();
        if (res.data.notification === "d-icon-heart") {
          toast.success("Removed from wishlist");
        } else {
          toast.success("Added to Wishlist");
        }
      }
    });
  };
  const getProductDetails = () => {
    const dataString = {
      slug: slug,
    };

    ApiService.postData("product-details", dataString).then((res) => {
      if (res.status === "success") {
        recentlyProducts(res.rowProductData);
        setSelvararray(res.selvararray);
        setProductsData(res.rowProductData);
        setRelatedProducts(res.relatedProducts);
        setAdminData(res.admin_data);
        setVariationData(res.variationData);
        setReviewData(res.review_data);
        setPercentageData(res.percentageData);
        setTimeout(() => {
          mrpValue = parseFloat(res.rowProductData.product_price);
          sellingPriceValue = parseFloat(
            res.rowProductData.product_selling_price
          );
          if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
            discount = ((mrpValue - sellingPriceValue) / mrpValue) * 100;
            setDiscountPercentage(discount.toFixed(2));
          }
          let parentcounter = 0;
          let childcounter = 0;
          res.variationData.map((parent) => {
            if (parent.attributes && parent.attributes.attribute_type == 3) {
              parent.attr_terms.map((child) => {
                parentcounter++;
                if (parentcounter == 1) {
                  arySelectedData.push(child.terms_name);
                }
              });
              parentcounter = 0;
            } else if (
              parent.attributes &&
              parent.attributes.attribute_type == 2
            ) {
              parent.attr_terms.map((child) => {
                childcounter++;
                if (childcounter == 1) {
                  arySelectedData.push(child.terms_name);
                }
              });
              childcounter = 0;
            } else if (
              parent.attributes &&
              parent.attributes.attribute_type == 1
            ) {
              parent.attr_terms.map((child) => {
                childcounter++;
                if (childcounter == 1) {
                  arySelectedData.push(child.terms_name);
                }
              });
              childcounter = 0;
            }

            setSpinnerLoading(false);
          });

          const galleryItems = [
            {
              original:
                res.rowProductData.product_image != null
                  ? res.rowProductData.product_image
                  : constant.DEFAULT_IMAGE,
              thumbnail:
                res.rowProductData.product_image != null
                  ? res.rowProductData.product_image
                  : constant.DEFAULT_IMAGE,
            },
          ];

          res.rowProductData.gallery.map((value) => {
            galleryItems.push({
              original:
                value.gallery_image != null
                  ? value.gallery_image
                  : constant.DEFAULT_IMAGE,
              thumbnail:
                value.gallery_image != null
                  ? value.gallery_image
                  : constant.DEFAULT_IMAGE,
            });
          });
          setGalleryItems(galleryItems);
          setSpinnerLoading(false);
        }, 1000);
      } else {
        setSpinnerLoading(false);
      }
    });
  };

  const variationSelect = (item, index) => {
    const updatedSelectedData = [...arySelectedData];
    updatedSelectedData[index] = item.terms_name;
    const selvararray = updatedSelectedData;
    const dataString = {
      variation: selvararray,
      product_id: rowProductsData.product_id,
    };

    ApiService.postData("variation-wise-price", dataString).then((res) => {
      setSelvararray(selvararray);
      rowProductsData.product_sku = res.data.pv_sku;
      rowProductsData.product_selling_price = res.data.pv_sellingprice;
      rowProductsData.product_price = res.data.pv_price;
      rowProductsData.product_stock = res.data.pv_quantity;
      rowProductsData.product_moq = res.data.pv_moq;
      rowProductsData.product_discount = res.data.pv_discount;
      if (item.variation_images) {
        rowProductsData.product_image =
          item.variation_images.pti_image != null
            ? item.variation_images.pti_image
            : constant.DEFAULT_IMAGE;
      } else {
        rowProductsData.product_image =
          rowProductsData.product_image != null
            ? rowProductsData.product_image
            : constant.DEFAULT_IMAGE;
      }
      setProductsData(rowProductsData);
      mrpValue = parseFloat(res.data.pv_price);
      sellingPriceValue = parseFloat(res.data.pv_sellingprice);
      if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
        discount = ((mrpValue - sellingPriceValue) / mrpValue) * 100;
      }
      setDiscountPercentage(discount.toFixed(2));
      setQuantity(1);
    });
  };

  const addtocart = (addproduct, purchaseType) => {
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
      product_variation: selvararray,
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
          if (existingProductIndex !== -1) {
            if (
              cartSession[existingProductIndex].quantity + quantity <=
              Number(addproduct.product_stock)
            ) {
              if (
                Number(addproduct.product_moq) === 0 ||
                cartSession[existingProductIndex].quantity + quantity <=
                  Number(addproduct.product_moq)
              ) {
                cartSession[existingProductIndex].quantity += quantity;
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
            cartSession.push({ ...product, quantity: quantity });
            toast.success("Product Added in cart Successfully");
          } 
        } else {
          if (addproduct.product_backorder === 0) {
            toast.error("Product is out of stock");
            return false;
          } else if (addproduct.product_backorder === 1) {
            if (existingProductIndex !== -1) {
              if (
                Number(addproduct.product_moq) === 0 ||
                cartSession[existingProductIndex].quantity + quantity <=
                  Number(addproduct.product_moq)
              ) {
                cartSession[existingProductIndex].quantity += quantity;
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
              cartSession.push({ ...product, quantity: quantity });
              toast.success("Product Added in cart Successfully");
            }
          } else {
            cartSession.push({ ...product, quantity: quantity });
            toast.success("Product Added in cart Successfully");
          }
        }
      } else {
        if (existingProductIndex !== -1) {
          if (
            Number(addproduct.product_moq) === 0 ||
            cartSession[existingProductIndex].quantity + quantity <=
              Number(addproduct.product_moq)
          ) {
            cartSession[existingProductIndex].quantity += quantity;
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
          if (
            Number(addproduct.product_moq) === 0 ||
            1 <= Number(addproduct.product_moq)
          ) {
            cartSession.push({ ...product, quantity: quantity });
            toast.success("Product Added in cart Successfully");
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
          cartSession[existingProductIndex].quantity + quantity <=
          Number(addproduct.product_stock)
        ) {
          if (
            Number(addproduct.product_moq) === 0 ||
            cartSession[existingProductIndex].quantity + quantity <=
              Number(addproduct.product_moq)
          ) {
            cartSession[existingProductIndex].quantity += quantity;
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
        if (1 <= Number(addproduct.product_stock)) {
          if (Number(addproduct.product_moq) === 0 || quantity <= Number(addproduct.product_moq) ) {
            cartSession.push({ ...product, quantity: quantity });
            toast.success("Product Added in cart Successfully");
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
      }
    }

    localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
    cartSession = localStorage.getItem("CART_SESSION");
    cartSession = cartSession ? JSON.parse(cartSession) : [];
    localStorage.removeItem("COUPON_SESSION");
    if (purchaseType === 1) {
      Navigate("/cart");
    } else {
      setCartCount(cartSession.length);
    }
  };

  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [thumbsSwiperVertical, setThumbsSwiperVertical] = useState(null);
  const closeSubmitReview = (data) => {
    setSubmitReview(data);
  };
  const RatingSection = () => {
    const ratings = [5, 4, 3, 2, 1]; // An array containing the different numberOfStars values

    return (
      <div>
        {ratings.map((stars, index) => (
          <div key={index} className="ratings-item">
            <div className="ratings-container mb-0">
              <StarRating numberOfStars={stars} />
            </div>
            <div className="rating-percent">
              <span style={{ width: PercentageData[stars] + "%" }}></span>
            </div>
            <div className="rating-value">{PercentageData[stars]}%</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{rowProductsData.product_meta_title}</title>
        <meta
          name="description"
          itemprop="description"
          content={
            rowProductsData.product_meta_desc != null
              ? rowProductsData.product_meta_desc
              : "Momabatti"
          }
        />
        {rowProductsData.product_meta_keyword != null ? (
          <meta
            name="keywords"
            content={rowProductsData.product_meta_keyword}
          />
        ) : (
          ""
        )}
        <link rel="canonical" href={window.location.href} />
        <meta
          property="og:title"
          content={rowProductsData.product_meta_title}
        />
        <meta name="twitter:url" content={window.location.href} />
        <meta
          property="og:image"
          content={constant.FRONT_URL + "img/logo.png"}
        />
        <meta property="og:url" content={window.location.href} />

        <meta
          property="og:description"
          content={
            rowProductsData.product_meta_desc != null
              ? rowProductsData.product_meta_desc
              : "Momabatti"
          }
        />

        <meta
          name="twitter:title"
          content={rowProductsData.product_meta_title}
        />

        <meta
          name="twitter:description"
          content={
            rowProductsData.product_meta_desc != null
              ? rowProductsData.product_meta_desc
              : "Momabatti"
          }
        />
        <meta
          property="twitter:image"
          content={constant.FRONT_URL + "img/logo.png"}
        />
      </Helmet>
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
      <BrowserView>
        <Header state="inner-header" cartCount={cartCount} />
        {spinnerLoading && <SpinnerLoader />}
        <main className="main">
          <div className="page-content mt-5 mb-5">
            <Container>
              <Row className="product-single mb-5">
                <Col lg={6}>
                  <div className="pss-slider">
                    <Swiper
                      style={{
                        "--swiper-navigation-color": "#fff",
                        "--swiper-pagination-color": "#fff",
                      }}
                      loop={true}
                      spaceBetween={10}
                      navigation={true}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                      }}
                      modules={[Autoplay, FreeMode, Navigation, Thumbs]}
                      className="mySwiper2 gallery-top"
                    >
                      {rowProductsData.product_video ? (
                        <SwiperSlide key={0}>
                          <div className="gallery-page__single">
                            <div className="gallery-page__video">
                              <video
                                src={rowProductsData.product_video}
                                autoPlay="autoplay"
                                loop
                                muted
                                playsInline
                              ></video>
                            </div>
                          </div>
                        </SwiperSlide>
                      ) : (
                        <></>
                      )}
                      {galleryItems
                        ? galleryItems.map((value, index) => (
                            <SwiperSlide key={index + Number(1)}>
                              <div
                                className="gallery-page__single"
                                key={index + Number(1)}
                              >
                                <div className="gallery-page__img">
                                  <img
                                    src={
                                      value.original
                                        ? value.original
                                        : constant.DEFAULT_IMAGE
                                    }
                                    alt=""
                                  />
                                  <div className="gallery-page__icon">
                                    <a
                                      className="img-popup"
                                      href={
                                        value.original
                                          ? value.original
                                          : constant.DEFAULT_IMAGE
                                      }
                                    >
                                      <i className="d-icon-zoom"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))
                        : null}
                    </Swiper>
                    <Swiper
                      style={{
                        "--swiper-navigation-color": "#fff",
                        "--swiper-pagination-color": "#fff",
                      }}
                      onSwiper={setThumbsSwiper}
                      direction="vertical"
                      loop={false}
                      spaceBetween={10}
                      slidesPerView={4}
                      freeMode={false}
                      watchSlidesProgress={false}
                      navigation={true}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiperv gallery-thumbs"
                    >
                      {rowProductsData.product_video ? (
                        <SwiperSlide key={0}>
                          <video
                            src={rowProductsData.product_video}
                            autoPlay="autoplay"
                            loop
                            muted
                            playsInline
                          ></video>
                        </SwiperSlide>
                      ) : (
                        <></>
                      )}
                      {galleryItems
                        ? galleryItems.map((value, index) => (
                            <SwiperSlide key={index + Number(1)}>
                              <img
                                src={
                                  value.original
                                    ? value.original
                                    : constant.DEFAULT_IMAGE
                                }
                                key={index + Number(1)}
                              />
                            </SwiperSlide>
                          ))
                        : null}
                    </Swiper>
                  </div>
                </Col>
                <Col lg={6}>
                  <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>
                      {rowProductsData.product_name}
                    </Breadcrumb.Item>
                  </Breadcrumb>
                  <h1 className="product-name">
                    {rowProductsData.product_name}
                  </h1>
                  <div className="product-meta">
                    {rowProductsData.product_sku ? (
                      <>
                        SKU:
                        <span className="product-sku">
                          {rowProductsData.product_sku}
                        </span>
                      </>
                    ) : null}
                    {rowProductsData.product_brand_name ? (
                      <>
                        Brand:
                        <span className="product-sku">
                          {rowProductsData.product_brand_name}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <div className="product-price">
                    <ins className="new-price">
                      {multiCurrency(rowProductsData.product_selling_price)}
                    </ins>

                    {discountPercentage > 0 ? (
                      <>
                        <del className="old-price">
                          {multiCurrency(rowProductsData.product_price)}
                        </del>
                        <span className="off">{Math.round(discountPercentage)}% Off</span>
                      </>
                    ) : null}
                  </div>
                  {ReviewData && ReviewData.length > 0 &&
                  rowProductsData.product_rating &&
                  rowProductsData.product_rating > 0 ? (
                    <div className="ratings-container">
                      <StarRating
                        numberOfStars={rowProductsData.product_rating}
                      />
                      <span>( {rowProductsData.product_review} reviews )</span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="stock-text">
                    Availability:
                    {rowProductsData.product_type === 0 ? (
                      rowProductsData.product_inventory === 1 ? (
                        rowProductsData.product_stock == 0 ? (
                          rowProductsData.product_backorder === 0 ||
                          rowProductsData.product_backorder === 1 ? (
                            <span className="outofdtock">Out of Stock</span>
                          ) : (
                            <span className="instock">In Stock</span>
                          )
                        ) : (
                          <span className="instock">In Stock</span>
                        )
                      ) : (
                        <span className="instock">In Stock</span>
                      )
                    ) : rowProductsData.product_stock == 0 ? (
                      <span className="outofdtock">Out of Stock</span>
                    ) : (
                      <span className="instock">In Stock</span>
                    )}
                  </div>
                  {rowProductsData.product_content ? (
                    <div
                      className="product-short"
                      dangerouslySetInnerHTML={{
                        __html: rowProductsData.product_content,
                      }}
                    ></div>
                  ) : null}
                  {rowProductsData.product_highlight ? (
                    <div className="product-highlight">
                      <ul>
                        {rowProductsData.product_highlight
                          .split("##")
                          .map((highlightvalue, indextag) => {
                            return <li key={indextag}>{highlightvalue}</li>;
                          })}
                      </ul>
                    </div>
                  ) : null}
                  {spinnerLoading === false && (
                    <>
                      {variationData.map((valueVariation, indexVariation) => {
                        if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 1
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "color active"
                                      : "color";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        data-src={constant.DEFAULT_IMAGE}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundColor:
                                            valueVariationAttr.terms_value,
                                          display: "block",
                                        }}
                                      ></a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 2
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "swatch active"
                                      : "swatch";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundImage: `url(${
                                            valueVariationAttr.variation_images !=
                                            null
                                              ? valueVariationAttr
                                                  .variation_images.pti_image
                                              : constant.DEFAULT_IMAGE
                                          })`,
                                          backgroundColor: "#c8c7ce",
                                        }}
                                      >
                                        <img
                                          src={
                                            valueVariationAttr.variation_images !=
                                            null
                                              ? valueVariationAttr
                                                  .variation_images.pti_image
                                              : constant.DEFAULT_IMAGE
                                          }
                                          alt={rowProductsData.product_name}
                                          width="100"
                                          height="100"
                                        />
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 3
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>

                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "size active"
                                      : "size";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        href="javascript:void(0)"
                                        key={indexvalueVariationAttr}
                                      >
                                        {valueVariationAttr.terms_name}
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </>
                  )}
                  <hr className="product-divider mb-3" />
                  <div className="product-button">
                    <div className="pbqty">
                      <button
                        className="quantity-minus d-icon-minus"
                        onClick={handleDecrease}
                      ></button>
                      <input
                        type="number"
                        className="quantity"
                        value={quantity}
                      />
                      <button
                        className="quantity-plus d-icon-plus"
                        onClick={handleIncrease}
                      ></button>
                    </div>
                    <button
                      className="btn btn-primary me-2"
                      onClick={(e) => addtocart(rowProductsData, 0)}
                    >
                      <i className="d-icon-bag"></i>Add To Cart
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => addtocart(rowProductsData, 1)}
                    >
                      Buy Now
                    </button>
                  </div>
                  <hr className="product-divider mb-3" />

                  <div className="product-footer">
                    <div className="social-links mr-4">
                      <FacebookShareButton url={window.location.href}>
                        <span className="social-link social-facebook fab fa-facebook-f"></span>
                      </FacebookShareButton>
                      <TwitterShareButton url={window.location.href}>
                        <span className="social-link social-twitter fab fa-twitter"></span>
                      </TwitterShareButton>
                      <WhatsappShareButton url={window.location.href}>
                        <span className="social-link social-whatsapp fab fa-whatsapp"></span>
                      </WhatsappShareButton>

                      {/* {settingData.facebook_url != null ? (
                        <a
                          href={settingData.facebook_url}
                          className="social-link social-facebook fab fa-facebook-f"
                          target="new"
                        ></a>
                      ) : (
                        ""
                      )}
                      {settingData.twitter_url != null ? (
                        <a
                          href={settingData.twitter_url}
                          className="social-link social-twitter fab fa-twitter"
                          target="new"
                        ></a>
                      ) : (
                        ""
                      )}
                      */}
                      {/* {settingData.pinterest_url != null ? (
                        <a
                          href={settingData.pinterest_url}
                          className="social-link social-pinterest fab fa-pinterest-p"
                          target="new"
                        >
                          {" "}
                        </a>
                      ) : (
                        ""
                      )}  */}
                    </div>
                    <span className="divider d-lg-show"></span>
                    <div className="product-action">
                      {setSession ? (
                        rowProductsData.ufp_id > 0 ? (
                          <a
                            href="javascript:void(0)"
                            className="btn-product btn-wishlist mr-6"
                            onClick={(e) =>
                              addtofav(rowProductsData.product_id)
                            }
                          >
                            <i
                              className="d-icon-heart-full"
                              id={"wishlisticon" + rowProductsData.product_id}
                            ></i>
                            <span>Remove from wishlist</span>
                          </a>
                        ) : (
                          <a
                            href="javascript:void(0)"
                            className="btn-product btn-wishlist mr-6"
                            onClick={(e) =>
                              addtofav(rowProductsData.product_id)
                            }
                          >
                            <i
                              className="d-icon-heart"
                              id={"wishlisticon" + rowProductsData.product_id}
                            ></i>
                            <span>Add to wishlist</span>
                          </a>
                        )
                      ) : (
                        <a
                          href="javascript:void(0)"
                          className="btn-product btn-wishlist mr-6"
                          onClick={handleShow}
                        >
                          <i className="d-icon-heart"></i>
                          <span>Add to wishlist</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <hr className="mt-0" />
                  <p>
                    Real time <span className="rvisitor">+{visitor}</span>{" "}
                    visitor right now
                  </p>
                </Col>
              </Row>

              <Row className="product-details-tabs">
                <Col lg={12}>
                  <Tabs
                    defaultActiveKey="Description"
                    id="uncontrolled-tab-example"
                    className="justify-content-center"
                  >
                    {rowProductsData.product_description ? (
                      <Tab eventKey="Description" title="Description">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: rowProductsData.product_description,
                          }}
                        ></div>
                      </Tab>
                    ) : (
                      ""
                    )}

                    {rowProductsData.product_tabs &&
                      rowProductsData.product_tabs.length > 0 &&
                      rowProductsData.product_tabs.map((value, index) => (
                        <Tab
                          eventKey={value.tab_name}
                          title={value.tab_name}
                          key={index}
                        >
                          <div
                            key={index}
                            dangerouslySetInnerHTML={{
                              __html: value.tab_description,
                            }}
                          ></div>
                        </Tab>
                      ))}
                    <Tab eventKey="Reviews" title="Reviews">
                      {ReviewData && ReviewData.length > 0 ? (
                        <div className="reviewsec">
                          <div className="row">
                            <div className="col-lg-4">
                              <div className="avg-rating-container">
                                <mark>{rowProductsData.product_rating}</mark>
                                <div className="avg-rating">
                                  <span className="avg-rating-title mb-1">
                                    Average Rating
                                  </span>
                                  {ReviewData && ReviewData.length > 0 &&
                                  rowProductsData.product_rating &&
                                  rowProductsData.product_rating > 0 ? (
                                    <div className="ratings-container mb-0">
                                      <StarRating
                                        numberOfStars={
                                          rowProductsData.product_rating
                                        }
                                      />
                                      <span>
                                        ( {rowProductsData.product_review}{" "}
                                        reviews )
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <div className="ratings-list mb-4">
                                <RatingSection />
                              </div>
                              {setSession ? (
                                <button
                                  className="btn btn-primary btn-medium"
                                  onClick={(e) => setSubmitReview(true)}
                                >
                                  Submit Review
                                </button>
                              ) : (
                                <button
                                  className="btn btn-primary btn-medium"
                                  onClick={handleShow}
                                >
                                  Submit Review
                                </button>
                              )}
                            </div>
                            <div className="col-lg-8">
                              <div className="comentlist">
                                <ul>
                                  {ReviewData.map((value, index) => (
                                    <li key={index}>
                                      <div className="comment">
                                        <figure className="comment-media">
                                          <img
                                            src="/img/user.png"
                                            alt="avatar"
                                          />
                                        </figure>
                                        <div className="comment-body">
                                          {value.pr_rating &&
                                          value.pr_rating > 0 ? (
                                            <div className="ratings-container mb-2">
                                              <StarRating
                                                numberOfStars={value.pr_rating}
                                              />
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          <div className="comment-rating"></div>
                                          <div className="comment-user">
                                            <span className="comment-meta">
                                              by{" "}
                                              <span className="comment-name">
                                                {value.pr_title}
                                              </span>{" "}
                                              on
                                              <span className="comment-date">
                                                {moment(
                                                  value.pr_created
                                                ).format("MMM D, YYYY")}
                                              </span>
                                            </span>
                                          </div>
                                          <div className="comment-content">
                                            <p>{value.pr_review}</p>
                                          </div>
                                          <div className="comment-images"></div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : setSession ? (
                        <button
                          className="btn btn-primary btn-medium"
                          onClick={(e) => setSubmitReview(true)}
                        >
                          Submit Review
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-medium"
                          onClick={handleShow}
                        >
                          Submit Review
                        </button>
                      )}
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Container>
          </div>
        </main>

        <section className="sec-pad-small">
          <div className="container">
            <div className="section-title d-flex align-items-center justify-content-between mb-4">
              <h2 className="mb-0">Similar Products</h2>
            </div>
            <Swiper {...productCarouselOptions}>
              {relatedProducts.map((subvalue, indexProduct) => {
                let mrpValue = parseFloat(subvalue.product_price);
                let sellingPriceValue = parseFloat(
                  subvalue.product_selling_price
                );
                let discount = 0;
                if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                  discount = (
                    ((mrpValue - sellingPriceValue) / mrpValue) *
                    100
                  ).toFixed(2);
                } else {
                  discount = 0;
                }
                return (
                  <SwiperSlide key={indexProduct}>
                    <div className="product" key={indexProduct}>
                      <figure className="product-media">
                        <a href={"/product/" + subvalue.product_slug}>
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
                                onClick={(e) => addtofav(subvalue.product_id)}
                              >
                                <i
                                  className="d-icon-heart-full"
                                  id={"wishlisticon" + subvalue.product_id}
                                ></i>
                              </a>
                            ) : (
                              <a
                                href="javascript:void(0)"
                                className="btn-product-icon btn-wishlist"
                                title="Add to wishlist"
                                onClick={(e) => addtofav(subvalue.product_id)}
                              >
                                <i
                                  className="d-icon-heart"
                                  id={"wishlisticon" + subvalue.product_id}
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
                        <h3 className="product-name">
                          <a href={"/product/" + subvalue.product_slug}>
                            {subvalue.product_name}
                          </a>
                        </h3>
                        <div className="product-price">
                          <ins className="new-price">
                            {multiCurrency(subvalue.product_selling_price)}
                          </ins>
                          {discount > 0 ? (
                            <>
                              <del className="old-price">
                                {multiCurrency(subvalue.product_price)}
                              </del>
                              <span className="off">{Math.round(discount)}% Off</span>
                            </>
                          ) : null}
                        </div>
                        {ReviewData && ReviewData.length > 0 &&
                        subvalue.product_rating &&
                        subvalue.product_rating > 0 ? (
                          <div className="ratings-container">
                            <StarRating
                              numberOfStars={subvalue.product_rating}
                            />
                            <span>( {subvalue.product_review} reviews )</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
        <section className="sec-pad-small pt-0">
          {recentlyViewedData.length > 0 ? (
            <div className="container">
              <div className="section-title d-flex align-items-center justify-content-between mb-4">
                <h2 className="mb-0">You also viewed</h2>
              </div>
              <Swiper {...productCarouselOptions}>
                {recentlyViewedData.map((subvalue, indexProduct) => {
                  let mrpValue = parseFloat(subvalue.product_price);
                  let sellingPriceValue = parseFloat(
                    subvalue.product_selling_price
                  );
                  let discount = 0;
                  if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                    discount = (
                      ((mrpValue - sellingPriceValue) / mrpValue) *
                      100
                    ).toFixed(2);
                  } else {
                    discount = 0;
                  }
                  return (
                    <SwiperSlide key={indexProduct}>
                      <div className="product" key={indexProduct}>
                        <figure className="product-media">
                          <a href={"/product/" + subvalue.product_slug}>
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
                          </a>
                          {subvalue.product_tag_name != "" ? (
                            <div className="product-label-group">
                              {subvalue.product_tag_name &&
                                subvalue.product_tag_name.split(", ").length >
                                  0 &&
                                subvalue.product_tag_name

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
                                  onClick={(e) => addtofav(subvalue.product_id)}
                                >
                                  <i
                                    className="d-icon-heart-full"
                                    id={"wishlisticon" + subvalue.product_id}
                                  ></i>
                                </a>
                              ) : (
                                <a
                                  href="javascript:void(0)"
                                  className="btn-product-icon btn-wishlist"
                                  title="Add to wishlist"
                                  onClick={(e) => addtofav(subvalue.product_id)}
                                >
                                  <i
                                    className="d-icon-heart"
                                    id={"wishlisticon" + subvalue.product_id}
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
                          <h3 className="product-name">
                            <a href={"/product/" + subvalue.product_slug}>
                              {subvalue.product_name}
                            </a>
                          </h3>
                          <div className="product-price">
                            <ins className="new-price">
                              {multiCurrency(subvalue.product_selling_price)}
                            </ins>
                            {discount > 0 ? (
                              <>
                                <del className="old-price">
                                  {multiCurrency(subvalue.product_price)}
                                </del>
                                <span className="off">{Math.round(discount)}% Off</span>
                              </>
                            ) : null}
                          </div>
                          {ReviewData && ReviewData.length > 0 && 
                          subvalue.product_rating &&
                          subvalue.product_rating > 0 ? (
                            <div className="ratings-container">
                              <StarRating
                                numberOfStars={subvalue.product_rating}
                              />
                              <span>( {subvalue.product_review} reviews )</span>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          ) : (
            ""
          )}
        </section>

        <Footer />
      </BrowserView>

      <MobileView>
        <MobileHeader Route="" PageName="" cartCount={cartCount} />
        {spinnerLoading && <SpinnerLoader />}
        <main className="main">
          <div className="page-content mb-5 pb-5">
            <Swiper
              style={{
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
              }}
              loop={true}
              spaceBetween={10}
              navigation={true}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              autoplay={{
                delay: 3000000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, FreeMode, Navigation, Thumbs]}
              className="mproduct-details-carousel"
            >
              {rowProductsData.product_video ? (
                <SwiperSlide key={0}>
                  <div className="gallery-page__single">
                    <div className="gallery-page__video">
                      <video
                        src={rowProductsData.product_video}
                        autoPlay="autoplay"
                        loop
                        muted
                        playsInline
                      ></video>
                    </div>
                  </div>
                </SwiperSlide>
              ) : (
                <></>
              )}
              {galleryItems
                ? galleryItems.map((value, index) => (
                    <SwiperSlide key={index + Number(1)}>
                      <div className="gallery-page__single">
                        <div className="gallery-page__img">
                          <img
                            src={
                              value.original
                                ? value.original
                                : constant.DEFAULT_IMAGE
                            }
                            alt=""
                          />
                          <div className="gallery-page__icon">
                            <a
                              className="img-popup"
                              href={
                                value.original
                                  ? value.original
                                  : constant.DEFAULT_IMAGE
                              }
                            >
                              <i className="d-icon-zoom"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                : null}
            </Swiper>

            <div className="mproduct-details product-single p-3">
              <h1 className="product-name">{rowProductsData.product_name}</h1>
              <div className="product-meta">
                {rowProductsData.product_sku ? (
                  <>
                    SKU:
                    <span className="product-sku">
                      {rowProductsData.product_sku}
                    </span>
                  </>
                ) : null}
                {rowProductsData.product_brand_name ? (
                  <>
                    Brand:
                    <span className="product-sku">
                      {rowProductsData.product_brand_name}
                    </span>
                  </>
                ) : null}
              </div>
              <div className="product-price">
                <ins className="new-price">
                  {multiCurrency(rowProductsData.product_selling_price)}
                </ins>
                <del className="old-price">
                  {multiCurrency(rowProductsData.product_price)}
                </del>
                {discountPercentage > 0 ? (
                  <span className="off">{Math.round(discountPercentage)}% Off</span>
                ) : null}
              </div>
              {ReviewData && ReviewData.length > 0 &&
              rowProductsData.product_rating &&
              rowProductsData.product_rating > 0 ? (
                <div className="ratings-container mb-3">
                  <StarRating numberOfStars={rowProductsData.product_rating} />
                  <span>( {rowProductsData.product_review} reviews )</span>
                </div>
              ) : (
                ""
              )}
              <div className="stock-text mb-0">
                Availability:
                {rowProductsData.product_type === 0 ? (
                  rowProductsData.product_inventory === 1 ? (
                    rowProductsData.product_stock == 0 ? (
                      rowProductsData.product_backorder === 0 ||
                      rowProductsData.product_backorder === 1 ? (
                        <span className="outofdtock">Out of Stock</span>
                      ) : (
                        <span className="instock">In Stock</span>
                      )
                    ) : (
                      <span className="instock">In Stock</span>
                    )
                  ) : (
                    <span className="instock">In Stock</span>
                  )
                ) : rowProductsData.product_stock == 0 ? (
                  <span className="outofdtock">Out of Stock</span>
                ) : (
                  <span className="instock">In Stock</span>
                )}
              </div>
            </div>
            {variationData.length > 0 ? (
              <>
                <div className="spacer1"></div>
                <div className="p-3">
                  {spinnerLoading === false && (
                    <>
                      {variationData.map((valueVariation, indexVariation) => {
                        if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 1
                        ) {
                          return (
                            <div className="mvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="mvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "color active"
                                      : "color";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        data-src={constant.DEFAULT_IMAGE}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundColor:
                                            valueVariationAttr.terms_value,

                                          display: "block",
                                        }}
                                      ></a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 2
                        ) {
                          return (
                            <div className="mvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="mvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "swatch active"
                                      : "swatch";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundImage: `url(${
                                            valueVariationAttr.variation_images !=
                                            null
                                              ? valueVariationAttr
                                                  .variation_images.pti_image
                                              : constant.DEFAULT_IMAGE
                                          })`,
                                          backgroundColor: "#c8c7ce",
                                        }}
                                      >
                                        <img
                                          src={
                                            valueVariationAttr.variation_images !=
                                            null
                                              ? valueVariationAttr
                                                  .variation_images.pti_image
                                              : constant.DEFAULT_IMAGE
                                          }
                                          alt={rowProductsData.product_name}
                                          width="100"
                                          height="100"
                                        />
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 3
                        ) {
                          return (
                            <div className="mvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>

                              <div className="mvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "size active"
                                      : "size";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        href="javascript:void(0)"
                                        key={indexvalueVariationAttr}
                                      >
                                        {valueVariationAttr.terms_name}
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </>
                  )}
                </div>
              </>
            ) : (
              ""
            )}
            {rowProductsData.product_highlight ? (
              <>
                <div className="spacer1"></div>
                <div className="p-3">
                  {rowProductsData.product_highlight ? (
                    <div className="product-highlight">
                      <h6 className="tx-14 mb-3">Highlights</h6>
                      <ul>
                        {rowProductsData.product_highlight
                          .split("##")
                          .map((highlightvalue, indextag) => {
                            return <li key={indextag}>{highlightvalue}</li>;
                          })}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              ""
            )}
            <div className="spacer1"></div>
            <div className="maccrod">
              <Accordion defaultActiveKey={["0"]} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Description</Accordion.Header>
                  <Accordion.Body>
                    <div
                      className="mdec"
                      dangerouslySetInnerHTML={{
                        __html: rowProductsData.product_description,
                      }}
                    ></div>
                  </Accordion.Body>
                </Accordion.Item>
                {rowProductsData.product_tabs &&
                  rowProductsData.product_tabs.length > 0 &&
                  rowProductsData.product_tabs.map((value, index) => (
                    <Accordion.Item eventKey={index + Number(1)}>
                      <Accordion.Header>{value.tab_name}</Accordion.Header>
                      <Accordion.Body>
                        <div
                          className="mdec"
                          dangerouslySetInnerHTML={{
                            __html: value.tab_description,
                          }}
                        ></div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
              </Accordion>
            </div>

            <div className="spacer1"></div>
            <div className="p-3">
              <h6 className="tx-14 mb-3">Reviews</h6>
              {ReviewData && ReviewData.length > 0 ? (
                <div className="reviewsec">
                  <div className="avg-rating-container">
                    <mark>{rowProductsData.product_rating}</mark>
                    <div className="avg-rating">
                      <span className="avg-rating-title mb-1">
                        Average Rating
                      </span>
                      {ReviewData && ReviewData.length > 0 && 
                      rowProductsData.product_rating &&
                      rowProductsData.product_rating > 0 ? (
                        <div className="ratings-container mb-0">
                          <StarRating
                            numberOfStars={rowProductsData.product_rating}
                          />
                          <span>
                            ( {rowProductsData.product_review} reviews )
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="ratings-list mb-4">
                    <RatingSection />
                  </div>
                  {setSession ? (
                    <button
                      className="btn btn-primary-outline btn-medium"
                      onClick={(e) => setSubmitReview(true)}
                    >
                      Submit Review
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary-outline btn-medium"
                      onClick={handleShow}
                    >
                      Submit Review
                    </button>
                  )}
                  <div className="comentlist">
                    <ul>
                      {ReviewData.map((value, index) => {
                        if (index <= 2) {
                          return (
                            <li key={index}>
                              <div className="comment">
                                <div className="comment-body">
                                  {value.pr_rating && value.pr_rating > 0 ? (
                                    <div className="ratings-container mb-2">
                                      <StarRating
                                        numberOfStars={value.pr_rating}
                                      />
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <div className="comment-rating"></div>
                                  <div className="comment-user">
                                    <span className="comment-meta">
                                      by{" "}
                                      <span className="comment-name">
                                        {value.pr_title}
                                      </span>{" "}
                                      on
                                      <span className="comment-date">
                                        {moment(value.pr_created).format(
                                          "MMM D, YYYY"
                                        )}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="comment-content">
                                    <p>{value.pr_review}</p>
                                  </div>
                                  <div className="comment-images"></div>
                                </div>
                              </div>
                            </li>
                          );
                        }
                      })}
                    </ul>
                  </div>
                  {ReviewData.length > 0 ? (
                    <p
                      className="mb-0 tx-theme"
                      onClick={() => {
                        handleShowViewAllReviewModal(ReviewData);
                      }}
                    >
                      {" "}
                      View All Reviews
                    </p>
                  ) : null}
                </div>
              ) : setSession ? (
                <button
                  className="btn btn-primary-outline btn-medium"
                  onClick={(e) => setSubmitReview(true)}
                >
                  Submit Review
                </button>
              ) : (
                <button
                  className="btn btn-primary-outline btn-medium"
                  onClick={handleShow}
                >
                  Submit Review
                </button>
              )}
            </div>

            <div className="spacer1"></div>
            <div className="p-3">
              <h6 className="tx-14 mb-3">Similar products</h6>
              <Swiper {...productCarouselOptions}>
                {relatedProducts.map((subvalue, indexProduct) => {
                  let mrpValue = parseFloat(subvalue.product_price);
                  let sellingPriceValue = parseFloat(
                    subvalue.product_selling_price
                  );
                  let discount = 0;
                  if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                    discount = (
                      ((mrpValue - sellingPriceValue) / mrpValue) *
                      100
                    ).toFixed(2);
                  } else {
                    discount = 0;
                  }
                  return (
                    <SwiperSlide key={indexProduct}>
                      <div className="product" key={indexProduct}>
                        <figure className="product-media">
                          <a href={"/product/" + subvalue.product_slug}>
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
                                  onClick={(e) => addtofav(subvalue.product_id)}
                                >
                                  <i
                                    className="d-icon-heart-full"
                                    id={"wishlisticon" + subvalue.product_id}
                                  ></i>
                                </a>
                              ) : (
                                <a
                                  href="javascript:void(0)"
                                  className="btn-product-icon btn-wishlist"
                                  title="Add to wishlist"
                                  onClick={(e) => addtofav(subvalue.product_id)}
                                >
                                  <i
                                    className="d-icon-heart"
                                    id={"wishlisticon" + subvalue.product_id}
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
                          <h3 className="product-name">
                            <a href={"/product/" + subvalue.product_slug}>
                              {subvalue.product_name}
                            </a>
                          </h3>
                          <div className="product-price">
                            <ins className="new-price">
                              {multiCurrency(subvalue.product_selling_price)}
                            </ins>
                            {discount > 0 ? (
                              <>
                                <del className="old-price">
                                  {multiCurrency(subvalue.product_price)}
                                </del>
                                <span className="off">{Math.round(discount)}% Off</span>
                              </>
                            ) : null}
                          </div>
                          {ReviewData && ReviewData.length > 0 &&
                          subvalue.product_rating &&
                          subvalue.product_rating > 0 ? (
                            <div className="ratings-container">
                              <StarRating
                                numberOfStars={subvalue.product_rating}
                              />
                              <span>( {subvalue.product_review} reviews )</span>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
            <div className="spacer1"></div>
            <div className="p-3">
              <h6 className="tx-14 mb-3">You also viewed</h6>
              <Swiper {...productCarouselOptions}>
                {recentlyViewedData.map((subvalue, indexProduct) => {
                  let mrpValue = parseFloat(subvalue.product_price);
                  let sellingPriceValue = parseFloat(
                    subvalue.product_selling_price
                  );
                  let discount = 0;
                  if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
                    discount = (
                      ((mrpValue - sellingPriceValue) / mrpValue) *
                      100
                    ).toFixed(2);
                  } else {
                    discount = 0;
                  }
                  return (
                    <SwiperSlide key={indexProduct}>
                      <div className="product" key={indexProduct}>
                        <figure className="product-media">
                          <a href={"/product/" + subvalue.product_slug}>
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
                          </a>
                          {subvalue.product_tag_name != "" ? (
                            <div className="product-label-group">
                              {subvalue.product_tag_name &&
                                subvalue.product_tag_name.split(", ").length >
                                  0 &&
                                subvalue.product_tag_name
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
                                  onClick={(e) => addtofav(subvalue.product_id)}
                                >
                                  <i
                                    className="d-icon-heart-full"
                                    id={"wishlisticon" + subvalue.product_id}
                                  ></i>
                                </a>
                              ) : (
                                <a
                                  href="javascript:void(0)"
                                  className="btn-product-icon btn-wishlist"
                                  title="Add to wishlist"
                                  onClick={(e) => addtofav(subvalue.product_id)}
                                >
                                  <i
                                    className="d-icon-heart"
                                    id={"wishlisticon" + subvalue.product_id}
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
                          <h3 className="product-name">
                            <a href={"/product/" + subvalue.product_slug}>
                              {subvalue.product_name}
                            </a>
                          </h3>
                          <div className="product-price">
                            <ins className="new-price">
                              {multiCurrency(subvalue.product_selling_price)}
                            </ins>
                            {discount > 0 ? (
                              <>
                                <del className="old-price">
                                  {multiCurrency(subvalue.product_price)}
                                </del>
                                <span className="off">{Math.round(discount)}% Off</span>
                              </>
                            ) : null}
                          </div>
                          {ReviewData && ReviewData.length > 0 &&
                          subvalue.product_rating &&
                          subvalue.product_rating > 0 ? (
                            <div className="ratings-container">
                              <StarRating
                                numberOfStars={subvalue.product_rating}
                              />
                              <span>( {subvalue.product_review} reviews )</span>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </main>

        <div className="mproduct-footer">
          <button
            className="btn btn-primary-outline btn-medium me-2"
            onClick={(e) => addtocart(rowProductsData, 0)}
          >
            <i className="d-icon-bag me-2"></i>Add To Cart
          </button>
          <button
            className="btn btn-primary btn-medium"
            onClick={(e) => addtocart(rowProductsData, 1)}
          >
            Buy Now
          </button>
        </div>
      </MobileView>
      {show && <LoginModal showmodal={show} onChildData={handleChildData} />}
      {showQuick && (
        <QuickViewModal
          showmodal={showQuick}
          productdata={productData}
          onChildData={handleChildQuickModalData}
        />
      )}
      {showViewAllReview && (
        <ViewAllReviewModal
          showmodal={showViewAllReview}
          reviewData={ReviewData}
          onChildData={handleChildViewAllReviewModalData}
        />
      )}
      <SubmitReviewModal
        SubmitReview={SubmitReview}
        slug={slug}
        closeSubmitReview={closeSubmitReview}
      />
    </>
  );
}
export default Productdetails;
