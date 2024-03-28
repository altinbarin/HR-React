
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { useMyContext } from '../context/context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateManagerData = () => {
    const apiUrl = useSelector((state) => state.apiUrl);
    const { token } = useMyContext();
    const [imageData, setImageData] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = async (e) => {
        try {
            const selectedFile = e.target.files[0];

            if (selectedFile) {
                console.log('Dosya seçildi:', selectedFile);
                const base64String = await convertFileToBase64(selectedFile);
                setImageData(base64String);
            }
        } catch (error) {
            console.error('Dosya seçilirken bir hata oluştu:', error);
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };

            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    };

    const handleUpdate = async (values) => {
        try {
            const response = await axios.put(
                apiUrl + `Employee/update`,
                {
                    imageData,
                    address: values.address,
                    phoneNumber: values.phoneNumber,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // console.log('Başarıyla güncellendi:', response.data);
            message.success('Başarıyla güncellendi');
            navigate('/summary');
        } catch (error) {
            message.error(error.response.data.message);
            console.error('Güncelleme sırasında bir hata oluştu:', error);

            if (error.response && error.response.data && error.response.data.errors) {
                console.log('Hata Detayları:', error.response.data.errors);
            }

            if (error.response) {
                console.error('Server tarafından dönen hata:', error.response.data);
                console.error('HTTP status kodu:', error.response.status);
            } else if (error.request) {
                console.error('Cevap alınamadı. Request yapıldı ancak cevap alınamadı.');
            } else {
                console.error('Request yapılırken bir hata oluştu:', error.message);
            }
        }
    };

    return (
        <Form
            name="updateForm"
            onFinish={handleUpdate}
            initialValues={{
                address: '',
                phoneNumber: '',
            }}
            style={{marginTop:'10%', marginLeft:'40%'}}
        >
            <Form.Item
                label="Telefon No:"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Lütfen telefon numarası giriniz!' },
                  { pattern: /^(0\d{10})$/, message: 'Geçerli bir telefon numarası giriniz. (Örneğin: 0XXXXXXXXXX)' },
                ]}
              >
                <Input style={{width:'31%'}}/>
              </Form.Item>

            <Form.Item
                label="Adres"
                name="address"
                rules={[
                    { required: true,
                      message: 'Lütfen adres giriniz!' },
                ]}
                style={{marginLeft:'3%'}}
            >
          <Input.TextArea  style={{width:'30%'}}/>
            </Form.Item>

            <Form.Item 
             style={{marginLeft:'3%'}}
            label="Fotoğraf">
                <input type="file" 
                onChange={handleFileChange} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Güncelle
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateManagerData;

