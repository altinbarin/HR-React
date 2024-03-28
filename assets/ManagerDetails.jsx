import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBFile,
} from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useMyContext } from '../context/context';
import { useSelector } from 'react-redux';
import { MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';



export default function ProfilePage() {
  const apiUrl = useSelector((state) => state.apiUrl);
  const { token, claim } = useMyContext();
  const [managerDataList, setManagerDataList] = useState([]);
  const [phoneNumberValue, setPhoneNumberValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [imageValue, setImageValue] = useState(null);




  const handleUpdateClick = async () => {
    try {
      if (!address || !phoneNumber) {
        console.error('Adres ve telefon numarası alanları zorunludur.');
        return;
      }
  
      const response = await axios.put(
        apiUrl + `Employee/update`,
        {
          updateDto: {
            imageData:imageValue,
            address,
            phoneNumber,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
  
      console.log('Başarıyla güncellendi:', response.data);
    } catch (error) {
      console.error('Güncelleme sırasında bir hata oluştu:', error);
  
      if (error.response && error.response.data && error.response.data.errors) {
        console.log('Hata Detayları:', error.response.data.errors);
      }
  
      // Hatanın içeriğini göster
      console.error('Hata Detayları:', error);
  
      // Eğer döngüsel bir referans hatası varsa, bu işlem işe yarayabilir
      if (error.message.includes('circular structure')) {
        console.log('Döngüsel referans içeren nesne:', error.config.data);
      }
    }
  };
  
  
  

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('Dosya seçildi:', selectedFile);
    if (selectedFile) {
      fileToBase64(selectedFile).then((result) => {
        setImageValue(result);
        // console.log('image', typeof(result));
      });
    }
  };

  const handleButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        resolve(reader.result);
      };
  
      reader.onerror = reject;
  
      reader.readAsDataURL(file);
    });
  };



  const base64StringConverter = (imageData) => {
    const base64String =`data:image/jpeg;base64,${imageData}` ;
    return base64String;
  };


  useEffect(() => {
    if (managerDataList && managerDataList.imageData) {
      setImageValue(base64StringConverter(managerDataList.imageData));
    }
  }, [managerDataList]);

   







  useEffect(() => {
    if (managerDataList && managerDataList.phoneNumber) {
      setPhoneNumberValue(managerDataList.phoneNumber);
    }
  }, [managerDataList]);

  const handlePhoneNumberChange = (newPhoneNumber) => {
    // phoneNumberValue değerini güncelleyin
    setPhoneNumberValue(newPhoneNumber);
  };

  useEffect(() => {
    if (managerDataList && managerDataList.address) {
      setAddressValue(managerDataList.address);
    }
  }, [managerDataList]);

  const handleAddressChange = (newAddress) => {
    // phoneNumberValue değerini güncelleyin
    setAddressValue(newAddress);
  };



  
   
  // console.log('Token:', token, 'Claim:', claim);



  useEffect(() => {
        if (token) {
          fetchData();
        }
      }, [token]);
      function fetchData() {
        fetch(apiUrl + "Employee/profilim",
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP hatası! Durum: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setManagerDataList(data);
        })
        .catch(error => {
          console.error("Fetch hatası:", error);
        });
      }


      if (managerDataList.length === 0) {
        return <div></div>
      }


  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        

        <MDBRow>
          <MDBCol lg="11" style={{marginLeft:'60px'}} >
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  // src={`data:image/jpeg;base64,${managerDataList.imageData}`}
                  src={imageValue}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '300px' }}
                  fluid />
                  
                  {/* <MDBBtn outline className="ms-0" >Fotoğraf Seç</MDBBtn> */}
                  <input
                      type="file"
                      accept=".jpeg, .jpg, .png"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="fileInput"
                    />
                     


                  <p></p>
                  <p className="text-muted mb-1">{managerDataList.firstName} {managerDataList.lastName}</p>
                <p className="text-muted mb-1">{managerDataList.position}</p>
                <p className="text-muted mb-4">{managerDataList.company}</p>
                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn href='/update'>Güncelle</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>        
          </MDBCol>



          <MDBCol lg="6">
            <MDBCard className="mb-4">
              <MDBCardBody>

              <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Tc Kimlik Numarası</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.turkishIdentificationNumber}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                {managerDataList.middleName === null ? null : 
                (
                  <>
                  <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>İkinci İsim :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.middleName}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                  </>
                )}
                
                {managerDataList.secondLastname === null ? null : 
                (
                  <>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>İkinci Soyisim :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.secondLastname}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                </>
                )}


                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {/* <MDBCardText>{managerDataList.phoneNumber}</MDBCardText> */}
                      <MDBCardText className="text-muted">{managerDataList.phoneNumber}
                      </MDBCardText>

                      {/* {console.log(phoneNumberValue)} */}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Doğum Tarihi :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{(managerDataList.dateOfBirth).split('T')[0]}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>İşe Giriş Tarihi :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{(managerDataList.dateOfEmployment).split('T')[0]}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>İşten Çıkış Tarihi :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{(managerDataList.dateOfDismissal)===null?'Aktif': managerDataList.dateOfDismissal.split('T')[0]}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Doğum Yeri :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.birthLocation}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                
              </MDBCardBody>
            </MDBCard>     
          </MDBCol>


          <MDBCol lg="6">
            <MDBCard className="mb-4">
              <MDBCardBody>
                 <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Şirket :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.company}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Pozisyon :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.position}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Departman :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.department}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Adres :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.address}</MDBCardText>
                    
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Şehir :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.city}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Uzmanlık :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.profession}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Maaş :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{managerDataList.salary}₺</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
              </MDBCardBody>
              </MDBCard>
              </MDBCol>


        </MDBRow>
      </MDBContainer>

      
    </section>
  );
}

