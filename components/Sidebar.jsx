

import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { AppstoreOutlined, SettingOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useMyContext } from '../context/context';



const { SubMenu } = Menu;

function getItem(label, key, icon, route, children, type) {
  return {
    key,
    icon,
    route,
    children,
    label,
    type,
  };
}


const items = [
  getItem('Panel', 'sub1', <FolderOpenOutlined />, null, [
    // getItem('Ana Sayfa', '1', null, '/', null),
    getItem('Ana Sayfa', '2', null, '/summary', null),
    getItem('Detay Sayfası', '3', null, '/detail', null),
    getItem('Güncelleme Sayfası', '4', null, '/update', null),
  ]),
  getItem('Taleplerim', 'sub2', <SettingOutlined />, null, [
    getItem('İzin Taleplerim', '7', null, '/vacationrequestresult', null),
    getItem('Harcama Taleplerim', '9', null, '/expenditurerequestresult', null),
    getItem('Avans Taleplerim', '11', null, '/advancesalaryrequestresult', null),
  ]),
  getItem('Talep Oluştur', 'sub5', <SettingOutlined />, null, [
    getItem('İzin Talep Formu', '6', null, '/vacationrequestform', null),
    getItem('Harcama Talep Formu', '8', null, '/expenditurerequestform', null),
    getItem('Avans Talep Formu', '10', null, '/advancesalaryrequestform', null),
  ]),
  getItem('Admin İşlemleri', 'sub3', <SettingOutlined />, null, [
    getItem('Personel Ekleme', '5', null, '/employeeregistrationform', null),
    // getItem('Personel Listesi', '17', null, '/employeelist', null),
    getItem('İzin Talep Cevabı', '12', null, '/vacationresultmanager', null),
    getItem('Harcama Talep Cevabı', '13', null, '/expenditurerequestmanager', null),
    getItem('Avans Talep Cevabı', '14', null, '/advanceresultmanager', null),
  ]),
  getItem('Manager İşlemleri', 'sub6', <SettingOutlined />, null, [
    getItem('Firmalar', '15', null, '/firms', null),
    getItem('Firma Ekle', '16', null, '/addfirm', null),
  ]),
    
];

const Sidebar = () => {
  const [current, setCurrent] = useState('1');
  const { token: authToken, claim } = useMyContext();
  const navigate = useNavigate();
  useEffect(() => {
    // Yetki yoksa anasayfaya yönlendir
    const redirectToLogin = () => {
      // '/login' yolunu, gerçek giriş sayfanızın yoluyla değiştirmelisiniz
      navigate('/managerlogin');
    };
  
    if (!claim) {
      redirectToLogin();
    }
  }, [claim]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
   <div>
    
          {claim === '' || claim === null || claim === undefined ? (
           <div>
             {/* <h1>Hoşgeldiniz</h1> */}
            </div>
             ) : (
    

    
      <Menu
        theme="dark"
        onClick={onClick}
        style={{
          width: 256,
          position: 'fixed',
          top: '64px',
          left: 0,
          height: 'calc(100% - 64px)',
        }}
        mode="inline"
      >
        {items.map((item) => {
          if (item.children) {
            const subMenuItems = item.children.filter((child) => {
              return (
                (claim === 'admin' && (item.key === 'sub1' || item.key === 'sub3')) ||
                (claim === 'user' && (item.key === 'sub1' || item.key === 'sub2' || item.key === 'sub5')) ||
                (claim === 'manager' && (item.key === 'sub6' || item.key === 'sub1')) ||
                ((claim === '' || claim === null || claim === undefined) && item.key === 'sub4')
              );
            });

            if (subMenuItems.length > 0) {
              return (
                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {subMenuItems.map((child) => (
                    <Menu.Item key={child.key}>
                      <Link to={child.route}>{child.label}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            }
          } else {
            return (
              (claim === 'admin' && (item.key === 'sub3' || item.key === 'sub1')) ||
              (claim === 'user' && (item.key === 'sub2' || item.key === 'sub1' || item.key === 'sub5')) ||
              (claim === 'manager' && (item.key === 'sub6' || item.key === 'sub1')) ||
              ((claim === '' || claim === null || claim === undefined) && item.key === 'sub4')
            ) ? (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.route ? (
                  <Link to={item.route}>{item.label}</Link>
                ) : (
                  item.label
                )}
              </Menu.Item>
            ) : null;
          }

          return null;
        })}
      </Menu>


       )
      }
    </div>
  );
};

export default Sidebar;


