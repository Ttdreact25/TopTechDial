import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Load Pages for Speed
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Search = lazy(() => import('./pages/Search'));
const BusinessDetails = lazy(() => import('./pages/BusinessDetails'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const SavedItems = lazy(() => import('./pages/SavedItems'));
const Favorites = lazy(() => import('./pages/Favorites'));

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
        <Navbar />
        <Suspense fallback={<div style={{ padding: '100px', color: 'white', textAlign: 'center' }}>⚡ Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/business/:id" element={<BusinessDetails />} />
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute allowedRoles={['user', 'business_owner', 'staff']}>
                <EditProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/saved" 
            element={
              <ProtectedRoute allowedRoles={['user', 'business_owner', 'staff']}>
                <SavedItems />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute allowedRoles={['user', 'business_owner', 'staff']}>
                <Favorites />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Dashboards */}
          <Route 
            path="/dashboard/admin" 
            element={
              <ProtectedRoute allowedRoles={['business_owner', 'staff']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/customer" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
        </Suspense>
      </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
