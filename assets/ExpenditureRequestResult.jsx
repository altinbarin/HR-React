import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import moment from 'moment';
import axios from 'axios';  // Axios'u ekleyin
import { useMyContext } from '../context/context';
import { useSelector } from 'react-redux';


 
const ExpenditureRequestResult = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const [results, setResults] = useState([]);
  const { token: authToken } = useMyContext();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    // console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
 
  useEffect(() => {
    fetchExpenditureResults();
  }, [results]);
 
  const fetchExpenditureResults = async () => {
    try {
      // Axios'u kullanarak API'den harcama taleplerini çek
      const response = await axios.get(apiUrl+'SpendingRequest/getspendingrequestformbyemployee'
      // const response = await axios.get('https://toall.azurewebsites.net/api/SpendingRequest/spendingrequests');
      ,{
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });




      setResults(response.data);
    } catch (error) {
      // console.error('Results fetching error:', error);
    }
  };
 
 
  const columns = [
    {
      title: 'Talep Tarihi',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (text, record) => new Date(record.requestDate).toLocaleDateString(),
      sorter: (a, b) => new Date(a.requestDate) - new Date(b.requestDate),
      sortOrder: sortedInfo.columnKey === 'requestDate' ? sortedInfo.order : null,
    },
    {
      title: 'Harcama Türü',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,

    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (
        <span>
          {text} {record.currency}
        </span>
      ),
      sorter : (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order: null,
      ellipsis: true,
    },
    {
      title: 'Çalışan Adı',
      dataIndex: 'employeeSurname',
      key: 'employeeSurname',
      render: (text, record) => `${record.employeeName} ${record.employeeSurname}`,
    },
    {
      title: 'Onay Durumu',
      dataIndex: 'requestApprovalStatusName',
      key: 'requestApprovalStatusName',
      render: (text) => {
        let color, statusText;
 
        switch (text) {
          case 'Onay':
            color = 'green';
            statusText = 'Onay';
            break;
          case 'Ret':
            color = 'red';
            statusText = 'Ret';
            break;
          case 'Bekliyor':
            color = 'blue';
            statusText = 'Bekliyor';
            break;
          case 'İptal':
            color = 'yellow';
            statusText = 'İptal';
            break;
          default:
            color = 'default';
            statusText = 'Bilinmiyor';
        }
 
        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    
    {
      title: 'Cevaplanma Tarihi',
      dataIndex: 'responseDate',
      key: 'responseDate',
      render: (text) => (text ? moment(text).format('YYYY/MM/DD') : '-'),
      sorter: (a, b) => new Date(a.responseDate) - new Date(b.responseDate),
      sortOrder: sortedInfo.columnKey === 'responseDate' ? sortedInfo.order : null,
    },
    {
      title: 'Dosya',
      dataIndex: 'folder',
      key: 'folder',
      render: (folder, record) => (
        folder ? (
          <>
            <Button onClick={() => downloadFile(folder, record.folderName)}>{record.folderName} İndir</Button>
          </>
        ) : <span>-</span>
      ),
    },   
  ];
 
  const downloadFile = async (base64String, folderName) => {
    try {
      // Base64 string'i Blob'a dönüştür
      const blob = await fetch(`data:application/pdf;base64,${base64String}`).then((res) => res.blob());

      // Blob'u dosya olarak indir
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = folderName; // Dosyanın adını kullan
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Dosya indirme hatası:', error);
    }
  };
  
  

  return (
    <>
    
    <Space
        style={{
          marginBottom: 16,
          marginTop: '5%',
        }}
      >
        <h3>Harcama Taleplerim</h3>
        <Button onClick={clearFilters}>Filtreleri Temizle</Button>
        <Button onClick={clearAll}>Filtreleri ve Sıralamaları Temizle</Button>
        <div></div>
      </Space>
        <Table dataSource={results} columns={columns} onChange={handleChange} />
    </>
  );
};
 
export default ExpenditureRequestResult;


