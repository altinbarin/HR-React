

import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, message, InputNumber } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { useMyContext } from '../context/context';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;

const VacationRequestForm = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const [permissionType, setPermissionType] = useState([]);
  const [form] = Form.useForm();
  const { token: authToken } = useMyContext();
  const navigate = useNavigate();

  
// console.log(authToken);


  useEffect(() => {
    const getPermissionType = async () => {
      const response = await axios.get(
        apiUrl+"VocationLeaveRequest/vocationrequestform",
        
        
      );
      setPermissionType(response.data);
      // console.log(response.data);
    };
 
    getPermissionType();
  }, []);


  const postPermission = async () => {
    try {
      const response = await axios.post(
        apiUrl+"VocationLeaveRequest/createvocationrequests",
        
        {
          startingDate: form.getFieldValue("startingDate"),
          vocationLeaveTypeName: form.getFieldValue("vocationLeaveTypeName"),
          day: permissionType.find(item => item.vocationLeaveTypeName === form.getFieldValue("vocationLeaveTypeName")).day, 
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      message.success("İzin talebi başarıyla oluşturuldu!");
      navigate('/vacationrequestresult');
      
    } catch (error) {
      console.error("API isteği sırasında hata oluştu:", error);
      message.error("Lütfen tüm alanları doldurunuz!");

    }
  };
  

  return (
    <>
      <Form
      onFinish={postPermission}
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
       style={{marginTop:'10%', marginRight:'20%'}}
      >
        <div>
        <h3>İzin Talep Formu</h3>
        <br/>
        <br/>
        </div>
        <Form.Item
          label="Başlangıç Tarihi"
          name="startingDate"
          rules={[{ required: true, message: 'Başlangıç tarihi zorunludur!' }]}
        >
          <DatePicker
            disabledDate={(current) => current && (current < moment().startOf('day') || current > moment().add(12, 'months').endOf('day'))}
            format="YYYY-MM-DD"
          />
        </Form.Item>
      


        <Form.Item
          label="İzin Türü"
          name="vocationLeaveTypeName"
          rules={[{ required: true, message: 'İzin türü zorunludur!' }]}
          style={{ marginBottom: '32px' }}
        >
          <Select >
            {permissionType.map((permissionType) => (
              <Option key={permissionType.vocationLeaveTypeName} value={permissionType.vocationLeaveTypeName}>
                {`${permissionType.vocationLeaveTypeName} / gün(${permissionType.day})`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
       


        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            İzin Talebi Oluştur
          </Button>
        </Form.Item>
      </Form>
    </>

  );
};

export default VacationRequestForm;

