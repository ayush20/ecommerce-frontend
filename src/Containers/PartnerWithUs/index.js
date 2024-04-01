import React, {useEffect, useRef, useState } from 'react'
import PartnerWithUsHeader from '../../Components/Header/partnerwithusheader';
import Footer from '../../Components/Footer'
import { ApiService } from '../../Components/Services/apiservices'
import constant from "../../Components/Services/constant";
import HomeTopBanner from "../../Components/Elements/home_top_banner";
import { useParams } from "react-router-dom";



function PartnerWithUs() {

  const { slug } = useParams();
  const didMountRef = useRef(true);
  const [pageData, setPageData] = useState({});
  const [pageContent, setPageContent] = useState("");
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  useEffect(() => {
    if (didMountRef.current) {
      const getPageData = {
        slug: "partner-with-us"
      };
      ApiService.postData("page-content", getPageData).then((res) => {
        if (res.status == "success") {
          setPageData(res.data);
          setPageContent(res.data.page_content);
          setSpinnerLoading(false);
        } else {
          setSpinnerLoading(false);
        }
      });
    }
    didMountRef.current = false;
  });
  return (
    <>
    
    <PartnerWithUsHeader/>
    <HomeTopBanner /> 

    {pageContent != null ? (
          <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
        ) : (
          ""
        )}
    {/* <section class="sec-pad">
<div class="container">
<div class="row">
<div class="section-title text-center mt-5 mb-5">
<h2>Partner with Us</h2>
</div>
<div class="col-lg-6">
<div class="mt-3">
<h5><strong>Are you an enterprise striving to make a difference?</strong></h5>
<p>Join us in building an honest, responsible and conscious marketplace with a ‘heart’</p>
<p>Our mission is to trigger a consumer movement that encourages informed, ethical, and sustainable buying decisions. That's why heartswithfingers is building its very own community of women-led enterprises and impact brands striving to build a
better future for women artisans and farmers all over.</p>
</div>
</div>
<div class="col-lg-6">
<img src="http://13.201.27.40/public/img/uploads/media/1696416946.jpg" alt="" class="w-100"/>
</div>
</div>
<div class="value-section mt-5">
<div class="section-title text-center mb-5">
<h2>Our values</h2>
<p>We unveil the full narrative behind every product: the journey of the makers, the revival of ancient crafts and traditions, <br/> the use of eco-friendly materials,
and the adoption of responsible manufacturing practices.</p>
</div>
<div class="bg-grey valueinner">
<div class="row">
<div class="col">
<div class="vborder1"></div>
<span>1</span>
<p>Women Power: Empowering women through every creation.</p>
</div>
<div class="col">
<div class="vborder2"></div>
<span>2</span>
<p>Fair Wages: Ensuring fair compensation for skilled hands and hard work.</p>
</div>
<div class="col">
<div class="vborder3"></div>
<span>3</span>
<p>Ethically sourced: Sourcing high-quality materials at fair prices</p>
</div>
<div class="col">
<div class="vborder4"></div>
<span>4</span>
<p>Handcrafted: Meticulously crafted in small batches with skill, care, and devotion.</p>
</div>
<div class="col">
<div class="vborder5"></div>
<span>5</span>
<p>Eco-friendly: Mindful of our planet, using sustainable practices and materials.</p>
</div>
<div class="col">
<div class="vborder6"></div>
<span>6</span>
<p>Craftsmanship: Reviving age-old tradition and ancient practices</p>
</div>
<div class="col">
<div class="vborder7"></div>
<span>7</span>
<p>Organic: Embracing nature's purity in every fibre and ingredient.</p>
</div>
<div class="col">
<span>8</span>
<p>Honest: Committed to transparency and authenticity in all we do.</p>
</div>
</div>
<div>
</div>
</div>
</div>
<div class="m-auto text-center">
<div class="mt-5 text-center">
<p><strong>Does your project, initiative, social enterprise, or producer group share
these values? If yes, we would love to hear from you!</strong></p>
<p><strong>Write to us at <a href="info@heartswithfingers.com">info@heartswithfingers.com</a> or leave a message below <br/>with your contact information and any relevant links so that we can get back to you.</strong></p>
</div>

</div>
</div>
</section> */}


    <Footer/>
    </>
  
  )
}

export default PartnerWithUs