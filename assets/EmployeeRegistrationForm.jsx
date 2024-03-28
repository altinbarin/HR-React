


import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Radio, Switch, Card, message } from 'antd';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MDBCard, MDBCardBody, MDBCol, MDBRow, MDBContainer } from 'mdb-react-ui-kit';



const EmployeeRegistrationForm = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const navigate = useNavigate();
  const [componentSize, setComponentSize] = useState('default');
  const [imageData, setImageData] = useState(null);

  const onlyLettersRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };


  const convertFileToBase64 = async (file) => {
    try {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setImageData(base64String);
        // console.log('image', imageData);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Dosya dönüştürülürken bir hata oluştu:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // console.log('Dosya seçildi:', selectedFile);
      convertFileToBase64(selectedFile);
    }
  };

  const onFinish = async (values) => {
    // Form verilerini API formatına çevirme
    const apiData = {
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
      secondLastName: values.secondLastName,
      turkishIdentificationNumber: values.tcIdentificationNumber,
      emailForRegister: values.emailForRegister,
      dateOfBirth: values.birthDate,
      dateOfEmployment: values.startDate,
      birthLocation: values.birthPlace,
      company: values.company,
      position: values.position,
      department: values.department,
      address: values.address,
      city: values.city,
      phoneNumber: values.phoneNumber,
      profession: values.profession,
      salary: values.salary,
      imageData: imageData,
    };

    // API isteği yapma
    try {
      const response = await fetch(apiUrl + 'Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        const result = await response.json();
        message.success('Kişi başarıyla eklendi!');
        navigate('/summary');
      } else {
        const result = await response.text();
        // console.log(result);

        message.error(result.split(':')[3].split(',')[0]);


        



      }
    } catch (error) {
      console.error('API isteği sırasında bir hata oluştu', error);
    }
  };

  return (
    // <div style={{ marginTop: '64px', display: 'flex', justifyContent: 'center' }}>
    <MDBContainer className="py-5">
     


         <Card
        title="Personel Ekleme Formu"
        bordered
        style={{
          maxWidth: '900px',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          initialValues={{
            size: componentSize,
          }}
          onValuesChange={onFormLayoutChange}
          size={componentSize}
          onFinish={onFinish}
        >
          <MDBRow>
          <MDBCol lg="6"   >


            <Form.Item
            label="Adı"
            name="firstName"
            rules={[
              { required: true, message: 'Lütfen adı giriniz!' },
              {
                pattern: /^[A-Za-zÇçĞğİıÖöŞşÜü]+$/,
                message: 'Adı sadece harflerden oluşmalıdır.',
              },
            ]}
          >

            <Input />
          </Form.Item>

          <Form.Item
            label="İkinci Adı"
            name="middleName"
            rules={[
              {
                pattern: onlyLettersRegex,
                message: 'İkinci ad sadece harflerden oluşmalıdır!',
              },
            ]}
          >
            <Input  />
          </Form.Item>

          <Form.Item
            label="Soyadı"
            name="lastName"
            rules={[
              { required: true, message: 'Lütfen soyadını giriniz!' },
              {
                pattern: onlyLettersRegex,
                message: 'Soyadı sadece harflerden oluşmalıdır.',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="İkinci Soyadı"
            name="secondLastName"
            rules={[
              {
                pattern: onlyLettersRegex,
                message: 'İkinci soyad sadece harflerden oluşmalıdır!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="TCK No:"
            name="tcIdentificationNumber"
            rules={[
              {
                required: true,
                message: 'Lütfen geçerli bir TC numarası giriniz!',
              },
              {
                pattern: /^[0-9]{11}$/,
                message: 'TC numarası 11 haneli olmalı ve sadece sayılardan oluşmalıdır.',
              },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            label="E-Posta"
            name="emailForRegister"
            rules={[
              { required: true, type: 'email', message: 'Lütfen geçerli bir e-posta adresi giriniz!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
              label="Doğum Tarihi"
              name="birthDate"
              rules={[
                { 
                  required: true, 
                  message: 'Lütfen doğum tarihi giriniz!' 
                },
                {
                  validator: (rule, value) => {
                    const currentDate = new Date();
                    const selectedDate = new Date(value);
                    const minDate = new Date();
                    minDate.setFullYear(minDate.getFullYear() - 18); // 18 yaşından büyük tarih hesaplanıyor
                    if (selectedDate >= currentDate || selectedDate >= minDate) {
                      return Promise.reject('Çalışan 18 yaşından büyük olmalıdır. Lütfen doğru bir tarih giriniz.');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>



            <Form.Item
              label="İşe Giriş Tarihi"
              name="dateOfEmployment"
              rules={[
                {
                  required: true,
                  message: 'Lütfen işe giriş tarihini giriniz!',
                },
                {
                  validator: (rule, value) => {
                    const currentDate = new Date();
                    const selectedDate = new Date(value);
                    if (selectedDate > currentDate) {
                      return Promise.reject('İşe giriş tarihi bugünden sonraki bir tarih olamaz.');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>


          <Form.Item
            label="Doğum Yeri"
            name="birthPlace"
            rules={[
              { required: true, message: 'Lütfen doğum yeri giriniz!' },

              {
                pattern: onlyLettersRegex,
                message: 'Sadece harflerden oluşmalıdır.',
              },
            ]}
          >
            <Input  />
          </Form.Item>

          </MDBCol>
     
        
          <MDBCol lg="6"  >


          <Form.Item
            label="Şirket"
            name="company"
            rules={[
              { required: true, message: 'Lütfen şirket adı giriniz!' },

              {
                pattern: onlyLettersRegex,
                message: 'Sadece harflerden oluşmalıdır.',
              },
            ]}
          >
            <Input  />
          </Form.Item>


          <Form.Item
            label="Meslek"
            name="position"
            rules={[
              { required: true, message: 'Lütfen meslek giriniz!' },

              {
                pattern: onlyLettersRegex,
                message: 'Sadece harflerden oluşmalıdır.',
              },
            ]}
          >
            <Input />
          </Form.Item>


            
          <Form.Item
            label="Departman"
            name="department"
            rules={[
              { required: true, message: 'Lütfen departman giriniz!' },
              {
                pattern: onlyLettersRegex,
                message: 'Sadece harflerden oluşmalıdır.',
              },
            ]}
          >
            <Input />
          </Form.Item>


            
          <Form.Item
            label="Adresi"
            name="address"
            rules={[
              { required: true, message: 'Lütfen adres giriniz!' },

              {
                pattern: onlyLettersRegex,
                message: 'Sadece harflerden oluşmalıdır.',
              },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            label="Şehir"
            name="city"
            rules={[
              { required: true, message: 'Lütfen şehir giriniz!' },
              {
                pattern: onlyLettersRegex,
                message: 'Sadece harflerden oluşmalıdır.',
              },
            ]}
          >
            <Input />
          </Form.Item>

          
            
          <Form.Item
            label="Telefon No:"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Lütfen telefon numarası giriniz!' },

              {
                pattern: /^(0\d{10})$/,
                message: 'Geçerli bir telefon numarası giriniz. (Örneğin: 0XXXXXXXXXX)',
              },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            label="Uzmanlık"
            name="profession"
            rules={[
              { required: true, message: 'Lütfen uzmanlık giriniz!' },

              {
                pattern: onlyLettersRegex,
                message: 'Sadece harflerden oluşmalıdır.',
              },
            ]}
          >
            <Input />
          </Form.Item>

          
          <Form.Item
            label="Maaşı"
            name="salary"
            rules={[
              { required: true, message: 'Lütfen maaşınızı sayı olarak giriniz' },

              {
                type: 'number',
                min: 0,
                message: 'Maaş sıfırdan büyük bir sayı olmalıdır.',
              },
            ]}
            
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          
       

         
         <label>
        Fotoğraf:
        <input type="file" onChange={handleFileChange} />
      </label>
      <br></br>
      <br></br>

          
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <Button type="primary" htmlType="submit">
              Kişiyi Ekle
            </Button>
          </Form.Item>

          </MDBCol>

         </MDBRow>
        </Form>
      </Card>
    {/* // </div> */}
    </MDBContainer>

  );
};

export default EmployeeRegistrationForm;




