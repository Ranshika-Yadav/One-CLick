import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AuthGuard from './components/AuthGuard';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import WorkflowBuilder from './pages/WorkflowBuilder';
import EmployeeProfile from './pages/EmployeeProfile';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={
                <AuthGuard requiredRole="admin">
                  <AdminDashboard />
                </AuthGuard>
              } />
              <Route path="/admin/workflow-builder" element={
                <AuthGuard requiredRole="admin">
                  <WorkflowBuilder />
                </AuthGuard>
              } />
              <Route path="/employee" element={
                <AuthGuard requiredRole="employee">
                  <EmployeeDashboard />
                </AuthGuard>
              } />
              <Route path="/employee/profile" element={
                <AuthGuard requiredRole="employee">
                  <EmployeeProfile />
                </AuthGuard>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;