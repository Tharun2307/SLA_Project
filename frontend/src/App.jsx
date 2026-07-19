import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import UserDashboard from '@/pages/user/UserDashboard';
import RaiseTicket from '@/pages/user/RaiseTicket';
import MyTickets from '@/pages/user/MyTickets';
import EmployeeDashboard from '@/pages/employee/EmployeeDashboard';
import AssignedTickets from '@/pages/employee/AssignedTickets';
import HeadDashboard from '@/pages/head/HeadDashboard';
import UnassignedTickets from '@/pages/head/UnassignedTickets';
import TeamView from '@/pages/head/TeamView';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import DepartmentManagement from '@/pages/admin/DepartmentManagement';
import SettingsPanel from '@/pages/admin/SettingsPanel';
import Leaderboard from '@/components/Leaderboard';
import './index.css';

function RoleRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roleRoutes = {
    USER: '/user',
    EMPLOYEE: '/employee',
    DEPT_HEAD: '/head',
    ADMIN: '/admin',
  };

  return <Navigate to={roleRoutes[user?.role] || '/login'} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Root redirect */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Protected routes with Layout */}
          {/* USER routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['USER']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/user/raise-ticket" element={<RaiseTicket />} />
            <Route path="/user/my-tickets" element={<MyTickets />} />
          </Route>

          {/* EMPLOYEE routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/assigned" element={<AssignedTickets />} />
          </Route>

          {/* DEPT_HEAD routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['DEPT_HEAD']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/head" element={<HeadDashboard />} />
            <Route path="/head/unassigned" element={<UnassignedTickets />} />
            <Route path="/head/team" element={<TeamView />} />
          </Route>

          {/* ADMIN routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/departments" element={<DepartmentManagement />} />
            <Route path="/admin/settings" element={<SettingsPanel />} />
          </Route>

          {/* Shared leaderboard route (any authenticated user) */}
          <Route element={
            <ProtectedRoute allowedRoles={['USER', 'EMPLOYEE', 'DEPT_HEAD', 'ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
