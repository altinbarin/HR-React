import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { message } from 'antd';
import { apiUrl } from '../features/apiUrl';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await fetch(`${apiUrl()}Auth/forgotpassword?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
 
      if (response.ok) {
        message.success('Şifre başarıyla gönderildi');
        navigate('/managerlogin');

      } else {
        message.error('Kullanıcı bu e-posta adresi ile bulunamadı');
      }
    } catch (error) {
      console.error('Şifre gönderilirken bir hata oluştu:', error);
      message.error('Şifre gönderilirken bir hata oluştu');
    }
  };
 
  return (
    <MDBContainer>
      <MDBRow className="justify-content-center mt-5">
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody>
              <form onSubmit={handleSubmit}>
                <p className="h4 text-center py-4">Şifre Sıfırlama Formu</p>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="mb-3">
                  <MDBInput
                    label="E-posta Adresi"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <MDBBtn type="submit">Şifreyi Sıfırla</MDBBtn>
                </div>
                <br/>
                <div>
                     <MDBBtn className='w-100 mb-4' size='md' href='/managerlogin'>Giriş Ekranına Git</MDBBtn>
                </div>
               
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
 
export default ForgotPassword;