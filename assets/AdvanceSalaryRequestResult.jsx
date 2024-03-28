import { Button, Space, Table, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { apiUrl } from '../features/apiUrl';
import axios from 'axios';
import { useMyContext } from '../context/context';
import moment from 'moment';
import { useSelector } from 'react-redux';



const AdvanceSalaryRequestResult = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [results, setResults] = useState([]);
  const { token: authToken, claim } = useMyContext();

  useEffect(() => {
        fetchResults();
      }, [results]);
    
      const fetchResults = async () => {
        try {
          const response = await axios.get(apiUrl+"AdvanceRequest/getadvancerequestformbyemployee",
          {
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
    
      const calculateDurationInDays = (startingDate, endingDate) => {
        const start = new Date(startingDate);
        const end = new Date(endingDate);
        const timeDiff = Math.abs(end.getTime() - start.getTime());
        const durationInDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return durationInDays;
      };


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
      title: 'Çalışan Adı',
      dataIndex: 'employeeSurname',
      key: 'employeeSurname',
      render: (text, record) => `${record.employeeName} ${record.employeeSurname}`,
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
      title: 'Türü',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      sortOrder: sortedInfo.columnKey === 'type' ? sortedInfo.order : null,
    },
    {
      title: 'Açıklama',
      dataIndex: 'description',
      key: 'description',
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
      title: 'Durum',
      dataIndex: 'requestApprovalStatusName',
      key: 'requestApprovalStatusName',
      filters:[
        {
          text: 'Bekliyor',
          value: 'Bekliyor',
        },
        {
          text: 'Onay',
          value: 'Onay',
        },
        {
          text: 'Ret',
          value: 'Ret',
        },
        {
          text: 'İptal',
          value: 'İptal',
        },
      ],
      render: (text) => {
        let color, statusText;
        switch (text) {
          case "Onay":
            color = "green";
            statusText = "Onay";
            break;
          case "Ret":
            color = "red";
            statusText = "Ret";
            break;
          case "Bekliyor":
            color = "blue";
            statusText = "Bekliyor";
            break;
          case "İptal":
            color = "yellow";
            statusText = "İptal";
            break;
          default:
            color = "default";
            statusText = "Bilinmiyor";
        }
        return <Tag color={color}>{statusText}</Tag>;
      },
      filteredValue: filteredInfo.requestApprovalStatusName || null,
      onFilter: (value, record) => record.requestApprovalStatusName.includes(value),
      sorter: (a, b) => a.requestApprovalStatusName.localeCompare(b.requestApprovalStatusName),
      sortOrder: sortedInfo.columnKey === 'requestApprovalStatusName' ? sortedInfo.order : null,
      ellipsis: true,
    },
  ];

  const formattedData = results.map((result) => ({
    ...result,
    durationInDays: calculateDurationInDays(result.startingDate, result.endingDate),
  }));

  return (
    <>
      <Space
        style={{
          marginBottom: 16,
          marginTop:'5%'
        }}
      >
          <h3>Avans Talepleri</h3>
        <Button onClick={clearFilters}>Filtreleri Temizle</Button>
        <Button onClick={clearAll}>Filtreleri ve Sıralamaları Temizle</Button>
        <div></div>
      </Space>
      <Table columns={columns} dataSource={formattedData} onChange={handleChange} />
    </>
  );
};
export default AdvanceSalaryRequestResult;





