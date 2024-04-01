import React, { useEffect, useState, useRef } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BrowserView, MobileView } from "react-device-detect";
import Modal from "react-bootstrap/Modal";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import multiCurrency from "../../Components/Elements/multi_currrency";

function Productlistsidebar({
  sorting = null,
  slug,
  type,
  onFilteredData,
  categoryName,
  categoryImage,
  setscroll = true,
  showmodal,
  HandleCloseModal,
}) {
  const didMountRef = useRef(true);
  const [aryCategoryList, setCategoryList] = useState([]);
  const [resAttributesList, setAttributesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [showFilter, setShowFilter] = useState(showmodal);
  const [selectedTab, setSelectedTab] = useState("tab-0");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [NEWCATID, setNEWCATID] = useState();
  useEffect(() => {
    if (sorting) {
      getfilterproducts(selectedOption, priceRange);
      // handleCheckboxChange('sort',sorting);
    }
  }, [sorting]);
  useEffect(() => {
    setShowFilter(showmodal);
  }, [showmodal]);

  useEffect(() => {
    if (didMountRef.current) { 
      if(type == undefined){
        type = "collection";
      }

      if(slug != null && slug != undefined){
      getcatdata(slug,type);
      }
      getProductListSidebar();
    }
    didMountRef.current = false;
  }, []);
  useEffect(() => {
    // if(slug != null && slug != undefined){
    //   const dataString = {
    //     type: 'category',
    //     cat_slug: slug,
    //   };
    //   ApiService.postData("category-detail", dataString).then((res) => {
    //     if (res.status === "success" && res.hemlet) {
    //         setcategoryvalue(res.hemlet.id);
    //         getfilterproducts(res.hemlet.id, priceRange);
    //     }
    //   });
    // }else{
      if(type == "category"){
        getfilterproducts(selectedOption, priceRange);
        }   

    // getfilterproducts(selectedOption, priceRange);
  }, [selectedCheckboxes]);

  const getcatdata = (slug, type) => {
    if (type == "tag") {
      getProductList(slug);
    } else {
      const dataString = {
        type: type,
        cat_slug: slug,
      };
      ApiService.postData("category-detail", dataString).then((res) => {
        if (res.status === "success" && res.hemlet) {
          if (type === 'category' || type === 'tag') {
            setNEWCATID(res.hemlet.id);
            setcategoryvalue(res.hemlet.id);
          } else {
            setcategoryvalue('');
          }
        }
      });
    }
  };
  const clearFilters = () => {
    setSelectedCheckboxes({});
    handleClose(); 
  };
  const getProductListSidebar = () => {
    ApiService.fetchData("get-product-list-sidebar").then((res) => {
      if (res.status === "success") {
        setAttributesList(res.resAttributesList);
        setCategoryList(res.aryCategoryList);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const getProductList = (slug) => {
    ApiService.fetchData(
      "product-list" +
        "?page=1&_limit=12&slug=" +
        slug +
        "&type=" +type+
        "&sort=" +
        sorting
    ).then((res) => {
      if (res.status === "success") {
        onFilteredData(res.resProductsData.data);
      } else {
        setLoading(false);
      }
    });
  };

  const setcategoryvalue = (value) => {
    if (selectedOption === value) {
      getfilterproducts("", priceRange);
      setSelectedOption(null);
    } else {
      getfilterproducts(value, priceRange);
      setSelectedOption(value);
    }
  };
  const handleCheckboxChange = (checkboxKey, checkboxValue) => {
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      // Multiple selection for checkboxes other than "category"
      const updatedCheckboxes = { ...prevSelectedCheckboxes };
      if (updatedCheckboxes[checkboxKey]) {
        // Check if the checkboxValue already exists
        const existingValues = updatedCheckboxes[checkboxKey];
        if (existingValues.includes(checkboxValue)) {
          // Remove the checkbox value if already selected
          updatedCheckboxes[checkboxKey] = existingValues.filter(
            (id) => id !== checkboxValue
          );
        } else {
          // Add the checkbox value if not selected
          updatedCheckboxes[checkboxKey] = [...existingValues, checkboxValue];
        }
      } else {
        // Checkbox key does not exist, initialize with an array containing the checkbox value
        updatedCheckboxes[checkboxKey] = [checkboxValue];
      }
      return updatedCheckboxes;
    });
  };

  const getfilterproducts = (category = null, range = null) => {
    if (category || selectedCheckboxes) {
      setscroll(false);
    }
    const dataString = {
      filterArray: selectedCheckboxes,
      sort: sorting,
      category: category?category:NEWCATID,
      priceRange: range,
    };
    ApiService.postData("getfilterproductsdata", dataString).then((res) => {
      if (res.status === "success") {
        onFilteredData(res.data);
        //if (category && res.data[0]) {
          categoryName(res.categoryData.cat_name);
          categoryImage(res.categoryData.cat_banner_image);
       // }
      } else {
      }
    });
  };
  const handleClose = () => {
    HandleCloseModal(false);
  };
  const handleTabChange = (id) => {
    setSelectedTab(id);
  };
  return (
    <>
      <BrowserView className="col-lg-3 siderbar-filter">
        <aside>
          <div className="filterbox mb-3">
            <div className="filterbox-title">Category</div>
            <div className="filterbox-body filter-common">
              <div className="filter-list">
                <ul>
                  {loading === true ? (
                    <>
                      {[...Array(8)].map((_, index) => (
                        <li key={index}>
                          <Skeleton variant="text" width={200} />
                        </li>
                      ))}
                    </>
                  ) : (
                    <>
                      {aryCategoryList.length > 0 &&
                        aryCategoryList.map((value) => {
                          if (value.children) {
                            return (
                              <li key={value.cat_id}>
                                <input
                                  type="checkbox"
                                  onChange={(e) =>
                                    setcategoryvalue(value.cat_id)
                                  }
                                  checked={selectedOption === value.cat_id}
                                />
                                <span>{value.cat_name}</span>
                              </li>
                            );
                          } else {
                            return (
                              <li key={value.cat_id}>
                                <input
                                  type="checkbox"
                                  onChange={(e) =>
                                    setcategoryvalue(value.cat_id)
                                  }
                                  checked={selectedOption === value.cat_id}
                                />
                                <span>{value.cat_name}</span>
                              </li>
                            );
                          }
                        })}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="filterbox mb-3">
            <div className="filterbox-title">Filter By Price</div>
            <div className="filterbox-body filter-common">
              <div style={{ margin: "5px" }}>
                <Slider
                  range
                  min={0}
                  max={100000}
                  value={priceRange}
                  onChange={(range) => setPriceRange(range)}
                  onAfterChange={(range) =>
                    getfilterproducts(selectedOption, range)
                  }
                />
              </div>
              <div>
                <p className="mb-0 tx-12">
                  Selected Price Range: {multiCurrency(priceRange[0])} -
                  {multiCurrency(priceRange[1])}
                </p>
              </div>
            </div>
          </div>

          {resAttributesList.length > 0 &&
            resAttributesList.map((value) => (
              <div className="filterbox mb-3">
                <div className="filterbox-title">{value.attribute_name}</div>
                <div className="filterbox-body filter-common">
                  <div className="filter-list">
                    <ul>
                      {value.attributeterms &&
                        value.attributeterms.length > 0 &&
                        value.attributeterms.map((subvalue) => (
                          <li key={subvalue.terms_id}>
                            <input
                              type="checkbox"
                              className="attributecheckbox"
                              onChange={() =>
                                handleCheckboxChange(
                                  value.attribute_name,
                                  subvalue.terms_name
                                )
                              }
                              checked={selectedCheckboxes[
                                value.attribute_name
                              ]?.includes(subvalue.terms_name)}
                            />
                            <span>{subvalue.terms_name}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
        </aside>
      </BrowserView>
      <MobileView>
        <Modal
          show={showFilter}
          onHide={handleClose}
          className="filterModal bottom"
        >
          <div className="filterModal-section">
            <div className="filterModal-header">
              <h6 className="tx-14 mb-0">Filters</h6>
              <a href="#" onClick={clearFilters} className="tx-12 tx-theme">
                CLEAR ALL
              </a>
            </div>
            <div className="filterModal-body">
              <div className="filter_tabs">
                <div className="filter_tab">
                  <input
                    type="radio"
                    id="tab-0"
                    name="tab-group-1"
                    checked={selectedTab === "tab-0"}
                    onChange={() => handleTabChange("tab-0")}
                  />
                  <label for="tab-0">Category</label>
                  <div className="filter_content">
                    <div className="fiter_content_list">
                      <ul>
                        {aryCategoryList.length > 0 &&
                          aryCategoryList.map((value) => (
                            <li
                              key={value.cat_id}
                              onChange={(e) => setcategoryvalue(value.cat_id)}
                            >
                              <span>{value.cat_name}</span>
                              <input
                                type="checkbox"
                                checked={selectedOption === value.cat_id}
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="filter_tab">
                  <input
                    type="radio"
                    id="tab-price"
                    name="tab-group-1"
                    checked={selectedTab === "tab-price"}
                    onChange={() => handleTabChange("tab-price")}
                  />
                  <label for="tab-price">Price</label>
                  <div className="filter_content">
                    <div className="fiter_content_list">
                      <div style={{ margin: "5px" }}>
                        <Slider
                          range
                          min={0}
                          max={1000}
                          value={priceRange}
                          onChange={(range) => setPriceRange(range)}
                          onAfterChange={(range) =>
                            getfilterproducts(selectedOption, range)
                          }
                        />
                      </div>
                      <div>
                      <p className="mb-0 tx-12">
                  Selected Price Range: {multiCurrency(priceRange[0])} -{" "}
                  {multiCurrency(priceRange[1])}
                </p>
                      </div>
                    </div>
                  </div>
                </div>
                {resAttributesList.length > 0 &&
                  resAttributesList.map((value, index) => (
                    <div className="filter_tab">
                      <input
                        type="radio"
                        id={"tab-" + index + 1}
                        name="tab-group-1"
                        checked={selectedTab === "tab-" + (index + 1)}
                        onChange={() => handleTabChange("tab-" + (index + 1))}
                      />
                      <label for={"tab-" + index + 1}>
                        {value.attribute_name}
                      </label>
                      <div className="filter_content">
                        <div className="fiter_content_list">
                          <ul>
                            {value.attributeterms &&
                              value.attributeterms.length > 0 &&
                              value.attributeterms.map((subvalue) => (
                                <li
                                  key={subvalue.terms_id}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      value.attribute_name,
                                      subvalue.terms_name
                                    )
                                  }
                                >
                                  <span>{subvalue.terms_name}</span>
                                  <input
                                    type="checkbox"
                                    checked={selectedCheckboxes[
                                      value.attribute_name
                                    ]?.includes(subvalue.terms_name)}
                                  />
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="filterModal-footer">
              <span className="border-right" onClick={handleClose}>
                CLOSE
              </span>
              <span className="tx-theme" onClick={handleClose}>
                APPLY
              </span>
            </div>
          </div>
        </Modal>
      </MobileView>
    </>
  );
}
export default Productlistsidebar;
