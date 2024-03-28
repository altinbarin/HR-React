import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage } from 'mdb-react-ui-kit';
import { useMyContext } from '../context/context';
 
const ManagerSummary = () => {
  const apiUrl = useSelector((state) => state.apiUrl);
  const [managerSummary, setManagerSummary] = useState({});
  const { token: authToken,managerDataSummary,setmanagerDataSummary } = useMyContext();
  useEffect(() => {
    fetchData();
  }, []);
 
  const updateSummaryFromLocalStorage = (data) => {
    localStorage.setItem('managerDataSummary', data);
    setmanagerDataSummary(data);
    // console.log(managerDataSummary);
  };
  function fetchData() {
    const apiUrlSummary = apiUrl + "Employee/summary";
 
    fetch(apiUrlSummary, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })
 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setManagerSummary(data);
        updateSummaryFromLocalStorage(data);
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
  }
 
  if (!managerSummary || Object.keys(managerSummary).length === 0) {
    return <div></div>;
  }

  return (
    <MDBContainer className="py-5">
      <MDBRow>
        <MDBCol md="12" lg="6" className="mx-auto">
          <MDBCard className="mb-4">
            <MDBCardBody className="text-center">
              <MDBCardImage
                src={`data:image/jpeg;base64,${managerSummary.imageData}`}
                alt="Manager"
                className="rounded-circle"
                style={{ width: '300px' }}
                fluid />
              <p className="text-muted mb-1">{`${managerSummary.firstname} ${managerSummary.lastname}`}</p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md="12" lg="6" className="mx-auto">
          <MDBCard className="mb-4">
            <MDBCardBody>
              <p><b>Address: </b>{managerSummary.address}</p>
              <p><b>Phone: </b>{managerSummary.phoneNumber}</p>
              <p><b>Email: </b>{managerSummary.email}</p>
              <p><b>Department: </b>{managerSummary.department}</p>
              <p><b>Profession: </b>{managerSummary.profession}</p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
 
export default ManagerSummary;


