import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { useMyContext } from '../context/context';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;
 
const AdvanceSalaryRequestForm = () => {
  const [form] = Form.useForm();
  const { token: authToken } = useMyContext();
  const apiUrl = useSelector((state) => state.apiUrl);
  const navigate = useNavigate();

 
  const onFinish = async () => {
    try {
      const response = await axios.post(
        apiUrl+"AdvanceRequest/createadvancerequestform",
       
        {
          price: form.getFieldValue("price"),
          currency: form.getFieldValue("currency"),
          description: form.getFieldValue("description"),
          type: form.getFieldValue("type"),     
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      message.success("İzin talebi başarıyla oluşturuldu!");
      navigate('/advancesalaryrequestresult');
    } catch (error) {
      console.error("API isteği sırasında hata oluştu:", error);
      message.error("Lütfen tüm alanları doldurunuz!");

    }
  };
  
 
  return (
    <>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{marginTop:'10%', marginRight:'20%'}}>

          <div>
        <h3>Avans Talep Formu</h3>
        <br/>
        <br/>
        </div>



        <Form.Item 
        label="Tutar" 
        name="price" 
        rules={[{ required: true, message: 'Lütfen tutarı girin!' }]}>
          <Input type="number" min="0" />
        </Form.Item>
 
        <Form.Item label="Para Birimi" name="currency" rules={[{ required: true, message: 'Lütfen para birimini seçin!' }]}>
          <Select >
            <Option value="₺">₺</Option>
            <Option value="$">$</Option>
            <Option value="€">€</Option>
          </Select>
        </Form.Item>    

        <Form.Item label="Avans Tipi" name="type" rules={[{ required: true, message: 'Lütfen türü seçin!' }]}>
        <Input  />
        </Form.Item>

        <Form.Item label="Açıklama" name="description" rules={[{ required: true, message: 'Lütfen açıklamayı girin!' }]}>
          <Input.TextArea  />
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
 
export default AdvanceSalaryRequestForm;