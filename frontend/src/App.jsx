import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { DashboardLayout } from './components/DashboardLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { HotelsListing } from './pages/HotelsListing';
import { AdminDashboard } from './pages/admin/Dashboard';
import { HotelsAdmin } from './pages/admin/Hotels';
import { ReservationsAdmin } from './pages/admin/Reservations';
import { ClientsAdmin } from './pages/admin/Clients';
import { AdminCalendar } from './pages/admin/Calendar';
import { ClientHotels } from './pages/client/Hotels';
import { ClientReservations } from './pages/client/Reservations';
import { ClientDashboard } from './pages/client/Dashboard';
import { Notifications } from './components/Notifications';

function ProtectedRoute({ children, requiredRole }) {
  const { user, token } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" />;
  return children;
}

function App() {
  const { fetchCurrentUser } = useAuthStore();
  useEffect(() => { fetchCurrentUser(); }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelsListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/hotels" element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout><HotelsAdmin /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/reservations" element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout><ReservationsAdmin /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/clients" element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout><ClientsAdmin /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/calendar" element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout><AdminCalendar /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Client */}
        <Route path="/client" element={
          <ProtectedRoute requiredRole="client">
            <DashboardLayout><ClientDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/client/hotels" element={
          <ProtectedRoute requiredRole="client">
            <DashboardLayout><ClientHotels /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/client/reservations" element={
          <ProtectedRoute requiredRole="client">
            <DashboardLayout><ClientReservations /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <DashboardLayout><Notifications /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;