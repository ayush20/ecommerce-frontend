import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"; 
import constant from "../../Components/Services/constant";
import numeral from "numeral";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import SpinnerLoader from "../../Components/Elements/spinner_loader"; 
import Modal from "react-bootstrap/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import LoginModal from "./login_modal";
import StarRating from "../Elements/starrating";
import multiCurrency from "../../Components/Elements/multi_currrency";

function QuickViewModal({showmodal,productdata=null,onChildData}) {
    const didMountRef = useRef(true);
    const Navigate = useNavigate();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [showQuick, setShowQuick] = useState(showmodal);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [adminData, setAdminData] = useState({});
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [rowProductsData, setProductsData] = useState({});
    const [variationDataa, setVariationData] = useState([]);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [arySelectedData, setArySelectedData] = useState([]);
    const [selvararray, setSelvararray] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [settingData, setSettingData] = useState([]);
    
    const [setSession, SetSession] = useState("");
    
    const handleChildData = (status) => {
      setShow(status);
    };

    let mrpValue = 0;
    let sellingPriceValue = 0;
    let discount = 0;

    useEffect(() => {
      if (didMountRef.current) {
        SetSession(localStorage.getItem("USER_TOKEN"));
        getProductDetails();
        getSettingsData();
      }
      didMountRef.current = false;
    }, []);

    const getSettingsData = () => {
      ApiService.fetchData("settings").then((res) => {
        if (res.status == "success") {
          setSettingData(res.sitesettings);
        }
      });
    };

    const getProductDetails = () => {
      const dataString = {
        slug: productdata.product_slug,
      };
      ApiService.postData("product-details", dataString).then((res) => {
        if (res.status === "success") {
          recentlyProducts(res.rowProductData)
          setSelvararray(res.selvararray);
          setProductsData(res.rowProductData);
          setAdminData(res.admin_data);
          setVariationData(res.variationData);
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
              } else if (parent.attributes && parent.attributes.attribute_type == 2) {
                parent.attr_terms.map((child) => {
                  childcounter++;
                  if (childcounter == 1) {
                    arySelectedData.push(child.terms_name);
                  }
                });
                childcounter = 0;
              } else if (parent.attributes && parent.attributes.attribute_type == 1) {
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
                original: res.rowProductData.product_image != null ? res.rowProductData.product_image : constant.DEFAULT_IMAGE,
                thumbnail: res.rowProductData.product_image != null ? res.rowProductData.product_image : constant.DEFAULT_IMAGE,
              },
            ];
            
            res.rowProductData.gallery.map((value) => {
              galleryItems.push({
                original: value.gallery_image != null ? value.gallery_image : constant.DEFAULT_IMAGE,
                thumbnail: value.gallery_image != null ? value.gallery_image : constant.DEFAULT_IMAGE,
              });
            });
            setGalleryItems(galleryItems)
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
        rowProductsData.product_selling_price = res.data.pv_sellingprice;
        rowProductsData.product_price = res.data.pv_price;
        rowProductsData.product_stock = res.data.pv_quantity;
        rowProductsData.product_moq = res.data.pv_moq;
        rowProductsData.product_discount = res.data.pv_discount;
        rowProductsData.product_sku = res.data.pv_sku;
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
      });
    }; 

    const addtocartold = (addproduct, purchaseType) => {
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
              cartSession[existingProductIndex].quantity + 1 <=
              Number(addproduct.product_stock)
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
          if (addproduct.product_backorder === 0) {
            toast.error("Product is out of stock");
            return false;
          } else if (addproduct.product_backorder === 1) {
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
          } else {
            cartSession.push({ ...product, quantity: 1 });
            toast.success("Product Added in cart Successfully");
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
          if (
            Number(addproduct.product_moq) === 0 ||
            1 <= Number(addproduct.product_moq)
          ) {
            cartSession.push({ ...product, quantity: 1 });
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
          cartSession[existingProductIndex].quantity + 1 <=
          Number(addproduct.product_stock)
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
        if (1 <= Number(addproduct.product_stock)) {
          if (
            Number(addproduct.product_moq) === 0 ||
            1 <= Number(addproduct.product_moq)
          ) {
            cartSession.push({ ...product, quantity: 1 });
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
        window.location.reload();
      }
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
        window.location.reload();
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
    const handleClose = () =>{
      setShow(false)
      onChildData(false)
    }  
    const addtofav = (productId) => {
      const dataString = {
        product_id: productId,
      };
      setSpinnerLoading(true)
      ApiService.postData("add-to-fav", dataString).then((res) => {
        if (res.data.status === "success") {
          var element = document.getElementById("wishlisticon" + productId);
          element.classList.remove("d-icon-heart", "d-icon-heart-full");
          element.classList.add(res.data.notification);
          getProductDetails()
          if (res.data.notification === "d-icon-heart") {
            toast.success("Removed from wishlist");
            setSpinnerLoading(false)
          } else {
            toast.success("Added to Wishlist");
            setSpinnerLoading(false)
          }
        }
      });
    }; 
    const recentlyProducts = (value) => {
      let recentlyProductsSession = localStorage.getItem("RECENTLY_VIEWED");
      recentlyProductsSession = recentlyProductsSession ? JSON.parse(recentlyProductsSession) : [];
  
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
        localStorage.setItem('RECENTLY_VIEWED', JSON.stringify(recentlyProductsSession));
      }
    }
  return (
    <> 
      <Modal show={showQuick} onHide={handleClose} className="quickViewModal">
        <button onClick={handleClose} className="pop-close "><i className="d-icon-times"></i></button>
        <Modal.Body> 
        <Container>
          {spinnerLoading && (<SpinnerLoader />)} 
              <Row className="product-single mb-5">
                <Col lg={6}>
                <Swiper
                  className="mproduct-details-carousel"
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
                  modules={[Autoplay,FreeMode, Navigation, Thumbs]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                >
                  <SwiperSlide>
                    <img
                      src={
                        rowProductsData.product_image != null
                          ? rowProductsData.product_image
                          : constant.DEFAULT_IMAGE
                      }
                      alt={rowProductsData.product_name}
                 
                    />
                  </SwiperSlide>
                  {rowProductsData.gallery ? (
                    rowProductsData.gallery.map((value, indexProduct) => (
                      <SwiperSlide key={indexProduct}>
                        <img
                          src={
                            value.gallery_image != null
                              ? value.gallery_image
                              : constant.DEFAULT_IMAGE
                          }
                          alt={rowProductsData.product_name}
                        />
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <img
                        src={constant.DEFAULT_IMAGE}
                        alt={rowProductsData.product_name}
                      />
                    </SwiperSlide>
                  )}
                </Swiper>
                </Col>
                <Col lg={6}>
                  
                  <h1 className="product-name mt-3">
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
                        ₹{numeral(rowProductsData.product_price).format("0,0.00")}
                      </del>
                      <span className="off">{Math.round(discountPercentage)}% Off</span>
                      </>
                    ) : null}
                  </div>
                  {rowProductsData.product_rating && rowProductsData.product_rating>0 ?
                        <div className="ratings-container">
                        <StarRating numberOfStars={rowProductsData.product_rating} />
                        <span>( {rowProductsData.product_review} reviews )</span>
                        </div>:''}

                        <div className="stock-text">
                    Availability:  
                    {rowProductsData.product_type === 0 ? (
                      rowProductsData.product_inventory === 1 ? (
                        rowProductsData.product_stock == 0 ? (
                          rowProductsData.product_backorder === 0 || rowProductsData.product_backorder === 1 ? (
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
                    ) : (
                      rowProductsData.product_stock == 0 ? (
                        <span className="outofdtock">Out of Stock</span>
                      ) : (
                        <span className="instock">In Stock</span>
                      )
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
                      {variationDataa.map((valueVariation, indexVariation) => {
                        if (valueVariation.attributes && valueVariation.attributes.attribute_type === 1) {
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
                          valueVariation.attributes && valueVariation.attributes.attribute_type === 2
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
                          valueVariation.attributes && valueVariation.attributes.attribute_type === 3
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
                                      const stringIncluded =
                                        selvararray.includes(
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
                      <button className="quantity-minus d-icon-minus" onClick={handleDecrease}></button>
                      <input type="number" className="quantity" value={quantity} />
                      <button className="quantity-plus d-icon-plus" onClick={handleIncrease}></button>
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
                      {settingData.facebook_url != null ? (
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

                      {settingData.pinterest_url != null ? (
                        <a
                          href={settingData.pinterest_url}
                          className="social-link social-pinterest fab fa-pinterest-p"
                          target="new"
                        >
                          {" "}
                        </a>
                      ) : (
                        ""
                      )}
                    </div>
                    <span className="divider d-lg-show"></span>
                    <div className="product-action">
                    {setSession? 
                        rowProductsData.ufp_id > 0?
                        <a href="javascript:void(0)" className="btn-product btn-wishlist mr-6" onClick={(e)=>addtofav(rowProductsData.product_id)}>
                          <i className="d-icon-heart-full"  id={'wishlisticon'+rowProductsData.product_id}></i>
                          <span>Remove from wishlist</span>
                        </a> :
                        <a href="javascript:void(0)" className="btn-product btn-wishlist mr-6" onClick={(e)=>addtofav(rowProductsData.product_id)}>
                          <i className="d-icon-heart"  id={'wishlisticon'+rowProductsData.product_id}></i>
                          <span>Add to wishlist</span>
                        </a>
                      :
                      <a href="javascript:void(0)" className="btn-product btn-wishlist mr-6" onClick={handleShow}>
                          <i className="d-icon-heart"></i>
                          <span>Add to wishlist</span>
                        </a> 
                    }
                      
                    </div>

                 
                  </div>
                </Col>
              </Row>
            </Container>
        </Modal.Body>
      </Modal>
      {show && <LoginModal showmodal={show} onChildData={handleChildData} />}
    </>
  );
}
export default QuickViewModal;
