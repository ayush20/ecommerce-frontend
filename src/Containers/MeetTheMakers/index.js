import React, {useEffect, useRef, useState } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { ApiService } from '../../Components/Services/apiservices'
import constant from "../../Components/Services/constant";


function MeetTheMakers() {

const [makersData,setMakersData ] = useState([])
const [makersImage,setMakersImage ] = useState("")
const [facilityData,setFacilityData ] = useState([])
const [settingData, setSettingData] = useState([]);
const [settingImagePath, setSettingImagePath] = useState("");
const [pageData, setPageData] = useState({});
const [pageContent, setPageContent] = useState("");
const [spinnerLoading, setSpinnerLoading] = useState(true);
const didMountRef = useRef(true)

useEffect(() => {
if(didMountRef.current){
getMeetMakers()
getSettingsData()
const getPageData = {
slug: "meet-the-makers"
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
didMountRef.current = false;
}

})


const getMeetMakers = () => {
ApiService.fetchData("meet-maker-list").then(
(res) => {
if (res.status == "success") {              
setMakersData(res.meetmakersData)
setMakersImage(res.maker_image_path)
setFacilityData(res.facilityData)

}
})}

const getSettingsData = () => {
ApiService.fetchData("settings").then((res) => {
if (res.status == "success") {
setSettingData(res.sitesettings);
setSettingImagePath(res.setting_image_path)

}
});
};
return (
<>

<Header/>

{pageContent != null ? (
<div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
) : (
""
)}
<section className="section-gap-medium">
<div className="container">
<div className="row justify-content-center mb-5">
<div className="col-lg-8">
<div className="section-title text-center mb-5">
{/* <h2 className="tx-theme">Buy One Support One</h2> */}
<img src={settingData.boso_logo != null ? settingImagePath + settingData.boso_logo : 'img/boso1.png'} alt={settingData.logo} className="footer-top-logo"/>
<h6>We’re an exclusive artisans’ & farmers’ marketplace, bringing you home-grown, traditionally made, artisanal & earth-friendly products that inspire a way of conscious living. Every time you buy from heartswithfingers, you’re directly supporting a budding micro-enterprise on its journey towards sustainability. </h6>
<a class="btn btn-white mt-3" href="/who-we-are">LEARN MORE</a>
</div>
</div>
</div>
<div className="row justify-content-center">
<div className="col-lg-10">
<div className="section-title text-center mb-5">
<h2 className="tx-theme" >Meet The Makers</h2>
<h6 style={{ marginBottom: '30px' }}>These are their stories of courage, camaraderie and perseverance.</h6>
<div className="hmaker-section">
{
makersData.map((value,index)=>(  
<div className="hmaker-section-box" style={{ background: `url(${value.maker_image != null ? makersImage +"/"+ value.maker_image : constant.DEFAULT_IMAGE})` ,backgroundSize: 'cover',backgroundPosition: 'center'}}><a className="hmaker-section-box-content" href={`/makers/${value.maker_slug}`}>{value.maker_name}</a></div>
))} 
</div>
</div>
</div>
</div>
</div>
</section>
<section className="section-gap-medium">
<div className="container">
<div className="row justify-content-center mb-5">
<div className="col-lg-8">
<div className="section-title text-center mb-5">
<h2 className="tx-theme">Our Facilities</h2>

<h6>Every Momabatti product is carefully crafted by women artisans in facilities that are proudly owned, run and managed by women themselves.</h6>

<h6>Take a look.</h6>
</div>
</div>
</div>

<div className="row g-3">
{
facilityData.map((value,index)=>( 

<div className="col-lg-4">
<div className="supplybox" style={{backgroundImage: `url(${value.maker_image != null ? makersImage +"/"+ value.maker_image : constant.DEFAULT_IMAGE})`}}>
<div className="supplybox-content">
<h4>{value.maker_name}</h4>

</div>
</div>
</div>
))
}
</div>
</div>
</section>
<section className="section-gap-medium">
<div className="container">
<div className="row justify-content-center mb-5">
<div className="col-lg-8">
<div className="section-title text-center mb-5">
<h2 className="tx-theme">Impact</h2>
<h6>Momabatti embodies the spirit of empowerment and solidarity of thousands of artisans and farmers who are overcoming real struggles everyday to make a dignified living and build a successful business.</h6>
</div>
</div>
</div>
</div>
</section>
<section>
<div className="container">
<div className="row justify-content-center mb-5">
<div className="col-lg-3">
<div className="section-title text-center mb-5">
<h2 className="tx-theme">30,000+</h2>
<h6>Women mobiled<br/>Though SHGs</h6>
</div>
</div>
<div className="col-lg-3">
<div className="section-title text-center mb-5">
<h2 className="tx-theme">9 </h2>
<h6>Food & Textile<br/>Units</h6>
</div>
</div>
<div className="col-lg-3">
<div className="section-title text-center mb-5">
<h2 className="tx-theme">300+</h2>
<h6>Women artisans<br/>employed</h6>
</div>
</div>
<div className="col-lg-3">
<div className="section-title text-center mb-5">
<h2 className="tx-theme">5000+</h2>
<h6>Small farmers </h6>
</div>
</div>
</div>
</div>
</section>
<Footer/>
</>

)
}

export default MeetTheMakers