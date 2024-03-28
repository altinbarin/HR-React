

import React, { useState, useEffect } from 'react';
import { Table, message, Select, Space, Button } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';


const VacationResultManager = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    fetchResults();
    getStatus();
  }, []);

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
  const fetchResults = async () => {
    try {
      const response = await axios.get(apiUrl+"VocationLeaveRequest/vocationrequests");
      setResults(response.data);
    } catch (error) {
      console.error('Results fetching error:', error);
    }
  };

  const getStatus = async () => {
    try {
      const response = await axios.get(apiUrl+'RequestApprovalStatus/getstatus');
      setStatus(response.data);
    } catch (error) {
      message.error('Statüler yüklenemedi');
    }
  };

  const fetchStatus = async (value, id) => {
    try {
      const confirmed = window.confirm('Güncellemeyi onaylıyor musunuz?');
      if (!confirmed) return;

      
      const response = await axios.put(
        apiUrl+'VocationLeaveRequest/updateapprovalstatus',
        {
          id: id,
          requestApprovalStatusName: value,
        }
        );
        
        // await message.success('İzin durumu başarıyla güncellendi');
        window.location.reload();
    } catch (error) {
      console.error('İzin durumu güncelleme hatası:', error);
      message.error('İzin durumu güncelleme hatası');
    }
  };

  const dropdownChange = (value, record) => {
    fetchStatus(value, record.id);
  };

  const calculateDurationInDays = (startingDate, endingDate) => {
    const start = new Date(startingDate);
    const end = new Date(endingDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const durationInDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return durationInDays;
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
      title: 'Çalışan Adı',
      dataIndex: 'employeeSurname',
      key: 'employeeSurname',
      render: (text, record) => `${record.employeeName} ${record.employeeSurname}`,
      sorter: (a, b) => a.employeeSurname.localeCompare(b.employeeSurname),
      sortOrder: sortedInfo.columnKey === 'employeeSurname' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'İzin Süresi(Gün)',
      dataIndex: 'durationInDays',
      key: 'durationInDays',
    },
    {
      title: 'Cevaplanma Tarihi',
      dataIndex: 'responseDate',
      key: 'responseDate',
      render: (text, record) => {
        if (!record.responseDate || record.responseDate === "") {
          return "-";
        } else {
          return new Date(record.responseDate).toLocaleDateString();
        }
      },
      sorter: (a, b) => new Date(a.responseDate) - new Date(b.responseDate),
      sortOrder: sortedInfo.columnKey === 'responseDate' ? sortedInfo.order : null,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'Beklemede',
          value: true,
        },
        {
          text: 'Cevaplandı',
          value: false,
        },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => {
        if (value === false) {
          return !record.status || record.status === "";
        } else if (value === true) {
          return record.status && record.status !== "";
        }
      },
      render: (text, record) => (record.status ? 'Beklemede' : 'Cevaplandı'),
    },
    
    {
      title: 'Onay Durumu',
      dataIndex: 'requestApprovalStatusName',
      key: 'requestApprovalStatusName',
      render: (text, record) => (
        <Select defaultValue={record.requestApprovalStatusName} style={{ width: 120 }} onChange={(value) => dropdownChange(value, record)} disabled={record.status===false}>
          {status.map((statusItem) => (
            <Select.Option key={statusItem.id} value={statusItem.name} disabled={statusItem.name === 'Bekliyor'}>
              {statusItem.name}
            </Select.Option>
          ))}
        </Select>
      ),
      
      sorter: (a, b) => a.requestApprovalStatusName.localeCompare(b.requestApprovalStatusName),
      sortOrder: sortedInfo.columnKey === 'requestApprovalStatusName' ? sortedInfo.order : null,
      ellipsis: true,
    },
    
  ];

  const formattedData = results.map((result) => ({
    ...result,
    durationInDays: calculateDurationInDays(result.startingDate, result.endingDate),
    key: result.id,
  }));

  return (
    <>
      <Space
        style={{
          marginBottom: 16,
          marginTop:'5%',
        }}
      >
        <h3>İzin Talepleri</h3>
        <Button onClick={clearFilters}>Filtreleri Temizle</Button>
        <Button onClick={clearAll}>Filtreleri ve Sıralamaları Temizle</Button>
        <div></div>
      </Space>
      <Table columns={columns} dataSource={formattedData} onChange={handleChange} />
    </>
  );
};

export default VacationResultManager;






