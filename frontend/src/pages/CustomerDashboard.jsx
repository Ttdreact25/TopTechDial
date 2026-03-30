import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Search, User, Clock, ChevronRight, LayoutDashboard, Settings, 
  LogOut, Heart, MessageCircle, Award, CreditCard, HelpCircle, Bell,
  TrendingUp, Star, Zap, Building, ZapOff, CheckCircle, BarChart3, PieChart,
  ShieldCheck, MoreVertical, Edit2, Trash2
} from 'lucide-react';

// Sub-components for Customer Dashboard
import CustomerSidebar from '../components/customer/CustomerSidebar';
import CustomerHome from '../components/customer/CustomerHome';
import SavedListings from '../components/customer/SavedListings';

// Leaflet fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

const CustomerDashboard = () => {
  const { user, logout, updateGpsLocation } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [location, setLocation] = useState([12.9716, 77.5946]); // Default Bangalore
  const [cityName, setCityName] = useState(null);
  const [myLogs, setMyLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // 1. Get User Location & Geocode
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
           const { latitude, longitude } = pos.coords;
           const loc = [latitude, longitude];
           setLocation(loc);

           try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
                headers: { 'User-Agent': 'TopTechDial/1.0' }
              });
              const data = await res.json();
              const city = data.address.city || data.address.town || data.address.village || data.address.state || 'Local Region';
              setCityName(city);
              updateGpsLocation({ lat: latitude, lng: longitude, city });
           } catch (err) {
              updateGpsLocation({ lat: latitude, lng: longitude });
           }
        },
        (err) => console.log('Location denied', err)
      );
    }

    // 2. Fetch User Logs
    const fetchLogs = async () => {
      try {
        const { data } = await API.get('/search-logs/my-logs');
        setMyLogs(data.data);
      } catch (err) {
        console.log('Error fetching logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    
    // Resize map fix
    setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
  }, [user, navigate]);

  if (!user && !loading) return null;

  return (
    <div style={styles.dashboard}>
      <CustomerSidebar 
        user={user} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={logout} 
        styles={styles} 
      />

      <div style={styles.mainContent}>
        {activeTab === 'overview' && (
           <CustomerHome user={user} myLogs={myLogs} styles={styles} />
        )}

        {activeTab === 'saved' && (
           <SavedListings styles={styles} />
        )}

        {activeTab === 'notifications' && (
           <div style={{ padding: '20px' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '30px', color: 'white' }}>System Alerts</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {[1, 2, 3].map(i => (
                    <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                       <div style={{ background: 'var(--primary-low)', padding: '12px', borderRadius: '12px' }}><Bell size={20} color="var(--primary)" /></div>
                       <div style={{ flexGrow: 1 }}>
                          <h4 style={{ margin: 0, fontSize: '15px', color: 'white' }}>New Verification Badge Available</h4>
                          <p style={{ margin: '5px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Complete your profile to earn the 'TopTech Verified' status.</p>
                       </div>
                       <span style={{ fontSize: '11px', color: '#444' }}>2h ago</span>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'history' && (
           <div style={{ padding: '20px' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '30px', color: 'white' }}>Search Analytics</h1>
              <div className="glass-card" style={{ padding: '30px' }}>
                 <div style={styles.logList}>
                    {myLogs.map((log, idx) => (
                      <div key={idx} style={{ ...styles.logItem, padding: '20px', borderBottom: '1px solid #111', background: 'transparent' }}>
                         <div style={{ ...styles.logIcon, width: '40px', height: '40px' }}><Search size={16} /></div>
                         <div style={{ flexGrow: 1 }}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{log.query || 'Generic Search'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Intensity Category: {log.category || 'General'} • Context: {log.location}</div>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: 'white' }}>{new Date(log.timestamp).toLocaleDateString()}</div>
                            <div style={{ fontSize: '10px', color: 'var(--success)' }}>Success Sync</div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'security' && (
           <div style={{ padding: '20px' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '30px', color: 'white' }}>Security Protocol</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                 <div className="glass-card" style={{ padding: '30px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px 0' }}><ShieldCheck color="var(--success)" /> Two-Factor Auth</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Status: <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Active</span></p>
                    <p style={{ fontSize: '12px', color: '#555', marginTop: '10px' }}>Authentication verified via +91 ******4502</p>
                    <button className="btn btn-secondary" style={{ marginTop: '20px', width: '100%', fontSize: '13px' }}>Configure 2FA</button>
                 </div>
                 <div className="glass-card" style={{ padding: '30px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px 0' }}><Zap color="var(--accent)" /> Active Sessions</h3>
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Chrome on Windows (Current)</span>
                          <span style={{ color: 'var(--success)' }}>Online</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5 }}>
                          <span>Safari on iPhone 15</span>
                          <span>2d ago</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {(activeTab === 'messages' || activeTab === 'rewards' || activeTab === 'billing' || activeTab === 'help') && (
           <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <div style={{ background: 'var(--primary-low)', display: 'inline-flex', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}><Construction size={40} color="var(--primary)" /></div>
              <h1 style={{ fontSize: '30px' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h1>
              <p style={{ color: 'var(--text-muted)' }}>This enterprise specialized feature is currently being provisioned for your region.</p>
              <button onClick={() => setActiveTab('overview')} className="btn btn-primary" style={{ marginTop: '30px' }}>Return to Overview</button>
           </div>
        )}

        {activeTab === 'settings' && (
           <div style={{ padding: '20px' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '30px', color: 'white' }}>Account Preferences</h1>
              <div className="glass-card" style={{ padding: '30px', maxWidth: '800px' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={styles.formGroup}>
                       <label>Display Name</label>
                       <input className="form-control" defaultValue={user?.name} />
                    </div>
                    <div style={styles.formGroup}>
                       <label>Registered Phone</label>
                       <input className="form-control" defaultValue={user?.phone} />
                    </div>
                 </div>
                 <button className="btn btn-primary" style={{ marginTop: '30px' }}>Synchronize Account Metadata</button>
              </div>
           </div>
        )}

        <div style={{ height: '300px', borderRadius: '24px', overflow: 'hidden', marginTop: '60px', position: 'relative' }}>
           <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={location}><Popup>Live GPS Location Context</Popup></Marker>
              <ChangeView center={location} />
           </MapContainer>
           <div style={styles.mapLabel}><MapPin size={12} /> Real-time Location Active: {cityName || 'Syncing...'}</div>
        </div>
      </div>
    </div>
  );
};

// Expanded Styles for Customer Dashboard
const styles = {
  dashboard: { display: 'flex', minHeight: 'calc(100vh - 70px)', background: '#050505', color: 'white' },
  sidebar: { width: '280px', background: 'rgba(255,255,255,0.01)', borderRight: '1px solid #1a1a1a', padding: '50px 20px', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '50px', padding: '0 10px' },
  userAvatar: { width: '48px', height: '48px', borderRadius: '15px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 },
  navGroupLabel: { fontSize: '10px', color: '#444', letterSpacing: '2px', fontWeight: 'bold', margin: '15px 15px 10px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', borderRadius: '15px', color: '#888', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s', fontSize: '14px' },
  navActive: { background: 'rgba(255, 94, 54, 0.08)', color: 'white', fontWeight: 'bold' },
  sidebarFooter: { marginTop: '40px', padding: '20px', textAlign: 'center', fontSize: '11px', color: '#333', borderTop: '1px solid #111' },

  mainContent: { flexGrow: 1, padding: '80px 60px', maxWidth: '1400px', margin: '0 auto', overflowY: 'auto', maxHeight: '100vh' },
  contentHeader: { marginBottom: '50px' },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '50px' },
  metricItem: { padding: '30px', display: 'flex', gap: '20px', alignItems: 'center' },
  innerIcon: { width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: '32px', fontWeight: '900', color: 'white' },
  statLabel: { fontSize: '12px', color: '#555', textTransform: 'uppercase' },

  splitRow: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' },
  feedCol: { minWidth: '0' },
  widgetCol: { minWidth: '0' },
  feedCard: { padding: '30px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #111', paddingBottom: '15px' },
  dummyFeed: { display: 'flex', flexDirection: 'column', gap: '15px' },
  feedItem: { display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid var(--border-glass)' },
  feedImg: { width: '60px', height: '60px', borderRadius: '10px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  resourceCard: { padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #111', cursor: 'pointer' },

  notifWidget: { padding: '25px' },
  sectionTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 'bold', marginBottom: '25px', color: 'white' },
  logList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  logItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' },
  logIcon: { width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  allBtn: { width: '100%', background: 'none', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '10px', color: '#555', fontSize: '11px', marginTop: '20px', cursor: 'pointer' },

  loyaltyCard: { marginTop: '20px', padding: '30px', background: 'var(--primary-gradient)', border: 'none' },
  progressContainer: { height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginTop: '15px', overflow: 'hidden' },
  progressBar: { height: '100%', background: 'white', width: '65%', borderRadius: '10px' },

  discoveryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  savedCard: { overflow: 'hidden' },
  savedImg: { height: '120px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  savedContent: { padding: '20px' },
  roundAction: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardFooter: { marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  searchEmptyBox: { padding: '40px', textAlign: 'center', border: '1px dashed #222' },
  pulseSearch: { width: '70px', height: '70px', margin: '0 auto 20px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  mapLabel: { position: 'absolute', bottom: '20px', left: '20px', background: 'black', padding: '8px 15px', borderRadius: '30px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000, border: '1px solid var(--border-glass)' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '10px' }
};

const Construction = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="8" rx="1" />
    <path d="M17 14v7" /><path d="M7 14v7" /><path d="M17 3v3" /><path d="M7 3v3" /><path d="M10 14 2.3 6.3" /><path d="m14 14 7.7-7.7" /><path d="m8 6 8 8" /><path d="m16 6-8 8" />
  </svg>
);

export default CustomerDashboard;
