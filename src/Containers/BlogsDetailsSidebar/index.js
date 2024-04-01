import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import { useParams } from "react-router-dom";


function BlogsDetailsSidebar() {
  const [blogDetailData, setBlogDetailData] = useState({});
  const [blogCategoryData, setBlogCategoryData] = useState({});
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const { slug } = useParams();
  const didMountRef = useRef(true);
  useEffect(() => {
    if (didMountRef.current) {
      getBlogData();
    }

    didMountRef.current = false;
  });

  const getBlogData = () => {
    const getBlogDetail = {
      blog_slug: slug,
    };
    ApiService.postData("blog-details", getBlogDetail).then((res) => {
      if (res.status == "success") {
        setBlogDetailData(res.data);
        setBlogImageUrl(res.blog_image_path);
        setBlogCategoryData(res.categoryData);

      }
    });
  };
  return (
    <>
    <div>

        <h3>Categories</h3>
        <p>{blogCategoryData.category_name}</p>


       
      </div>
    </>
  )
}
export default BlogsDetailsSidebar