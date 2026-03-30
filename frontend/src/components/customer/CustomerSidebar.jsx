import React from 'react';
import { LayoutDashboard, Heart, Search, Bell, Settings, LogOut, MessageCircle, HelpCircle, Award, CreditCard, User, Shield } from 'lucide-react';

const CustomerSidebar = ({ user, activeTab, onTabChange, onLogout, styles }) => {
  const menuItems = [
    { id: 'overview', name: 'Personal Hub', icon: LayoutDashboard },
    { id: 'saved', name: 'Saved Listings', icon: Heart },
    { id: 'messages', name: 'My Conversations', icon: MessageCircle },
    { id: 'notifications', name: 'Alerts & Notifications', icon: Bell },
    { id: 'history', name: 'Search History', icon: Search },
    { id: 'rewards', name: 'Loyalty Rewards', icon: Award },
    { id: 'billing', name: 'Payments & Plan', icon: CreditCard },
    { id: 'security', name: 'Account Security', icon: Shield },
    { id: 'settings', name: 'Account Prefs', icon: Settings },
    { id: 'help', name: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <div style={styles.userAvatar}>
          {user?.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', borderRadius: '15px' }} /> : <span>{user?.name.charAt(0).toUpperCase()}</span>}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '15px' }}>{user?.name}</h4>
          <div style={{ fontSize: '11px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
             <Shield size={10} /> Verified User
          </div>
        </div>
      </div>

      <nav style={styles.navMenu}>
        <div style={styles.navGroupLabel}>MAIN NAVIGATION</div>
        {menuItems.slice(0, 5).map(item => (
          <button 
            key={item.id} 
            onClick={() => onTabChange(item.id)}
            style={{ ...styles.navItem, ...(activeTab === item.id && styles.navActive) }}
          >
            <item.icon size={18} /> {item.name}
          </button>
        ))}

        <div style={{ ...styles.navGroupLabel, marginTop: '25px' }}>ENTERPRISE PERKS</div>
        {menuItems.slice(5, 8).map(item => (
          <button 
            key={item.id} 
            onClick={() => onTabChange(item.id)}
            style={{ ...styles.navItem, ...(activeTab === item.id && styles.navActive) }}
          >
            <item.icon size={18} /> {item.name}
          </button>
        ))}

        <div style={{ ...styles.navGroupLabel, marginTop: '25px' }}>SYSTEM</div>
        {menuItems.slice(8).map(item => (
          <button 
            key={item.id} 
            onClick={() => onTabChange(item.id)}
            style={{ ...styles.navItem, ...(activeTab === item.id && styles.navActive) }}
          >
            <item.icon size={18} /> {item.name}
          </button>
        ))}

        <button onClick={onLogout} style={{ ...styles.navItem, marginTop: 'auto', color: 'var(--danger)' }}>
          <LogOut size={18} /> Exit Dashboard
        </button>
      </nav>
      
      <div style={styles.sidebarFooter}>
         <p style={{ margin: 0 }}>TopTechDial 2.0</p>
         <span style={{ fontSize: '10px', opacity: 0.5 }}>Build: 2024.REL.928</span>
      </div>
    </div>
  );
};

export default CustomerSidebar;
