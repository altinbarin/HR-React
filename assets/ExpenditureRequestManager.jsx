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
      const response = await axios.get(apiUrl+"SpendingRequest/spendingrequests");
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
      // Simulate confirm dialog using alert
      const confirmed = window.confirm('Güncellemeyi onaylıyor musunuz?');
      if (!confirmed) return;

      const response = await axios.put(
        apiUrl+'SpendingRequest/updateapprovalstatus',
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
      title: 'Gider Türü',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tutar',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => `${record.price} ${record.currency}`,
      sorter : (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order: null,
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
      title: 'Dosya',
      dataIndex: 'folder',
      key: 'folder',
      render: (folder, record) => (
        folder ? (
          <>
            <Button onClick={() => downloadFile(folder, record.folderName)}>Dokümanı İndir</Button>
          </>
        ) : <span>-</span>
      ),
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
        <h3>Harcama Talepleri</h3>
        <Button onClick={clearFilters}>Filtreleri Temizle</Button>
        <Button onClick={clearAll}>Filtreleri ve Sıralamaları Temizle</Button>
        <div></div>
      </Space>
      <Table columns={columns} dataSource={formattedData} onChange={handleChange} />
    </>
  );
};

export default VacationResultManager;

