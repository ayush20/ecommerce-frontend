import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import LoginModal from "../../Components/Modals/login_modal";
import VariationModal from "../../Components/Modals/variation_modal";
import { BrowserView, MobileView } from "react-device-detect";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/Services/apiservices";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import constant from "../../Components/Services/constant";
import { ToastContainer, toast } from "react-toastify";
import numeral from "numeral";
import Productlistsidebar from "../../Components/Elements/product_list_sidebar";
import MobileHeader from "../../Components/Elements/mobile_header";
import QuickViewModal from "../../Components/Modals/quick_view_modal";
import sessionCartData from "../../Components/Elements/cart_session_data";
import StarRating from "../../Components/Elements/starrating";
import SortModal from "../../Components/Modals/sort_modal";
import FilterModal from "../../Components/Modals/filter_modal";
import Modal from "react-bootstrap/Modal";
import multiCurrency from "../../Components/Elements/multi_currrency";
import { Helmet } from "react-helmet";

function CategoryProduct({onParentData}) {
  const didMountRef = useRef(true);
  const dataArray = sessionCartData();
  const parsedCartSession = dataArray[1];
  const [resProductsData, setProductsData] = useState([]);
  const [cartCount, setCartCount] = useState(parsedCartSession.length);
  const [AttributeData, setAttributeData] = useState([]);
  const [categoriesData, setCategoriesData] = useState({});
  const [categoriesImageUrl, setCategoriesImageUrl] = useState("");
  const [loading, setLoading] = useState();
  const [sorting, setSorting] = useState("");
  const [CatName, setCatName] = useState("");
  const [catImage, setCatImage] = useState("");
  const { slug } = useParams();
  const [setSession, SetSession] = useState(""); 
  const [productData, setProductData] = useState(null);
  const [scroll, setScroll] = useState();
  const [categoryPageData , setCategoryPageData] = useState("")

  const [showSort, setShowSort] = useState(false);
  const handleShowSortModal = () => {
    setShowSort(true);
  };
  const handleChildSortModalData = (status) => {
    setShowSort(status);
  };

  const [showFilter, setShowFilter] = useState(false);
  const handleShowFilterModal = () => {
    setShowFilter(true);
  };
  const handleChildFilterModalData = (status) => {
    setShowFilter(status);
  };
  const [showVariation, setShowVariation] = useState(false);
  const handleShowVariation = (data) => {
    setProductData(data);
    setShowVariation(true);
  };
  const handleChildVariationModalData = (status) => {
    const dataArray = sessionCartData();
    const parsedCartSession = dataArray[1];
    setCartCount(parsedCartSession.length)
    setShowVariation(status);
    // onParentData(status)
  };
  const [showQuick, setShowQuick] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleChildData = (status) => {
    setShow(status);
  };
  const handleShowQuickModal = (data) => {
    setProductData(data);
    setShowQuick(true);
  };
  const handleChildQuickModalData = (status) => {
    setShowQuick(status);
  };
  useEffect(() => {
    setLoading(true);
    if (didMountRef.current) {
      SetSession(localStorage.getItem("USER_TOKEN"));
      getProductList();
      const dataString = {
        cat_slug: slug,
      };
      ApiService.postData("category-detail", dataString).then((res) => {
        if (res.status === "success" ) {
          setCategoryPageData(res.hemlet);
        }
      });
    }
    didMountRef.current = false;
  }, []);

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
 

  const getProductList = () => {
    let pageNumber = Math.ceil(resProductsData.length / 12) + 1;
    const dataString = {
      slug: slug,
    };
    ApiService.fetchData(
      "product-list" +
        "?page=" +
        pageNumber +
        "&_limit=12&slug=" +
        slug +
        "&type=category"
    ).then((res) => {
      if (res.status === "success") {
        setCategoriesData(res.categoriesData);
        setCatImage(res.categoriesData.cat_banner_image);
        setCategoriesImageUrl(res.category_img_url);
        if (res.resProductsData.data.length > 0) {
          const apires = res.resProductsData.data;
          const mergeData = [...resProductsData, ...apires];
          setProductsData(mergeData);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  };

  const handleFilteredData = (data) => {
    setProductsData(data);
  };

  const handleSortingClick = (sortingValue) => {
    setSorting(sortingValue);
  };

  const handlecatName = (data) => {
    setCatName(data);
  };
  const handlecatImage = (categoryData) => {
    setCatImage(categoryData);
  };
  const setscrolldata = (scroll) => {
    setScroll(scroll);
  };

  const handleClosesort = () => {
    setShow(false)
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
        if (Number(addproduct.product_stock )> 0) {
          if (addproduct.product_backorder !== 0) {
            if (existingProductIndex !== -1) {
              if (
                cartSession[existingProductIndex].quantity + 1 <=
                Number(addproduct.product_stock )|| Number(addproduct.product_stock )=== 0
              ) {
                if(Number(addproduct.product_moq) === 0 || cartSession[existingProductIndex].quantity + 1 <=
                  Number(addproduct.product_moq)){
                  cartSession[existingProductIndex].quantity += 1;
                  toast.success("Quantity updated Successfully");
                } else{
                  toast.error("You can add maximum "+addproduct.product_moq+" quantity at a time!");
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
          } else{
            if(Number(addproduct.product_moq) === 0 || cartSession[existingProductIndex].quantity + 1 <=
              Number(addproduct.product_moq)){
              cartSession[existingProductIndex].quantity += 1;
              toast.success("Quantity updated Successfully");
            } else{
              toast.error("You can add maximum "+addproduct.product_moq+" quantity at a time!");
              return false;
            }
          }
        }
      } else {
        if (existingProductIndex !== -1) {
          if(Number(addproduct.product_moq) === 0 || cartSession[existingProductIndex].quantity + 1 <=
            Number(addproduct.product_moq)){
            cartSession[existingProductIndex].quantity += 1;
            toast.success("Quantity updated Successfully");
          } else{
            toast.error("You can add maximum "+addproduct.product_moq+" quantity at a time!");
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
          Number(addproduct.product_stock )|| Number(addproduct.product_stock )=== 0
        ) {
          if(Number(addproduct.product_moq) === 0 || cartSession[existingProductIndex].quantity + 1 <=
            Number(addproduct.product_moq)){
            cartSession[existingProductIndex].quantity += 1;
            toast.success("Quantity updated Successfully");
          } else{
            toast.error("You can add maximum "+addproduct.product_moq+" quantity at a time!");
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
    const dataArray = sessionCartData();
    const parsedCartSession = dataArray[1];
    setCartCount(parsedCartSession.length)
    localStorage.removeItem("COUPON_SESSION");
    //setCartCount(cartSession.length)
  };
  return (
    <>
     <Helmet>
     <title>{categoryPageData.title}</title>
        <meta name="description" itemprop="description" content={categoryPageData.description != null ? categoryPageData.description :"Momabatti"} />
        {categoryPageData.keywords != null ?<meta name="keywords" content={categoryPageData.keywords} />:""}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={categoryPageData.title} />
        <meta name="twitter:url" content={window.location.href} />
             <meta property="og:image" content= {constant.FRONT_URL+categoryPageData.image}/>
        <meta property="og:url" content={window.location.href} />
       <meta property="og:description" content= {categoryPageData.description != null ?categoryPageData.description:"Momabatti"} />
        <meta name="twitter:title" content={categoryPageData.title} />
        <meta name="twitter:description" content={categoryPageData.description != null ?categoryPageData.description:"Momabatti"} />
            <meta property="twitter:image" content= {constant.FRONT_URL+categoryPageData.image}/>
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
        <main>
          <div className="page-content mt-5 mb-5">
            <Container>
              <Row>
                <Productlistsidebar
                  sorting={sorting}
                  slug={slug}
                  type={"category"}
                  onFilteredData={handleFilteredData}
                  categoryName={handlecatName}
                  categoryImage={handlecatImage}
                  setscroll={setscrolldata}
                  showmodal={showFilter}

                />
                <Col lg={9}>
                  <div className="cat-add-banner mb-3">
                    {categoriesData.cat_banner_image != null ? (
                      <img
                        src={categoriesImageUrl + catImage}
                        alt={categoriesData.cat_name}
                        style={{ width: "100%" }}
                      />
                    ) : (
                      <Skeleton width="100%" height={200} />
                    )}
                  </div>
                  <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>
                      {CatName ? CatName : categoriesData.cat_name}
                    </Breadcrumb.Item>
                  </Breadcrumb>
                  <div className="page-title mb-2">
                    <h2 className="mb-0">
                      {CatName ? CatName : categoriesData.cat_name}
                    </h2>
                  </div>
                  <div className="shortby">
                    <div className="productcount">
                      Showing results of {resProductsData.length} products.
                    </div>
                    <div className="shortbydrop">
                      <div className="shortbydrop-inner select">
                        <label>Sort by</label>
                        <select
                          onChange={(e) => handleSortingClick(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="featured">Featured</option>
                          <option value="bestselling">Best selling</option>
                          <option value="alphaasc">Alphabetically, A-Z</option>
                          <option value="alphadesc">Alphabetically, Z-A</option>
                          <option
                            value="asc"
                            selected={sorting === "asc" ? true : false}
                          >
                            Price, low to high
                          </option>
                          <option
                            value="desc"
                            selected={sorting === "desc" ? true : false}
                          >
                            Price, high to low
                          </option>
                          <option value="dateasc">Date, old to new</option>
                          <option value="datedesc">Date, new to old</option>
                        </select>
                      </div>
                    </div>
                    {/* <div className="shortbylist">
                  <ul className="sort-list">
                      <li className="shortby-text">Short by</li>
                      <li className={sorting === 'desc' ? 'active': ''} id="des" onClick={() => handleSortingClick('desc')}>
                        <a href="javascript:void(0)">
                          High to Low
                        </a>
                      </li>
                      <li className={sorting === 'asc' ? 'active': ''} id="asc" onClick={() => handleSortingClick('asc')}>
                        <a href="javascript:void(0)">
                          Low to High
                        </a>
                      </li>
                    </ul>
                  </div> */}
                  </div>
                  <InfiniteScroll
                    dataLength={resProductsData.length}
                    next={scroll == true ? getProductList : ""}
                    hasMore={true}
                    endMessage={<p>No more data to load.</p>}
                    style={{ overflow: "hidden !important" }}
                  >
                    {loading === true ? (
                      <Row>
                        {[...Array(9)].map((_, index) => (
                          <Col lg={4}>
                            <div className="product mb-5" key={index}>
                              <figure className="product-media">
                                <Skeleton
                                  variant="text"
                                  width={280}
                                  height={315}
                                />
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
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <>
                        {resProductsData.length > 0 ? (
                          <Row>
                            {resProductsData.map((value, indexProduct) => {
                              const productPrice = value.product_price;
                              const productSellingPrice =
                                value.product_selling_price;
                              const discount = (
                                ((productPrice - productSellingPrice) /
                                  productPrice) *
                                100
                              ).toFixed(0);
                              return (
                                <Col lg={4} key={indexProduct}>
                                  <div className="product mb-5">
                                    <figure className="product-media">
                                      <a
                                        href={
                                          "/product/" +
                                          value.product_slug
                                        }
                                       
                                      >
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
                                        {value.gallery.length > 0 ? (
                                          <img
                                            src={
                                              value.gallery[0].gallery_image
                                                ? value.gallery[0].gallery_image
                                                : constant.DEFAULT_IMAGE
                                            }
                                            alt={value.product_name}
                                            width="280"
                                            height="315"
                                          />
                                        ) : null}
                                      </a>
                                      {value.product_tag_name != "" ? (
                                        <div className="product-label-group">
                                          {value.product_tag_name
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
                                          value.ufp_id > 0 ? (
                                            <a
                                              href="javascript:void(0)"
                                              className="btn-product-icon btn-wishlist"
                                              title="Add to wishlists"
                                              onClick={(e) =>
                                                addtofav(value.product_id)
                                              }
                                            >
                                              <i
                                                className="d-icon-heart-full"
                                                id={
                                                  "wishlisticon" +
                                                  value.product_id
                                                }
                                              ></i>
                                            </a>
                                          ) : (
                                            <a
                                              href="javascript:void(0)"
                                              className="btn-product-icon btn-wishlist"
                                              title="Add to wishlist"
                                              onClick={(e) =>
                                                addtofav(value.product_id)
                                              }
                                            >
                                              <i
                                                className="d-icon-heart"
                                                id={
                                                  "wishlisticon" +
                                                  value.product_id
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
                                            handleShowQuickModal(value);
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
                                            value.product_slug
                                          }
                                        >
                                          {value.product_name}
                                        </a>
                                      </h3>
                                      <div className="product-price">
                                        <ins className="new-price">
                                        {multiCurrency
                                        (value.product_selling_price)}
                                        </ins>
                                        {discount > 0 ? (
                                          <>
                                            <del className="old-price">
                                            {multiCurrency(value.product_price)}
                                            </del>
                                            <span className="off">
                                              {discount}% Off
                                            </span>
                                          </>
                                        ) : null}
                                      </div>
                                      {value.product_rating &&
                                      value.product_rating > 0 ? (
                                        <div className="ratings-container">
                                          <StarRating
                                            numberOfStars={value.product_rating}
                                          />
                                          <span>
                                            ( {value.product_review} reviews )
                                          </span>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      </div>
                                         <div>
                                {value.product_type === 0 ?
                                <button
                                  className="btn btn-primary-outline btn-small"
                                  onClick={(e) => addtocart(value)}
                                >
                                  Add To Cart
                                </button>
                                :<button
                                className="btn btn-primary-outline btn-small"
                                onClick={() => {
                                  handleShowVariation(value);
                                }}
                              >
                                Add To Cart
                              </button>}
                              </div>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>
                        ) : (
                          <h2>Products Coming Soon.</h2>
                        )}
                      </>
                    )}
                  </InfiniteScroll>
                </Col>
              </Row>
            </Container>
          </div>
        </main>
        <Footer />
      </BrowserView>

      <MobileView>
        <MobileHeader
          PageName={categoriesData.cat_name}
          Route=""
          cartCount={cartCount}
        />
        <main className="main">
          <div className="page-content mt-3 mb-5">
            <Container>
             
              <InfiniteScroll
                dataLength={resProductsData.length}
                next={scroll == true ? getProductList : ""}
                hasMore={true}
                endMessage={<p>No more data to load.</p>}
                style={{ overflow: "hidden !important" }}
              >
                {loading === true ? (
                  <div className="row g-2">
                    {[...Array(9)].map((_, index) => (
                      <div className="col-6" key={index}>
                        <div className="product" key={index}>
                          <figure className="product-media">
                            <Skeleton
                              variant="text"
                              width={"100%"}
                              height={170}
                            />
                          </figure>
                          <div className="product-details">
                          <div className="product-details-inner">
                            <h3 className="product-name">
                              <Skeleton
                                variant="text"
                                width={"100%"}
                                height={10}
                              />
                            </h3>
                            <div className="product-price">
                              <Skeleton variant="text" width={100} height={5} />
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {resProductsData.length > 0 ? (
                      <div className="row g-2">
                        {resProductsData.map((value, indexProduct) => {
                          const productPrice = value.product_price;
                          const productSellingPrice =
                            value.product_selling_price;
                          const discount = (
                            ((productPrice - productSellingPrice) /
                              productPrice) *
                            100
                          ).toFixed(0);
                          return (
                            <div className="col-6" key={indexProduct}>
                              <div className="product">
                                <figure className="product-media">
                                  <a
                                    href={
                                      "/product/" + value.product_slug
                                    }
                                   
                                  >
                                    <img
                                      src={
                                        value.product_image != null
                                          ? value.product_image
                                          : constant.DEFAULT_IMAGE
                                      }
                                      alt={value.product_name}
                                      width="100%"
                                      height="170"
                                    />
                                    {value.gallery.length > 0 ? (
                                      <img
                                        src={
                                          value.gallery[0].gallery_image
                                            ? value.gallery[0].gallery_image
                                            : constant.DEFAULT_IMAGE
                                        }
                                        alt={value.product_name}
                                        width="100%"
                                        height="170"
                                      />
                                    ) : null}
                                  </a>
                                  {value.product_tag_name != "" ? (
                                    <div className="product-label-group">
                                      {value.product_tag_name
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
                                      value.ufp_id > 0 ? (
                                        <a
                                          href="javascript:void(0)"
                                          className="btn-product-icon btn-wishlist"
                                          title="Add to wishlists"
                                          onClick={(e) =>
                                            addtofav(value.product_id)
                                          }
                                        >
                                          <i
                                            className="d-icon-heart-full"
                                            id={
                                              "wishlisticon" + value.product_id
                                            }
                                          ></i>
                                        </a>
                                      ) : (
                                        <a
                                          href="javascript:void(0)"
                                          className="btn-product-icon btn-wishlist"
                                          title="Add to wishlist"
                                          onClick={(e) =>
                                            addtofav(value.product_id)
                                          }
                                        >
                                          <i
                                            className="d-icon-heart"
                                            id={
                                              "wishlisticon" + value.product_id
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
                                        handleShowQuickModal(value);
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
                                        "/product/" + value.product_slug
                                      }
                                    >
                                      {value.product_name}
                                    </a>
                                  </h3>
                                  <div className="product-price">
                                    <ins className="new-price">
                                    {multiCurrency
                                        (value.product_selling_price)}
                                    </ins>
                                    {discount > 0 ? (
                                      <>
                                        <del className="old-price">
                                        {multiCurrency(value.product_price)}
                                        </del>
                                        <span className="off">
                                          {discount}% Off
                                        </span>
                                      </>
                                    ) : null}
                                  </div>
                                  {value.product_rating &&
                                  value.product_rating > 0 ? (
                                    <div className="ratings-container">
                                      <StarRating
                                        numberOfStars={value.product_rating}
                                      />
                                      <span>
                                        ( {value.product_review} reviews )
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  </div>
                                              <div>
                                {value.product_type === 0 ?
                                <button
                                  className="btn btn-primary-outline btn-small"
                                  onClick={(e) => addtocart(value)}
                                >
                                  Add To Cart
                                </button>
                                :<button
                                className="btn btn-primary-outline btn-small"
                                onClick={() => {
                                  handleShowVariation(value);
                                }}
                              >
                                Add To Cart
                              </button>}
                              </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <h2>Products Coming Soon.</h2>
                    )}
                  </>
                )}
              </InfiniteScroll>
            </Container>
            <div className="mfb-section">
              <div className="mfb-section-inner">
                <div
                  className="mfb-box border-right"
                  onClick={handleShowSortModal}
                >
                  <i className="d-icon-arrow-up"></i>
                  <i className="d-icon-arrow-down me-2"></i>Sort By
                </div>
                <div className="mfb-box" onClick={handleShowFilterModal}>
                  <i className="d-icon-filter-2 me-2"></i>Filter
                </div>
              </div>
            </div>
          </div>
        </main>
        <Productlistsidebar
            sorting={sorting}
            slug={slug}
            type={"category"}
            onFilteredData={handleFilteredData}
            categoryName={handlecatName}
            categoryImage={handlecatImage}
            setscroll={setscrolldata}
            showmodal={showFilter}
            HandleCloseModal={handleChildFilterModalData}

          />
      </MobileView>
      {show && <LoginModal showmodal={show} onChildData={handleChildData} />}
      {showQuick && (
        <QuickViewModal
          showmodal={showQuick}
          productdata={productData}
          onChildData={handleChildQuickModalData}
        />
      )}
      {showSort && (
        <Modal show={showSort} onHide={handleClosesort} className="sortModal bottom">
        <div className="sortModalbox">
        <button onClick={handleClosesort} className="pop-close"><i className="d-icon-times"></i></button>
          <ul>
                <li onClick={(e) => { handleSortingClick('featured'); setShowSort(false); }}>
              <span>Featured</span>
              <input type="checkbox" value="featured" checked={sorting=='featured'?true:false}/>
            </li>
            <li onClick={(e) => { handleSortingClick('bestselling'); setShowSort(false); }}>
              <span>Best selling</span>
              <input type="checkbox" value="bestselling" checked={sorting=='bestselling'?true:false}/>
            </li>
            <li onClick={(e) => { handleSortingClick('alphaasc'); setShowSort(false); }}>
              <span>Alphabetically, A-Z</span>
              <input type="checkbox" value="alphaasc" checked={sorting=='alphaasc'?true:false}/>
            </li>
            <li onClick={(e) => { handleSortingClick('alphadesc'); setShowSort(false); }}>
              <span>Alphabetically, Z-A</span>
              <input type="checkbox" value="alphadesc" checked={sorting=='alphadesc'?true:false}/>
            </li>
            <li onClick={(e) => { handleSortingClick('asc'); setShowSort(false);}}>
              <span>Price, low to high</span>
              <input type="checkbox" value="asc" checked={sorting=='asc'?true:false}/>
            </li>
            <li onClick={(e) => { handleSortingClick('desc'); setShowSort(false); }}>
              <span>Price, high to low</span>
              <input type="checkbox" value="desc" checked={sorting=='desc'?true:false}/>
            </li>
            <li onClick={(e) => { handleSortingClick('dateasc'); setShowSort(false); }}>
              <span>Date, old to new</span>
              <input type="checkbox" value="dateasc" checked={sorting=='dateasc'?true:false}/>
            </li>
            <li onClick={(e) => { handleSortingClick('datedesc'); setShowSort(false); }}>
              <span>Date, new to old</span>
              <input type="checkbox" value="datedesc" checked={sorting=='datedesc'?true:false}/>
            </li>
            </ul>
        </div>
      </Modal>

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
export default CategoryProduct;
