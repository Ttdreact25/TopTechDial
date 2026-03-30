import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [myNotifications, setMyNotifications] = useState([]);

  const fetchPendingCount = async () => {
    if (!user) return;

    try {
      if (user.role === 'business_owner') {
        const { data } = await API.get('/requests/admin');
        const count = data.data.filter(r => r.status === 'pending').length;
        setPendingCount(count);
      } else {
         // Customer notifications: status changed from pending
         const { data } = await API.get('/requests/my-requests');
         // We'll consider Approved/Rejected as NOTIFICATIONS for the user
         const unread = data.data.filter(r => r.status !== 'pending');
         setMyNotifications(unread);
         setPendingCount(unread.length);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchPendingCount();
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedGps = localStorage.getItem('gpsLocation');
        if (savedGps) setGpsLocation(JSON.parse(savedGps));

        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.token) {
            const { data } = await API.get('/auth/me');
            if (data.success) {
               setUser({ ...parsed, ...data.data });
            }
          } else {
            setUser(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load user profile from token', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      // Handle OTP Scenario for Business Owners
      if (data.requiresOtp) {
        return { requiresOtp: true, email: data.email, mockOtp: data.mockOtp };
      }

      // Normal Login (Admin/User)
      const userData = data.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login Debug Error:', error.response?.data);
      throw error.response?.data?.message || JSON.stringify(error.response?.data) || 'Login Failed';
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await API.post('/auth/verify-otp', { email, otp });
      const userData = data.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      throw error.response?.data?.message || 'OTP Verification Failed';
    }
  };

  const registerUser = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      }
      return { success: true };
    } catch (error) {
      throw error.response?.data?.message || 'Registration Failed';
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      return { success: true, message: data.message };
    } catch (error) {
      throw error.response?.data?.message || 'Forgot Password Failed';
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const { data } = await API.post('/auth/reset-password', { email, otp, newPassword });
      return { success: true, message: data.message };
    } catch (error) {
      throw error.response?.data?.message || 'Reset Password Failed';
    }
  };

  const updateAuthUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('gpsLocation');
    setGpsLocation(null);
  };

  const updateGpsLocation = (loc) => {
    setGpsLocation(loc);
    localStorage.setItem('gpsLocation', JSON.stringify(loc));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginUser, 
      verifyOtp, 
      registerUser, 
      logout, 
      forgotPassword, 
      resetPassword, 
      updateAuthUser,
      gpsLocation,
      updateGpsLocation,
      pendingCount,
      fetchPendingCount,
      myNotifications
    }}>
      {children}
    </AuthContext.Provider>
  );
};
