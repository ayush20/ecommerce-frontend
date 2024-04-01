import React, {useEffect, useRef, useState } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { ApiService } from '../../Components/Services/apiservices'
import { useParams } from "react-router-dom";
import constant from "../../Components/Services/constant";
import ThanksModal from '../../Components/Modals/thanks_modal';
import moment from "moment";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
function Makers() {

    const [makersDetail,setMakersDetail ] = useState("")
    const [makersImage,setMakersImage ] = useState("")
    const [makersContent, setMakersContent] = useState("");
    const { slug } = useParams();
    const didMountRef = useRef(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [thankyouData, setThankyouData] = useState([])
    const openModal = () => {
      setIsModalOpen(true); 
    };
    
    const closeModal = () => {
      setIsModalOpen(false);
    };

    useEffect(() => {
      if (didMountRef.current) {
        getMakerData();
      }
  
      didMountRef.current = false;
    });
  
  
    const getMakerData = () => {
      const getMakerDetail = {
        maker_slug: slug,
      };
      ApiService.postData("meet-maker-details", getMakerDetail).then((res) => {
        if (res.status == "success") {
            setMakersDetail(res.data)
            setMakersImage(res.maker_image_path)
            setMakersContent(res.data.maker_desc);
            setThankyouData(res.thankyouData)
            
            
        }
      });
    };
  
  
  return (
<>
<Header/>

<div className="subheader">
          <Container>
            <Row>
              <Col lg={12}>
                <h1>{makersDetail.maker_name}</h1>
                <Breadcrumb>
                  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>

                  <Breadcrumb.Item active>{makersDetail.maker_name}</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
          </Container>
        </div>
<section className='section-gap-medium'>
  <div className="container">
    <div className="row mb-5">
    <div className="col-lg-6">
    {
       makersDetail.maker_image !=null ? 
<img src={ makersDetail.maker_image != null ? makersImage + "/" + makersDetail.maker_image : constant.DEFAULT_IMAGE } alt={makersDetail.maker_image} className="w-100" style={{ borderRadius: '10px' }} />
                  :"" }

                  <div className='mt-5 text-center'>
                  <h5 className='mb-4'>Did they make your product?</h5>
                  <a href="javascript:void(0)"className="btn btn-primary-outline btn-medium me-3" onClick={openModal}>
  Send a Heart
</a>

                  </div>
      </div>
      
    <div className="col-lg-6">
    <div className="section-title">
    <h2>{makersDetail.maker_name}</h2>
    {makersContent != null ? (
          <div dangerouslySetInnerHTML={{ __html: makersContent }}></div>
        ) : (
          ""
        )}

{thankyouData && thankyouData.length > 0 ? (
              <div>
                <hr/>
                  <h3 className="tx-theme mb-3">PREVIOUS THANK YOUS</h3>
                  {thankyouData.map((value, index) => (
                    <div key={index}>
                      <h6 className="uppercase-text">{value.thankyou_name}</h6>
                      <p>
                        <span>{moment(value.created_at).format('MMM')}</span> {moment(value.created_at).format('DD')}, <span>{moment(value.created_at).format('YYYY')}</span>{" "}
                      </p>
                      <p >{value.thankyou_message}</p>
                    </div>
                  ))}
                </div>
         
            ) : (
              null 
            )}
          </div>
        </div>
      </div>
     


   




    {/* <div className="row mb-5">
    <div className="col-lg-6">
    {
       makersDetail.maker_image !=null ? 
<img src={ makersDetail.maker_image != null ? makersImage + "/" + makersDetail.maker_image : constant.DEFAULT_IMAGE } alt={makersDetail.maker_image} className="w-100"/>
                  :"" }

              
      </div>
      
 

   
    </div> */}
  </div>
</section>

    <Footer/>

    <ThanksModal isOpen={isModalOpen} closeModal={closeModal} />
    </>

  )
}

export default Makers