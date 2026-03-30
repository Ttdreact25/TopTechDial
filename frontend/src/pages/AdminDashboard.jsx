import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Briefcase, FileText, Settings, Users, Search, MessageSquare 
} from 'lucide-react';

// Sub-components for better maintainability and code structure
import AdminOverview from '../components/admin/AdminOverview';
import AdminListings from '../components/admin/AdminListings';
import AdminUsers from '../components/admin/AdminUsers';
import AdminCategories from '../components/admin/AdminCategories';
import AdminSearchAnalytics from '../components/admin/AdminSearchAnalytics';
import AdminRequests from '../components/admin/AdminRequests';
import AdminStaff from '../components/admin/AdminStaff';
import AdminSettings from '../components/admin/AdminSettings';
import BusinessModal from '../components/admin/BusinessModal';
import StaffModal from '../components/admin/StaffModal';

const AdminDashboard = () => {
  const { user, fetchPendingCount, updateAuthUser } = useContext(AuthContext);

  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Restaurant', 
    street: '', city: '', state: '', zip: '',
    phone: '', email: '', website: '', whatsapp: '',
    openTime: '09:00', closeTime: '21:00'
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [searchLogs, setSearchLogs] = useState([]);
  const [selectedLogGroup, setSelectedLogGroup] = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', password: '' });
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, phone: user.phone });
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const apiCalls = [
        API.get('/businesses/all-listings'),
        API.get('/categories')
      ];

      if (user?.role === 'business_owner') {
        apiCalls.push(API.get('/users'));
        apiCalls.push(API.get('/search-logs'));
        fetchRequests();
      }

      const responses = await Promise.all(apiCalls);
      setListings(responses[0].data.data);
      setCategories(responses[1].data.data);

      if (user?.role === 'business_owner') {
        setUsers(responses[2].data.data);
        setSearchLogs(responses[3].data.data);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const { data } = await API.get('/requests/admin');
      setRequests(data.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) return alert('Please select an image file first');
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const { data } = await API.put('/users/profile-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        updateAuthUser({ avatar: data.avatar });
        alert('Avatar updated successfully!');
        setAvatarFile(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Avatar Update Failed');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await API.put('/users/profile', profileData);
      if (data.success) {
        alert('Profile updated successfully!');
        updateAuthUser({ name: profileData.name, phone: profileData.phone });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Profile Update Failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert('New passwords do not match');
    }
    setPasswordLoading(true);
    try {
      await API.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      alert('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Password Update Failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      await API.put(`/requests/${id}`, { status });
      alert(`Request ${status} successfully`);
      fetchRequests();
      fetchPendingCount();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/staff', newStaff);
      alert('Staff account created successfully!');
      setNewStaff({ name: '', email: '', phone: '', password: '' });
      setShowStaffModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create staff');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account permanently?')) return;
    try {
      await API.delete(`/users/${id}`);
      alert('Account deleted successfully!');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      const { data } = await API.post('/categories', { name: newCategory });
      setCategories([...categories, data.data].sort((a,b) => a.name.localeCompare(b.name)));
      setNewCategory('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch {
      alert('Failed to delete category');
    }
  };

  const handleEditClick = (biz) => {
    setEditId(biz._id);
    const address = biz.address || {};
    const timings = biz.timings || {};
    setFormData({
      title: biz.title || '',
      description: biz.description || '',
      category: biz.category || '',
      street: address.street || biz.street || '',
      city: address.city || biz.city || '',
      state: address.state || biz.state || '',
      zip: address.zip || biz.zip || '',
      phone: biz.phone || '',
      email: biz.email || '',
      website: biz.website || '',
      whatsapp: biz.whatsapp || '',
      openTime: timings.open || biz.open_time || '09:00',
      closeTime: timings.close || biz.close_time || '21:00'
    });
    setShowModal(true);
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/businesses/${id}`);
      setListings(listings.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.csv')) {
      alert('Please select a valid CSV file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await API.post('/businesses/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(data.message || 'Bulk listing import successful!');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'CSV Upload Failed');
    } finally {
      e.target.value = null;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const payload = { ...formData, timings: { open: formData.openTime, close: formData.closeTime } };
      if (editId) {
        await API.put(`/businesses/${editId}`, payload);
      } else {
        await API.post('/businesses', payload);
      }
      setShowModal(false);
      setEditId(null);
      fetchDashboardData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save business');
    } finally {
      setFormLoading(false);
    }
  };

  const downloadCsvTemplate = () => {
    const headers = ['title', 'description', 'category', 'street', 'city', 'state', 'zip', 'phone', 'email', 'website', 'whatsapp', 'openTime', 'closeTime'];
    const row = ['Example Business', 'Description here', 'Restaurant', '123 Main St', 'Mumbai', 'MH', '400001', '+91 9876543210', 'cc@test.com', 'https://test.com', '+91 9111111111', '09:00', '21:00'];
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), row.map(s => `"${s}"`).join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "listings_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getSearchAnalytics = () => {
    const counts = { keywords: {}, categories: {}, locations: {} };
    searchLogs.forEach(log => {
      if (log.query) counts.keywords[log.query] = (counts.keywords[log.query] || 0) + 1;
      if (log.category) counts.categories[log.category] = (counts.categories[log.category] || 0) + 1;
      if (log.location) counts.locations[log.location] = (counts.locations[log.location] || 0) + 1;
    });
    const getTop = (obj) => Object.entries(obj).sort(([, a], [, b]) => b - a).slice(0, 5).map(([name, count]) => ({ name, count }));
    return { topKeywords: getTop(counts.keywords), topCategories: getTop(counts.categories), topLocations: getTop(counts.locations) };
  };

  const getGroupedLogs = () => {
    const groups = {};
    searchLogs.forEach(log => {
      const date = new Date(log.createdAt).toLocaleDateString();
      const userId = log.user ? log.user._id : `guest-${log.userIp}`;
      const key = `${userId}-${date}`;
      if (!groups[key]) groups[key] = { user: log.user, userIp: log.userIp, date, searches: [] };
      groups[key].searches.push(log);
    });
    return Object.values(groups);
  };

  const stats = listings.reduce((acc, item) => {
    acc.views += item.views || 0;
    acc.reviews += item.numReviews || 0;
    if (!item.isApproved) acc.pending++;
    return acc;
  }, { views: 0, reviews: 0, pending: 0, listings: listings.length });

  return (
    <div style={styles.dashboard}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.avatar}>
            {user?.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', borderRadius: '8px' }} /> : (user?.name ? user.name.substring(0, 1) : 'A')}
          </div>
          <div>
            <h4 style={{ color: 'white' }}>{user?.role === 'staff' ? 'Staff Portal' : 'Administrator'}</h4>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.email}</span>
          </div>
        </div>
        <nav style={styles.navMenu}>
          <button onClick={() => setActiveTab('overview')} style={{ ...styles.navItem, ...(activeTab === 'overview' && styles.navActive) }}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <button onClick={() => setActiveTab('listings')} style={{ ...styles.navItem, ...(activeTab === 'listings' && styles.navActive) }}>
            <Briefcase size={18} /> Listings
          </button>
          {user?.role === 'business_owner' && (
            <>
              <button onClick={() => setActiveTab('customers')} style={{ ...styles.navItem, ...(activeTab === 'customers' && styles.navActive) }}>
                <Users size={18} /> Customers
              </button>
              <button onClick={() => setActiveTab('searchLogs')} style={{ ...styles.navItem, ...(activeTab === 'searchLogs' && styles.navActive) }}>
                <Search size={18} /> Analytics
              </button>
              <button onClick={() => setActiveTab('requests')} style={{ ...styles.navItem, ...(activeTab === 'requests' && styles.navActive) }}>
                <MessageSquare size={18} /> Requests 
                {requests.filter(r => r.status === 'pending').length > 0 && <span style={styles.badge}>{requests.filter(r => r.status === 'pending').length}</span>}
              </button>
              <button onClick={() => setActiveTab('staff')} style={{ ...styles.navItem, ...(activeTab === 'staff' && styles.navActive) }}>
                <Users size={18} /> Staff
              </button>
            </>
          )}
          <button onClick={() => setActiveTab('categories')} style={{ ...styles.navItem, ...(activeTab === 'categories' && styles.navActive) }}>
            <FileText size={18} /> Categories
          </button>
          <button onClick={() => setActiveTab('settings')} style={{ ...styles.navItem, ...(activeTab === 'settings' && styles.navActive), marginTop: 'auto' }}>
            <Settings size={18} /> Settings
          </button>
        </nav>
      </div>

      <div style={styles.mainContent}>
        {activeTab === 'overview' && <AdminOverview stats={stats} users={users} searchLogs={searchLogs} requests={requests} setActiveTab={setActiveTab} styles={styles} />}
        {activeTab === 'listings' && <AdminListings listings={listings} loading={loading} error={error} setShowModal={setShowModal} setEditId={setEditId} setFormData={setFormData} handleEditClick={handleEditClick} handleDeleteListing={handleDeleteListing} downloadCsvTemplate={downloadCsvTemplate} handleCsvUpload={handleCsvUpload} styles={styles} />}
        {activeTab === 'customers' && <AdminUsers users={users} loading={loading} handleDeleteUser={handleDeleteUser} styles={styles} />}
        {activeTab === 'categories' && <AdminCategories categories={categories} loading={loading} newCategory={newCategory} setNewCategory={setNewCategory} handleAddCategory={handleAddCategory} handleDeleteCategory={handleDeleteCategory} styles={styles} />}
        {activeTab === 'searchLogs' && <AdminSearchAnalytics searchLogs={searchLogs} getSearchAnalytics={getSearchAnalytics} getGroupedLogs={getGroupedLogs} selectedLogGroup={selectedLogGroup} setSelectedLogGroup={setSelectedLogGroup} styles={styles} />}
        {activeTab === 'requests' && <AdminRequests requests={requests} requestsLoading={requestsLoading} handleUpdateRequestStatus={handleUpdateRequestStatus} styles={styles} />}
        {activeTab === 'staff' && <AdminStaff users={users} handleDeleteUser={handleDeleteUser} setShowStaffModal={setShowStaffModal} styles={styles} />}
        {activeTab === 'settings' && (
          <AdminSettings 
            activeSettingsTab={activeSettingsTab} 
            setActiveSettingsTab={setActiveSettingsTab} 
            profileData={profileData} 
            setProfileData={setProfileData}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            avatarFile={avatarFile}
            setAvatarFile={setAvatarFile}
            profileLoading={profileLoading}
            passwordLoading={passwordLoading}
            avatarLoading={avatarLoading}
            handleUpdateProfile={handleUpdateProfile}
            handleUpdateAvatar={handleUpdateAvatar}
            handleChangePassword={handleChangePassword}
            user={user}
            styles={styles}
          />
        )}
      </div>

      <BusinessModal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        editId={editId} 
        formData={formData} 
        setFormData={setFormData} 
        formLoading={formLoading} 
        formError={formError} 
        categories={categories} 
        handleFormSubmit={handleFormSubmit} 
        styles={styles} 
      />
      
      <StaffModal 
        showStaffModal={showStaffModal} 
        setShowStaffModal={setShowStaffModal} 
        newStaff={newStaff} 
        setNewStaff={setNewStaff} 
        handleCreateStaff={handleCreateStaff} 
        styles={styles} 
      />
    </div>
  );
};

const styles = {
  dashboard: { display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: 'white' },
  sidebar: { width: '260px', background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '20px' },
  sidebarHeader: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '40px', padding: '10px' },
  avatar: { width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#888', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px' },
  navActive: { background: 'rgba(255, 94, 54, 0.1)', color: 'var(--primary)' },
  badge: { marginLeft: 'auto', background: 'var(--danger)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '10px' },
  mainContent: { flexGrow: 1, padding: '40px', overflowY: 'auto', maxHeight: '100vh' },
  viewContent: { maxWidth: '1200px', margin: '0 auto' },
  viewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  viewTitle: { fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { padding: '20px', display: 'flex', gap: '15px', alignItems: 'center' },
  iconBg: { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: '13px', color: '#888', display: 'block' },
  statVal: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
  splitRowGridCRM: { display: 'flex', gap: '20px', marginBottom: '40px' },
  chartWidget: { padding: '25px', minWidth: '0' },
  simulatedGraph: { display: 'flex', alignItems: 'flex-end', gap: '15px', height: '150px', padding: '20px 0' },
  bar: { flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '4px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' },
  barTooltip: { position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: '#333', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', whiteSpace: 'nowrap', display: 'none' },
  leadsWidgetCRM: { width: '350px', padding: '25px' },
  widgetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  widgetLink: { background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', cursor: 'pointer' },
  leadsListCRM: { display: 'flex', flexDirection: 'column', gap: '15px' },
  leadItemCRM: { display: 'flex', gap: '12px', alignItems: 'center' },
  leadAvatarCRM: { width: '35px', height: '35px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
  statusBadgeSmallStatusCRM: { fontSize: '10px', color: 'var(--success)', background: 'rgba(0,211,75,0.1)', padding: '2px 6px', borderRadius: '4px' },
  quickGridCRM: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  actionCardCRM: { display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', color: 'white' },
  actionIconCRM: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  listGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  listCard: { padding: '20px' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  statusTag: { fontSize: '11px', padding: '3px 8px', borderRadius: '5px' },
  cardDesc: { color: '#888', fontSize: '14px', marginBottom: '20px' },
  cardActions: { display: 'flex', gap: '10px' },
  actionBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', color: '#ccc', fontSize: '13px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modalContent: { width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '30px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  closeBtn: { background: 'none', border: 'none', color: '#888', cursor: 'pointer' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }
};

export default AdminDashboard;
