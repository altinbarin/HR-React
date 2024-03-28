import React, { createContext, useContext, useState, useEffect } from 'react';

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [claim, setClaim] = useState('');
  const [managerDataSummary, setmanagerDataSummary] = useState({});

  useEffect(() => {
    const updateSummaryFromLocalStorage =  () => {
      const updatedSummary =  localStorage.getItem('managerDataSummary');
      setmanagerDataSummary(updatedSummary);
    };
    updateSummaryFromLocalStorage();
  }, []);


  useEffect(() => {
    const updateTokenFromLocalStorage =  () => {
      const updatedToken =  localStorage.getItem('authToken');
      setToken(updatedToken);

    };

    updateTokenFromLocalStorage();
  }, []); 

  useEffect(() => {
    const updateClaimFromLocalStorage =  () => {
      const updatedClaim =  localStorage.getItem('claim');
      setClaim(updatedClaim);
    };

  
  updateClaimFromLocalStorage();
}, []);

  const contextValue = {
    token,
    claim,
    setToken,
    setClaim,
    managerDataSummary, 
    setmanagerDataSummary,
  };

  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};


