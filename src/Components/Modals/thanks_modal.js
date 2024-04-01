import React, { useEffect, useRef, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ApiService } from "../../Components/Services/apiservices";
import { validEmail } from "../../Components/Elements/Regex";
import { useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

function ThanksModal ({ isOpen, closeModal }) {

  const navigate = useNavigate();
    const { slug } = useParams();
    const didMountRef = useRef(true);
    const [settingData, setSettingData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [makersDetail,setMakersDetail ] = useState("")
    const [thankyouDetails, setThankyouDetails] = useState({
      thankyou_name: "",
      thankyou_email: "",
      thankyou_message: "",   
    });

    useEffect(() => {
        if (didMountRef.current) {
          getMakerData();
        }
    
        didMountRef.current = false;
      });

    const thankyouProcess = () => {
        let counter = 0;
        const myElements = document.getElementsByClassName("required");
        for (let i = 0; i < myElements.length; i++) {
          if (myElements[i].value === "") {
            myElements[i].style.border = "1px solid red";
            counter++;
          } else {
            myElements[i].style.border = "";
          }
        }
        if (counter === 0) {
          setErrorMessage("");
          if (!validEmail.test(thankyouDetails.thankyou_email)) {
            setErrorMessage("Please enter valid Email Id");
            return false;
          }

          ApiService.postData("thank-you-process", thankyouDetails).then((res) => {
            if (res.status === "success") {
              setSuccessMessage(res.message);
              resetThankYouForm();
             
              setTimeout(() => {
                setSuccessMessage("");
                window.location.reload()
              }, 4000);
           
            } else {
              setErrorMessage(res.message);
              setTimeout(() => {
                setErrorMessage("");
              }, 3000);
            }
          });
        }
    }


      const onTodoChange = (e) => {
        const { name, value } = e.target;
        setThankyouDetails((prevState) => ({
          ...prevState,
          thankyou_maker_id: makersDetail.maker_id,
          [name]: value,
        }));
      };
      const resetThankYouForm = () => {
        setThankyouDetails({
          thankyou_name: "",
          thankyou_email: "",
          thankyou_message: "", 
        });
    }

      const getMakerData = () => {
        const getMakerDetail = {
          maker_slug: slug,
        };
        ApiService.postData("meet-maker-details", getMakerDetail).then((res) => {
          if (res.status == "success") {
              setMakersDetail(res.data)
          }
        });
      };
  return (
    <Modal show={isOpen} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title className="tx-theme">Send a Heart to {makersDetail.maker_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
              )}
      <div className="row g-3">
      <div className="col-lg-12">
                  <div className="form-group-modal mb-3">
                    <label className='mb-1'>MESSAGE</label>
                    <textarea
                      name="thankyou_message"
                      className="form-control "
                      value={thankyouDetails.thankyou_message}
                      onChange={(e) => onTodoChange(e)}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
      <div className="form-group mb-3">
      <label className='mb-1'>NAME</label>
              <input
                type="text"
                name="thankyou_name"
                className="form-control"
                value={thankyouDetails.thankyou_name}
                onChange={(e) => onTodoChange(e)}
              
              />
            </div>
            </div>
            <div className="col-lg-12">
            <div className="form-group mb-3">
            <label className='mb-1'>EMAIL</label>
              <input
                type="text"
                name="thankyou_email"
                className="form-control "
                value={thankyouDetails.thankyou_email}
                onChange={(e) => onTodoChange(e)}
        
              />
            </div>  
            </div>
            
            <div className="d-grid mb-4">
              <Button className="btn btn-primary-outline btn-medium me-3" onClick={thankyouProcess}>Say Thanks</Button>
            </div>
            </div>
      </Modal.Body>
  
    </Modal>
  );
};

export default ThanksModal;
