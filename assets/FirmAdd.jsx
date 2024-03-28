import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Switch, Card, message, Select } from 'antd';
import { MDBCol, MDBRow, MDBContainer } from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
 
const FirmAdd = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const navigate = useNavigate();
  const [componentSize, setComponentSize] = useState('default');
  const [logoData, setLogoData] = useState(null); // Logo verisini tutmak için state
 
  const onlyLettersRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;
  const { Option } = Select;
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
 
  // Logo dosyasını base64 formatına çeviren fonksiyon
  const convertFileToBase64 = async (file) => {
    try {
      const reader = new FileReader();
 
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setLogoData(base64String); // Base64 verisini state'e kaydetme
      };
 
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Dosya dönüştürülürken bir hata oluştu:', error);
    }
  };
 
  // Logo dosyası değiştiğinde tetiklenecek fonksiyon
  const handleLogoFileChange = (e) => {
    const selectedFile = e.target.files[0];
 
    if (selectedFile) {
      convertFileToBase64(selectedFile);
    }
  };
 
  const onFinish = async (values) => {
    // Form verilerini API formatına çevirme
    const apiData = {
        name: values.name,
        title: values.title,
        mersisNo: values.mersisNo,
        vergiNo: values.vergiNo,
        vergiDairesi: values.vergiDairesi,
        logo: logoData, // Logo için gerekli değeri buradan alabilirsiniz
        phoneNumber: values.phoneNumber,
        address: values.address,
        email: values.email,
        employeeCount: values.employeeCount,
        dateOfFoundation: values.dateOfFoundation.format('YYYY-MM-DD'),
        conctractStartDate: values.conctractStartDate.format('YYYY-MM-DD'),
        conctractEndDate: values.conctractEndDate.format('YYYY-MM-DD'),
    };
           
    // API isteği yapma
    try {
      const response = await fetch(apiUrl + 'Firm/addfirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
 
      if (response.ok) {
        message.success('Şirket başarıyla eklendi!');
        navigate('/firms'); 
      } else {
        const result = await response.text();
        message.error(result);
      }
    } catch (error) {
      console.error('API isteği sırasında bir hata oluştu', error);
    }
    // try {
    //     const response = await fetch(apiUrl + 'Firm/addfirm', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(apiData),
    //     });
 
    //     if (response.ok) {
    //       const result = await response.json();
    //       message.success('Kişi başarıyla eklendi!');
    //       // navigate('/managerlogin');
    //     } else {
    //       const result = await response.text();
    //       // console.log(result);
 
    //       message.error(result.split(':')[3].split(',')[0]);
    //     }
    //   } catch (error) {
    //     console.error('API isteği sırasında bir hata oluştu', error);
    //   }
  };
 
  return (
    <MDBContainer className="py-5">
      <Card
        title="Şirket Ekleme Formu"
        bordered
        style={{
          maxWidth: '900px',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={{ size: componentSize }}
          onValuesChange={onFormLayoutChange}
          size={componentSize}
          onFinish={onFinish}
        >
          <MDBRow>
            <MDBCol lg="6">
              <Form.Item
                label="Adı"
                name="name"
                rules={[
                    { required: true, message: 'Lütfen adı giriniz!' },
                    { pattern: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, message: 'Ad sadece harflerden oluşmalıdır.' }
                ]}
              >
                <Input />
              </Form.Item>
 
              <Form.Item
                label="Ünvanı"
                name="title"
                rules={[{ required: true, message: 'Lütfen şirket ünvanını seçiniz!' }]}
              >
                <Select placeholder="Ünvan seçiniz">
                  <Option value="anonim">Anonim</Option>
                  <Option value="limited">Limited</Option>
                  <Option value="şahıs">Şahıs</Option>
                </Select>
              </Form.Item>
               
              <Form.Item
                label="MERSIS No"
                name="mersisNo"
                rules={[
                    { required: true, message: 'Lütfen MERSIS No giriniz!' },
                    { pattern: /^\d{16}$/, message: 'MERSIS No 16 haneli olmalıdır.' }
                ]}
              >
                <Input />
              </Form.Item>
 
              <Form.Item
                label="Vergi No"
                name="vergiNo"
                rules={[
                    { required: true, message: 'Lütfen vergi numarası giriniz!' },
                    { pattern: /^\d{10}$/, message: 'Vergi numarası 10 haneli olmalıdır.' }
                ]}
              >
                <Input />
              </Form.Item>
 
              <Form.Item
                label="Vergi Dairesi"
                name="vergiDairesi"
                rules={[
                    { required: true, message: 'Lütfen vergi dairesi giriniz!' },
                    { pattern: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, message: 'Vergi dairesi sadece harflerden oluşmalıdır.' }
                ]}
              >
                <Input />
              </Form.Item>
 
              <Form.Item
                label="Telefon No:"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Lütfen telefon numarası giriniz!' },
                  { pattern: /^(0\d{10})$/, message: 'Geçerli bir telefon numarası giriniz. (Örneğin: 0XXXXXXXXXX)' },
                ]}
              >
                <Input />
              </Form.Item>
 
              <Form.Item
                label="Adresi"
                name="address"
                rules={[
                  { required: true, message: 'Lütfen adres giriniz!' },
                  { pattern: onlyLettersRegex, message: 'Sadece harflerden oluşmalıdır.' },
                ]}
              >
                <Input />
              </Form.Item>
            </MDBCol>
 
            <MDBCol lg="6">
              <Form.Item
                label="E-posta"
                name="email"
                rules={[
                  { required: true, type: 'email', message: 'Lütfen geçerli bir e-posta adresi giriniz!' },
                ]}
              >
                <Input />
              </Form.Item>
 
              <Form.Item
                label="Çalışan Sayısı"
                name="employeeCount"
                rules={[
                  { required: true, message: 'Lütfen çalışan sayısını giriniz!' },
                  { type: 'number', min: 1, message: 'Çalışan sayısı 0 dan büyük olmalıdır.' },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
 
              <Form.Item
                label="Kuruluş Yılı"
                name="dateOfFoundation"
                rules={[{ required: true, message: 'Lütfen kuruluş yılını giriniz!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
 
              <Form.Item
                label="Sözleşme Başlangıç Tarihi"
                name="conctractStartDate"
                rules={[{ required: true, message: 'Lütfen sözleşme başlangıç tarihini giriniz!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
 
              <Form.Item
                label="Sözleşme Bitiş Tarihi"
                name="conctractEndDate"
                dependencies={['conctractStartDate']}
                rules={[
                  { required: true, message: 'Lütfen sözleşme bitiş tarihini giriniz!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startDate = getFieldValue('conctractStartDate');
                      if (!value || !startDate || value.isBefore(startDate)) {
                        return Promise.reject('Sözleşme bitiş tarihi, sözleşme başlangıç tarihinden sonra olmalıdır.');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
 
              {/* <Form.Item
                label="Aktiflik Durumu"
                name="isActive"
                valuePropName="checked"
                rules={[{ required: true, message: 'Lütfen aktiflik durumunu seçiniz!' }]}
              >
                <Switch />
              </Form.Item> */}
 
              {/* <Form.Item label="Logo" name="logo" valuePropName="fileList">
                <input type="file" onChange={handleLogoFileChange} />
              </Form.Item> */}
              <Form.Item label="Logo" name="logo">
                <input type="file" onChange={handleLogoFileChange} />
              </Form.Item>
            </MDBCol>
          </MDBRow>
 
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <Button type="primary" htmlType="submit">
              Şirketi Ekle
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </MDBContainer>
  );
};
 
export default FirmAdd;
 