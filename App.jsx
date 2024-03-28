import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Navbar from "./components/Header";
import ManagerDetails from "./assets/ManagerDetails";
import ManagerSummary from "./assets/ManagerSummary";
import ManagerLogin from "./assets/ManagerLogin";
import EmployeeRegistrationForm from "./assets/EmployeeRegistrationForm";
import { MyContextProvider } from "./context/context";
import UpdateManagerData from "./assets/UpdateManagerData";
import VacationRequestForm from "./assets/VacationRequestForm";
import VacationRequestResult from "./assets/VacationRequestResult";
import ExpenditureRequestForm from "./assets/ExpenditureRequestForm";
import VacationResultManager from "./assets/VacationResultManager";
import ExpenditureRequestManager from "./assets/ExpenditureRequestManager";
import ExpenditureRequestResult from "./assets/ExpenditureRequestResult";
import AdvanceSalaryRequestForm from "./assets/AdvanceSalaryRequestForm";
import AdvanceResultManager from "./assets/AdvanceResultManager";
import AdvanceSalaryRequestResult from "./assets/AdvanceSalaryRequestResult";
import NotFound from "./pages/NotFound404";
import Sidebar from "./components/Sidebar";
import { useMyContext } from "./context/context";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { Layout, Menu, Switch } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import Firm from "./assets/Firms";
import FirmAdd from "./assets/FirmAdd";
import ChangePassword from "./assets/ChangePassword";
import ForgotPassword from "./assets/ForgotPassword";
// import Employee from "./assets/Employee";
// import { Content } from 'antd/es/layout/layout';
// import Sider from 'antd/es/layout/Sider';

const { Header, Content, Footer, Sider } = Layout;
function App() {
  const { token: authToken, claim } = useMyContext();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (claim) {
      setIsAuthenticated(true);
    }
    else{
      setIsAuthenticated(false);
    }
  }, [claim]);

  const getClaim = () =>{
    
    if (claim === "manager") 
    {
      return(
        <>
         <Route
          path="/addfirm"
          element={<FirmAdd/>}
        
        />
      <Route 
      path="/firms"
      element={<Firm/>}
      />
      </>
      )
    } 
    else if (claim === "admin") {
      return (
        <>
          <Route
            path="/vacationresultmanager"
            element={<VacationResultManager />}
          />
          <Route
            path="/expenditurerequestmanager"
            element={<ExpenditureRequestManager />}
          />
          <Route
            path="/employeeregistrationform"
            element={<EmployeeRegistrationForm />}
          />
          <Route
            path="/advanceresultmanager"
            element={<AdvanceResultManager />}
          />
          {/* <Route
          path="/employeelist"
          element={<Employee/>}
          /> */}
        </>
      );
    } else if (claim === "user") {
      return (
        <>
          <Route
            path="/vacationrequestform"
            element={<VacationRequestForm />}
          />
          <Route
            path="/vacationrequestresult"
            element={<VacationRequestResult />}
          />
          <Route
            path="/expenditurerequestform"
            element={<ExpenditureRequestForm />}
          />
          <Route
            path="/vacationrequestresult"
            element={<VacationRequestResult />}
          />
          <Route
            path="/advancesalaryrequestform"
            element={<AdvanceSalaryRequestForm />}
          />
          <Route
            path="/advancesalaryrequestresult"
            element={<AdvanceSalaryRequestResult />}
          />
          <Route
            path="/expenditurerequestresult"
            element={<ExpenditureRequestResult />}
          />
        </>
      );
    } 
    else if (claim === "empty") {
      return (
          <>
          <Route path="changepassword" element={<ChangePassword/>}/>
          </>
      );}
    else {
      return (
        <>
          <Route path="/" element={<ManagerLogin />} />
          <Route path="/managerlogin" element={<ManagerLogin />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </>
      );
    }
  }

  return (
    <>
      {isAuthenticated ? (
        <Layout>
        <Sider  style={{marginRight:'6%'}}>
          <Sidebar/>
        </Sider>

        <Layout>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="demo-logo" />
            <Navbar />
          </Header>

          <Content>
            <Routes>
              {getClaim()}
              <Route path="*" element={<NotFound />} />
              <Route path="/managerlogin" element={<ManagerLogin />} />
              <Route path="/" element={<ManagerLogin />} />
              <Route path="/detail" element={<ManagerDetails />} />
              <Route path="/summary" element={<ManagerSummary />} />
              <Route path="/update" element={<UpdateManagerData />} />
              
            </Routes>
          </Content>
        </Layout>
      </Layout>
      ) : (
        <Routes>
          <Route path="/managerlogin" element={<ManagerLogin />} />
          <Route path="/" element={<ManagerLogin />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      )}
    </>
     
  );
}

export default App;


