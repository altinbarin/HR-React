import React, { useState, useEffect } from 'react';
import { Table, Space, Button } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Firms = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const [results, setResults] = useState([]);
  const [showInactive, setShowInactive] = useState(false); // Yeni durum
  const [sortedInfo, setSortedInfo] = useState({});


  useEffect(() => {
    fetchResults();
  }, []);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleDelete = async (id, isActive) => {
    try {
      const confirmed = window.confirm('Firmayı silmek istediğinize emin misiniz?');
      if (!confirmed) return;

      const response = await axios.post(
        apiUrl+'Firm/updatefirm',
        {
          id: id,
          isActive: !isActive, 
        }
      );

      // console.log(response.data);
      fetchResults(); 
    } catch (error) {
      console.error('Firma silme hatası:', error);
    }
  };

  const activateFirm = async (id) => {
    try {
      const confirmed = window.confirm('Firmayı aktif hale getirmek istediğinize emin misiniz?');
      if (!confirmed) return;

      const response = await axios.post(
        apiUrl+'Firm/updatefirm',
        {
          id: id,
          isActive: true, // isActive değerini true yap
        }
      );

      console.log(response.data);
      fetchResults(); // Sonuçları yeniden getir
    } catch (error) {
      console.error('Firma aktifleştirme hatası:', error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(apiUrl+"Firm/firms");
      // console.log(response.data); 
      if (Array.isArray(response.data.data)) {
        setResults(response.data.data);
      } else {
        console.error('Fetched data is not an array:', response.data.data);
      }
    } catch (error) {
      console.error('Results fetching error:', error);
    }
  }

  const toggleInactive = () => {
    setShowInactive(!showInactive);
  };

  const clearAll = () => {
    setSortedInfo({});
  };

  const filteredResults = showInactive ? results : results.filter(result => result.isActive);

  const columns = [
        {
          title: '',
          dataIndex: 'logo',
          key: 'logo',
          render: (logo, record) => (
            <img src={`data:image/jpeg;base64,${logo}`} alt="Firma Logo" style={{ width: '50px', height: 'auto' }} />
          ),
        },
        {
            title: 'Firma Adı',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => record.name,
            sorter: (a, b) => a.name.localeCompare(b.name),
          sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
          ellipsis: true,
        },
        {
            title: 'Mersis No',
            dataIndex: 'mersisNo',
            key: 'mersisNo',
        },
        {
            title: 'Vergi No',
            dataIndex: 'vergiNo',
            key: 'vergiNo',
        },
        {
            title: 'Vergi Dairesi',
            dataIndex: 'vergiDairesi',
            key: 'vergiDairesi',
            render: (text, record) => record.vergiDairesi,
            sorter: (a, b) => a.vergiDairesi.localeCompare(b.vergiDairesi),
            sortOrder: sortedInfo.columnKey === 'vergiDairesi' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Telefon Numarası',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
          title: 'Adres',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Çalışan Sayısı',
          dataIndex: 'employeeCount',
          key: 'employeeCount',
          sorter : (a, b) => a.employeeCount - b.employeeCount,
          sortOrder: sortedInfo.columnKey === 'employeeCount' ? sortedInfo.order: null,
          ellipsis: true,
        },
        
        {
          title: 'Sözleşme Başlangıç',
          dataIndex: 'conctractStartDate',
          key: 'conctractStartDate',
          render: (text, record) => new Date(record.conctractStartDate).toLocaleDateString(),
          sorter: (a, b) => new Date(a.conctractStartDate) - new Date(b.conctractStartDate),
          sortOrder: sortedInfo.columnKey === 'conctractStartDate' ? sortedInfo.order : null,
        },
        {
          title: 'Sözleşme Bitiş',
          dataIndex: 'conctractEndDate',
          key: 'conctractEndDate',
          render: (text, record) => new Date(record.conctractEndDate).toLocaleDateString(),
          sorter: (a, b) => new Date(a.conctractEndDate) - new Date(b.conctractEndDate),
          sortOrder: sortedInfo.columnKey === 'conctractEndDate' ? sortedInfo.order : null,
        },
        {
          title: 'İşlem',
          dataIndex: 'isActive',
          key: 'isActive',
          render: (isActive, record) => (
            isActive ? (
              <Button
                type="primary"
                danger
                onClick={() => handleDelete(record.id, isActive)}
              >
                Sil
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => activateFirm(record.id)}
              >
                Aktif Et
              </Button>
            )
          ),
        },
    ];

  return (
    <>
      <Space
        style={{
          marginBottom: 16,
          marginTop:'5%',
        }}
      >
        <h3>Firmalar</h3>
        <Button onClick={toggleInactive}>
          {!showInactive ? 'Aktif Olmayanları Göster' : 'Aktif Olmayanları Gizle'}
        </Button>
        <Button onClick={clearAll}>Sıralamaları Temizle</Button>
      </Space>
      <Table columns={columns} dataSource={filteredResults} pagination={false}  onChange={handleChange}/>
    </>
  );
};
export default Firms;

