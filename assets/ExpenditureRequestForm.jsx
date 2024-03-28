
import { Card, Form, Input, Select, Button, message, Upload, DatePicker } from 'antd';
import moment from 'moment';
import { useMyContext } from '../context/context';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;

const ExpenditureRequestForm = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { token: authToken } = useMyContext();
  const [folderName, setFolderName] = useState(null);

  const [fileList, setFileList] = useState([]);
  const [base64File, setBase64File] = useState(null);

  const checkFile = (file) => {
    // Dosya listesi sadece bir dosya içermeli
    if (fileList.length > 0) {
      message.error('Sadece bir dosya yükleyebilirsiniz!');
      return false;
    }
    return true;
  };

  const fileToBase64 = async (file) => {
    try {
      const blobFile = await fileToBlob(file);
  
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blobFile);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      console.error('Dosya dönüştürme hatası:', error);
      throw error;
    }
  };
  const fileToBlob = async (file) => {
    return new Promise((resolve, reject) => {
      try {
        if (!(file instanceof File)) {
          console.error('Dosya türü beklenen "File" türünde değil:', file);
          reject(new Error('Geçersiz dosya türü'));
          return;
        }
  
        const reader = new FileReader();
  
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const blob = new Blob([arrayBuffer], { type: file.type });
          resolve(blob);
        };
  
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleChange = async ({ fileList, file }) => {
    if (fileList.length > 0 && file && file.originFileObj instanceof File) {
      setFileList([file]); // Sadece son eklenen dosyayı sakla
      setFolderName(file.name); // Dosya adını güncelle
      const base64String = await fileToBase64(file.originFileObj);
      setBase64File(base64String);
    } else {
      setFileList([]); // Dosya seçimi iptal edildiğinde fileList'i boş bırak
      setBase64File(null);
    }
  };
  
  const onFinish = async () => {
    try {
      const response = await axios.post(
        apiUrl+"SpendingRequest/createspendingrequestform",
        {
          name: form.getFieldValue("name"),
          price: form.getFieldValue("price"),
          currency: form.getFieldValue("currency"),
          folder: base64File,
          folderName: folderName, // Dosya adını gönder
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      message.success("İzin talebi başarıyla oluşturuldu!");
      navigate('/expenditurerequestresult');
    } catch (error) {
      console.error("API isteği sırasında hata oluştu:", error);
      message.error("Bağlantı Hatası");
    }
  };

  return (
    <>
      <Form 
      form={form}
       onFinish={onFinish} 
       labelCol={{ span: 8 }} 
       wrapperCol={{ span: 16 }} 
       style={{ marginTop: '10%', marginRight: '20%' }}>

        <div>
          <h3>Harcama Talep Formu</h3>
          <br />
          <br />
        </div>

        <Form.Item label="Harcama Türü" name="name" rules={[{ required: true, message: 'Lütfen harcama türünü seçin!' }]}>
          <Input type="text" style={{ marginLeft: '32px' }} />
        </Form.Item>

        <Form.Item label="Fiyat" name="price" rules={[{ required: true, message: 'Lütfen fiyatı girin!' }]}>
          <Input type="number" style={{ marginLeft: '32px' }} />
        </Form.Item>

        <Form.Item label="Para Birimi" name="currency" rules={[{ required: true, message: 'Lütfen para birimini seçin!' }]}>
          <Select style={{ marginLeft: '32px' }}>
            <Option value="₺">₺</Option>
            <Option value="$">$</Option>
            <Option value="€">€</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Dosya Yükle" name="folder">
            <Upload
              beforeUpload={checkFile}
              onChange={handleChange}
              fileList={fileList}
              accept=".pdf, .docx, .xlsx, .pdf, .txt, .jpg, .jpeg, .png"
              style={{ marginLeft: '32px' }}
            >
              <Button icon={<UploadOutlined />} style={{ marginLeft: '32px' }}>
                Yükle
              </Button>
              {fileList.length > 0 && fileList[0].status === 'done' && (
                <span style={{ marginLeft: '8px', color: 'green' }}>Dosya yüklendi!</span>
              )}
              {fileList.length > 0 && fileList[0].status === 'done' && fileList[0].response && fileList[0].response.error && (
                <span style={{ marginLeft: '8px', color: 'red' }}>Dosya yüklenirken bir hata oluştu!</span>
              )}
            </Upload>
          </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Talep Gönder
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ExpenditureRequestForm;







