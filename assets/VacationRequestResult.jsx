import { Button, Space, Table, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { apiUrl } from '../features/apiUrl';
import axios from 'axios';
import { useMyContext } from '../context/context';
import { useSelector } from 'react-redux';


const VacationRequestResult = () => {
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
          const response = await axios.get(apiUrl+"VocationLeaveRequest/vocationrequestsbyemployee",
          
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          });
    
          setResults(response.data);
        } catch (error) {
          console.error('Results fetching error:', error);
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
    console.log('Various parameters', pagination, filters, sorter);
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
      title: 'İstek Tarihi',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (text, record) => new Date(record.requestDate).toLocaleDateString(),
      sorter: (a, b) => new Date(a.requestDate) - new Date(b.requestDate),
      sortOrder: sortedInfo.columnKey === 'requestDate' ? sortedInfo.order : null,
    },
    {
      title: 'Başlangıç Tarihi',
      dataIndex: 'startingDate',
      key: 'startingDate',
      render: (text, record) => new Date(record.startingDate).toLocaleDateString(),
      sorter: (a, b) => new Date(a.startingDate) - new Date(b.startingDate),
      sortOrder: sortedInfo.columnKey === 'startingDate' ? sortedInfo.order : null,

    },
    {
      title: 'Bitiş Tarihi',
      dataIndex: 'endingDate',
      key: 'endingDate',
      render: (text, record) => new Date(record.endingDate).toLocaleDateString(),
      sorter: (a, b) => new Date(a.endingDate) - new Date(b.endingDate),
      sortOrder: sortedInfo.columnKey === 'endingDate' ? sortedInfo.order : null,

    },
    {
      title: 'İzin Türü',
      dataIndex: 'vocationLeaveTypeName',
      key: 'vocationLeaveTypeName',
      filters:[
        {
          text: 'Yıllık İzin',
          value: 'Yıllık İzin',
        },
        {
          text: 'Hastalık İzni',
          value: 'Hastalık İzni',
        },
        {
          text: 'Evlilik İzni',
          value: 'Evlilik İzni',
        },
        {
          text: 'Doğum İzni',
          value: 'Doğum İzni',
        },
        {
          text: 'Babalık İzni',
          value: 'Babalık İzni',
        },
        {
          text: 'Ölüm İzni',
          value: 'Ölüm İzni',
        },
        {
          text: 'Ücretsiz İzin',
          value: 'Ücretsiz İzin',
        },
        {
          text: 'Diğer',
          value: 'Diğer',
        },
      ],
      filteredValue: filteredInfo.vocationLeaveTypeName || null,
      onFilter: (value, record) => record.vocationLeaveTypeName.includes(value),
      sorter: (a, b) => a.vocationLeaveTypeName.localeCompare(b.vocationLeaveTypeName),
      sortOrder: sortedInfo.columnKey === 'vocationLeaveTypeName' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'İzin Süresi(Gün)',
      dataIndex: 'durationInDays',
      key: 'durationInDays',
      sorter : (a, b) => a.durationInDays - b.durationInDays,
      sortOrder: sortedInfo.columnKey === 'durationInDays' ? sortedInfo.order: null,
      ellipsis: true,

    },
    {
      title: 'Çalışan Adı',
      dataIndex: 'employeeSurname',
      key: 'employeeSurname',
      render: (text, record) => `${record.employeeName} ${record.employeeSurname}`,
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
          marginTop: '5%'
        }}
        >
        <h3>İzin Taleplerim</h3>
        <Button onClick={clearFilters}>Filtreleri Temizle</Button>
        <Button onClick={clearAll}>Filtreleri ve Sıralamaları Temizle</Button>
        <div></div>
      </Space>
      <Table columns={columns} dataSource={formattedData} onChange={handleChange} />
    </>
  );
};
export default VacationRequestResult;





