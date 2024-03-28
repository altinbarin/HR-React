import React, { useState } from 'react';
import { Button, Form, Input, Card, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/context';


const ChangePassword = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const navigate = useNavigate();
  const { token, claim } = useMyContext();
  const [componentSize, setComponentSize] = useState('default');

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinish = async (values) => {
    if (values.password !== values.passwordConfirm) {
      message.error('Şifreler uyuşmuyor');
      return;
    }

    try {
      const response = await fetch(`${apiUrl+'Auth/changepassword'}?newPassword=${encodeURIComponent(values.password)}&claim=${encodeURIComponent(claim)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success('Şifre başarıyla güncellendi');
        navigate('/managerlogin');
      } else {
        message.error('Şifre güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Şifre güncellenirken bir hata oluştu:', error);
      message.error('Şifre güncellenirken bir hata oluştu');
    }
  };

  return (
    <>
      <Card
        title="Şifre Değiştirme Formu"
        bordered
        style={{
          margin: '10% auto',
          marginRight: '5%',
          maxWidth: '100%',
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
          <Form.Item
            label="Yeni Şifre"
            name="password"
            rules={[
              { required: true, message: 'Bu alanı doldurun' },
              { min: 6, message: 'Şifre en az 6 karakter olmalıdır' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Yeni Şifre Onayı"
            name="passwordConfirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Bu alanı doldurun' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Şifreler uyuşmuyor');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <Button type="primary" htmlType="submit">
              Şifreyi Güncelle
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default ChangePassword;




