import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useLocation , useNavigate } from 'react-router-dom';
import Login from './view/Login';
import SingUp from './view/SingUp';
import StudentRegistrationForm from './view/studentRegistation';
import StudentView from './view/studentView';
import Sidebar  from './components/sideBar';
import PrefectManagement from './view/PrefectManagement';
import Competition from './view/competition';
import Teachers from './view/Teachers';
const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  // Extract current page from location
  const currentPage = location.pathname.substring(1) || 'dashboard';
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SingUp />} />
        <Route path="/studentView" element={
          <DashboardLayout>
            <StudentView />
          </DashboardLayout>
        } />
          <Route path="/studentregistation" element={<StudentRegistrationForm />} />
          
            <Route path="/prefectManagement" element={
          <DashboardLayout>
            <PrefectManagement />
          </DashboardLayout>
        } />
         <Route path="/competition" element={
          <DashboardLayout>
            <Competition />
          </DashboardLayout>
        } />
               <Route path="/teachers" element={
          <DashboardLayout>
            <Teachers />
          </DashboardLayout>
        } />
        
        {/* 
        <Route path="/stock" element={<StockManager />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/shop" element={<ShopDetails />} />
        <Route path="/retunpayment" element={<ReturnPayment />} />
        <Route path="/mongo" element={<ChangeMongoCreds />} />
        <Route path="/returnitem" element={<ReturnItemPage />} /> */}
        {/* User Dashboard */}
        {/* <Route
          path="/user-dashboard"
          element={
            <RoleBasedRoute role="user">
              <DashboardUser />
            </RoleBasedRoute>
          }
        /> */}

        {/* Admin Dashboard */}
        {/* <Route
          path="/admin-dashboard"
          element={
            <RoleBasedRoute role="admin">
              <DashboardAdmin />
            </RoleBasedRoute>
          } */}
        {/* /> */}
      </Routes>
    </Router>
  );
}

export default App;
