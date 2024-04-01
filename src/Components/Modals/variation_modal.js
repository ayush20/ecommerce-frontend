import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../Components/Services/apiservices";
import SpinnerLoader from "../../Components/Elements/spinner_loader";
import constant from "../../Components/Services/constant";
import numeral from "numeral";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import multiCurrency from "../../Components/Elements/multi_currrency";

function VariationModal({ showvariationmodal, productdata = [], onChildData }) {
  const didMountRef = useRef(true);
  const [VariationShow, setVariationShow] = useState(showvariationmodal);
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [arySelectedData, setArySelectedData] = useState([]);
  const [selvararray, setSelvararray] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [variationDataa, setVariationData] = useState([]);
  let mrpValue = 0;
  let sellingPriceValue = 0;
  let discount = 0;
  useEffect(() => {
    if (didMountRef.current) {
      getProductDetails();
    }
    didMountRef.current = false;
  }, []);

  const handleClose = () => {
    setVariationShow(false);
    onChildData(false);
  };

  const getProductDetails = () => {
    const dataString = {
      slug: productdata.product_slug,
    };

    ApiService.postData("product-details", dataString).then((res) => {
      if (res.status === "success") {
        setSelvararray(res.selvararray);
        setVariationData(res.variationData);
        setTimeout(() => {
          mrpValue = parseFloat(res.rowProductData.product_price);
          sellingPriceValue = parseFloat(
            res.rowProductData.product_selling_price
          );
          if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
            discount = ((mrpValue - sellingPriceValue) / mrpValue) * 100;
            setDiscountPercentage(discount);
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
      product_id: productdata.product_id,
    };

    ApiService.postData("variation-wise-price", dataString).then((res) => {
      setSelvararray(selvararray);
      productdata.product_selling_price = res.data.pv_sellingprice;
      productdata.product_price = res.data.pv_price;
      productdata.product_stock = res.data.pv_quantity;
      productdata.product_moq = res.data.pv_moq;
      productdata.product_discount = res.data.pv_discount;
      if (item.variation_images) {
        productdata.product_image =
          item.variation_images.pti_image != null
            ? item.variation_images.pti_image
            : constant.DEFAULT_IMAGE;
      } else {
        productdata.product_image =
          productdata.product_image != null
            ? productdata.product_image
            : constant.DEFAULT_IMAGE;
      }
      mrpValue = parseFloat(res.data.pv_price);
      sellingPriceValue = parseFloat(res.data.pv_sellingprice);
      if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
        discount = ((mrpValue - sellingPriceValue) / mrpValue) * 100;
      }
      setDiscountPercentage(discount);
      //setQuantity(1);
    });
  };
  const addtocart = (addproduct, purchaseType) => {
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
  return (
    <>
      <BrowserView>
        <Modal
          show={VariationShow}
          onHide={handleClose}
          className="right variationModal"
        >
          {spinnerLoading && <SpinnerLoader />}
          <div className="variationModalbox">
            <button onClick={handleClose} className="pop-close">
              <i className="d-icon-times"></i>
            </button>
            <div className="vm-product">
              <figure className="product-media">
                <img
                  src={
                    productdata.product_image != null
                      ? productdata.product_image
                      : constant.DEFAULT_IMAGE
                  }
                  alt={productdata.product_name}
                />
              </figure>
              <div className="product-detail">
                <a href="#" className="product-name">
                  {productdata.product_name}
                </a>
                <div className="product-price">
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
                </div>
                {spinnerLoading === false && (
                  <>
                    {variationDataa.map((valueVariation, indexVariation) => {
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
                                        alt={productdata.product_name}
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
              </div>
            </div>
            <hr className="product-divider mb-3" />
            <div className="product-button">
              <div className="pbqty">
                <button
                  className="quantity-minus d-icon-minus"
                  onClick={handleDecrease}
                ></button>
                <input type="number" className="quantity" value={quantity} />
                <button
                  className="quantity-plus d-icon-plus"
                  onClick={handleIncrease}
                ></button>
              </div>
              <button
                className="btn btn-primary mb-2"
                onClick={(e) => addtocart(productdata, 0)}
              >
                <i className="d-icon-bag me-2"></i>Add To Cart
              </button>
            </div>
          </div>
        </Modal>
      </BrowserView>
      <MobileView>
        <Modal
          show={VariationShow}
          onHide={handleClose}
          className="bottom mvariationModal"
        >
          <div className="mvariationModalbox">
            {spinnerLoading && <SpinnerLoader />}
            <button onClick={handleClose} className="pop-close">
              <i className="d-icon-times"></i>
            </button>
            <div className="mvm-product">
              <figure className="product-media">
                <img
                  src={
                    productdata.product_image != null
                      ? productdata.product_image
                      : constant.DEFAULT_IMAGE
                  }
                  alt={productdata.product_name}
                />
              </figure>
              <div className="product-detail">
                <a href="#" className="product-name">
                  {productdata.product_name}
                </a>
                <div className="product-price">
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
                </div>
                {spinnerLoading === false && (
                  <>
                    {variationDataa.map((valueVariation, indexVariation) => {
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
                                        alt={productdata.product_name}
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
              </div>
            </div>
            <div className="spacer1 mb-3 mt-3"></div>
            <div className="product-button">
              <div className="pbqty">
                <button
                  className="quantity-minus d-icon-minus"
                  onClick={handleDecrease}
                ></button>
                <input type="number" className="quantity" value={quantity} />
                <button
                  className="quantity-plus d-icon-plus"
                  onClick={handleIncrease}
                ></button>
              </div>
              <button
                className="btn btn-primary mb-2"
                onClick={(e) => addtocart(productdata, 0)}
              >
                <i className="d-icon-bag me-2"></i>Add To Cart
              </button>
            </div>
          </div>
        </Modal>
      </MobileView>
    </>
  );
}
export default VariationModal;
