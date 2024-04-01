import React, { useEffect, useState, useRef } from "react";
import { ApiService } from "../../Components/Services/apiservices";
  import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Col, Row } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';

function ResetPasswordLink(){
  const Navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("")
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [registerData, setRegisterData] = useState({ cnfpassword: '', password: '' });
    const didMountRef = useRef(true)

    useEffect(() => {
      if (didMountRef.current) {
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const id = urlParams.get('id')
                const dataString ={
                    "id": id
                }
                ApiService.postData('checkresetpasswordurlexpire',dataString).then((res) => {
                  if (res.status === "error") {
                    alert(res.message)
                    Navigate("/")
                  }
                });
                }
      didMountRef.current = false;
  });

    const handleInput = (e) => {
      const key = e.target.name;
      const value = e.target.value;
      setRegisterData({ ...registerData, [key]: value })
  }

  const submitchangepassworf = (e) => {
    e.preventDefault();
    setSpinnerLoading(true);
    if (registerData.password == '' || registerData.cnfpassword == '') {
        setErrorMessage("Pleast Enter The Credentials");
        setSpinnerLoading(false);
        return false;
    } else if (registerData.password != registerData.cnfpassword) {
        setErrorMessage("Password and Confirm Password is incorrect");
        setSpinnerLoading(false);
        return false;
    }
    else {
            setErrorMessage('');
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const id = urlParams.get('id')
            const dataString = {
                "confirm_password": registerData.cnfpassword,
                "password": registerData.password,
                "id": id
            }
            ApiService.postData('changepassword',dataString).then((result) => {
              if(result.status == "success"){
                alert(result.message)
                Navigate("/")
                setSpinnerLoading(false)
            }
            else{
                alert(result.message)
                setSpinnerLoading(false)
            }
            });
            

    }
};

    return(
        <>
        <div className="container mt-5 pt-5">
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-4">
                {errorMessage && (<Alert variant="danger">{errorMessage}</Alert>)}
            {/* {successMessage && (<Alert variant="success">{successMessage}</Alert>)} */}
                <div className="text-center mb-3">
        <h5 className="tx-theme">Reset Password</h5>
        <p className="tx-color-02">
        Please enter your password
        </p>
      </div>
      <div className="form-group mb-3">
        <input
          type="text"
          name="password"
          className="form-control registerRequired"
          value={registerData.password}
        onChange={handleInput}
                  placeholder="New Password"
        />
      </div>
      <div className="form-group mb-3">
        <input
          type="text"
          name="cnfpassword"
          className="form-control registerRequired"
          value={registerData.cnfpassword}
          onChange={handleInput}
          placeholder="Confirm Password"
        />
      </div>
      <div className="d-grid mb-4">
              <Button className="btn-primary btn01" onClick={submitchangepassworf}>Change Password</Button>
            </div> 
                </div>
            </div>
        </div>
        <Container>
        <Row>
       
          <Col lg={6}>

            </Col>
        </Row>
      </Container>
      </>
    )

}
export default ResetPasswordLink
