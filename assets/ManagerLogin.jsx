import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import logo from '../images/TOALL.png';
import { useMyContext } from '../context/context';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

function ManagerLogin() {
  const apiUrl = useSelector((state) => state.apiUrl);
  const { setToken, setClaim } = useMyContext();
  const navigate = useNavigate();

  const updateTokenToLocalStorage = (token) => {
    localStorage.setItem('authToken', token);
    setToken(token);
    // console.log(token);
  };

  const updateClaimToLocalStorage = (claim) => {
    localStorage.setItem('claim', claim);
    setClaim(claim);
    // console.log(claim);
  };

  const onFinish = async () => {
    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // console.log('Giriş yapılıyor:', email, password);

      const response = await fetch(apiUrl + 'Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),      
        mode: 'cors',
      });
      

      if (response.ok) {
        const responseData = await response.json();
        // console.log('responseData:', responseData);

        updateTokenToLocalStorage(responseData.data.token);
        updateClaimToLocalStorage(responseData.data.claim);
        // console.log('Token:', localStorage.getItem('authToken'), 'Claim:', localStorage.getItem('claim'));

        message.success('Giriş başarılı');
        // console.log(responseData.data.claim);

        if(responseData.data.claim === 'empty'){
          navigate('/changepassword');
        } else {
          navigate('/summary');
        }
        
      } 
      else {
        const errorData = await response.json();
        message.error(errorData.ValidationErrors[0].ErrorMessage);
      }
    } catch (error) {
      message.error("Geçersiz parola veya e-posta adresi. Lütfen tekrar deneyin.");
    }
  };

  

  return (
    <MDBContainer fluid className='my-5'>
      <MDBRow className='g-0 align-items-center'>
        <MDBCol col='6'>
          <MDBCard className='my-5 cascading-right' style={{background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)'}}>
            <MDBCardBody className='p-5 shadow-5 text-center'>
              <h2 className="fw-bold mb-5">Giriş Yap</h2>
              <MDBInput wrapperClass='mb-4' label='email' id='email' type='email' name='email'/>
              <MDBInput wrapperClass='mb-4' label='password' id='password' type='password' name='password'/>
              {/* <div className='d-flex justify-content-center mb-4'>
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Beni hatırla' />
              </div> */}
               <div className='d-flex justify-content-between mb-4'>
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Beni hatırla' />
                <a className="login-form-forgot" href="/forgotpassword">Şifremi Unuttum </a>
              </div>
              <MDBBtn className='w-100 mb-4' size='md' onClick={onFinish}>GİRİŞ YAP</MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol col='6'>
          <img src={logo} className="w-100 rounded-4 shadow-4" alt="" />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default ManagerLogin;

