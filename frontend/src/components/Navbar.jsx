import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Compass, LogOut, Globe, Bell, ChevronDown, PlusCircle, 
  X, Heart, Bookmark, UserCircle, Receipt, Languages, Headset, ChevronRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { user, logout, pendingCount, myNotifications } = useContext(AuthContext);
  const { lang, switchLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const isManagement = user?.role === 'staff' || user?.role === 'admin' || user?.role === 'business_owner';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Smart Dismissal: Scroll or Click Outside to hide menus
  useEffect(() => {
    const handleClose = () => {
      setShowNotif(false);
      setShowLangMenu(false);
    };

    if (showNotif || showLangMenu) {
      window.addEventListener('scroll', handleClose);
      // Small timeout to skip the initial click event
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClose);
      }, 10);
      
      return () => {
        window.removeEventListener('scroll', handleClose);
        document.removeEventListener('click', handleClose);
        clearTimeout(timer);
      };
    }
  }, [showNotif, showLangMenu]);

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <Link to="/" style={styles.logo}>
            <Compass size={28} color="var(--primary)" />
            <span>TopTech<span style={{ color: 'var(--primary)' }}>Dial</span></span>
          </Link>

          <div style={styles.links}>
            {/* Language Selector */}
            {!isManagement && (
              <div style={{ position: 'relative' }}>
                <div style={styles.navGroup} onClick={() => setShowLangMenu(!showLangMenu)}>
                   <Globe size={18} style={{ color: 'var(--text-muted)' }} />
                   <span style={{ fontSize: '14px', fontWeight: '500' }}>{lang.toUpperCase()}</span>
                   <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                {showLangMenu && (
                  <div style={{ ...styles.dropdown, left: 0, right: 'auto', minWidth: '150px' }}>
                    <div style={styles.dropdownItem} onClick={() => { switchLanguage('en'); setShowLangMenu(false); }}>English (EN)</div>
                    <div style={styles.dropdownItem} onClick={() => { switchLanguage('ta'); setShowLangMenu(false); }}>தமிழ் (TA)</div>
                  </div>
                )}
              </div>
            )}

            {/* Free Listing - Business */}
            {!isManagement && (
              <Link to={user ? "/search" : "/login"} style={styles.listingBtn}>
                 <div style={styles.badgeWrapper}>
                    <span style={styles.businessBadge}>{t('businessBadge')}</span>
                 </div>
                 <PlusCircle size={18} color="white" />
                 <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{t('freeListing')}</span>
              </Link>
            )}

            {user && (
              <div style={{ position: 'relative' }}>
                <div 
                  style={{ ...styles.iconBtn, cursor: 'pointer' }}
                  onClick={() => user.role === 'user' ? setShowNotif(!showNotif) : navigate('/dashboard/admin')}
                  title="Notifications"
                >
                  <Bell size={20} color={pendingCount > 0 ? "var(--primary)" : "var(--text-muted)"} />
                  {pendingCount > 0 && <div style={styles.notifBadge}>{pendingCount}</div>}
                </div>
                
                {showNotif && user.role === 'user' && (
                  <div style={{ ...styles.dropdown, maxHeight: '400px', overflowY: 'auto' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold' }}>Notifications</div>
                    {myNotifications.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No new alerts.</div>
                    ) : (
                      myNotifications.map((n) => (
                        <div 
                          key={n._id} 
                          style={{ ...styles.dropdownItem, borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                          onClick={() => { navigate(`/business/${n.businessId?._id}`); setShowNotif(false); }}
                        >
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.status === 'approved' ? 'var(--success)' : 'var(--danger)' }}></div>
                            <span style={{ fontSize: '13px' }}>
                              Your request for <strong>{n.businessId?.title}</strong> was <strong>{n.status}</strong>
                            </span>
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(n.updatedAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div style={styles.userSection}>
                <div 
                  onClick={() => setShowProfileSidebar(true)} 
                  style={styles.avatar}
                  title={user.name}
                >
                  {user.avatar ? (
                     <img 
                       src={user.avatar} 
                       alt="Profile" 
                       style={styles.avatarImg} 
                       onError={(e) => e.target.style.display = 'none'}
                     />
                  ) : (
                     user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                  <div style={styles.onlineStatus}></div>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn} title="Logout"><LogOut size={16} /></button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '8px 24px', borderRadius: '30px', fontWeight: '600' }}>Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* User Profile Sidebar Overlay */}
      {showProfileSidebar && (
        <div style={styles.sidebarOverlay} onClick={() => setShowProfileSidebar(false)}>
           <div style={styles.sidebar} onClick={(e) => e.stopPropagation()}>
              <div style={styles.sidebarHeader}>
                 <button style={styles.closeBtn} onClick={() => setShowProfileSidebar(false)}><X size={24} /></button>
                 <div style={styles.profileMeta}>
                    <div style={styles.metaText}>
                       <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{user?.name || 'User'}</h2>
                       <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '15px' }}>Click to view profile</p>
                    </div>
                    <div style={styles.largeAvatar}>
                       {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt="Large Profile" 
                            style={styles.avatarImg} 
                            onError={(e) => e.target.style.display = 'none'}
                          />
                       ) : (
                          user?.name?.charAt(0).toUpperCase() || 'U'
                       )}
                    </div>
                 </div>
              </div>

              <div style={styles.sidebarBody}>
                 <div 
                   style={styles.menuItem}
                   onClick={() => { navigate('/favorites'); setShowProfileSidebar(false); }}
                 >
                    <Heart size={20} />
                    <span>Favorites</span>
                 </div>
                 <div 
                   style={styles.menuItem}
                   onClick={() => { navigate('/saved'); setShowProfileSidebar(false); }}
                 >
                    <Bookmark size={20} />
                    <span>Saved</span>
                 </div>
                 <div 
                   style={styles.menuItem} 
                   onClick={() => { navigate('/profile/edit'); setShowProfileSidebar(false); }}
                 >
                    <UserCircle size={20} />
                    <span>Edit Profile</span>
                 </div>
                 <div style={{ ...styles.menuItem, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                       <Languages size={20} />
                       <span>Change language</span>
                    </div>
                    <select 
                       value={lang} 
                       onChange={(e) => switchLanguage(e.target.value)}
                       style={styles.langSelect}
                    >
                       <option value="en">English</option>
                       <option value="ta">Tamil</option>
                    </select>
                 </div>

                 <div style={styles.sidebarDivider}></div>

               </div>
            </div>
         </div>
      )}
    </>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    background: 'rgba(15, 15, 26, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--glass-border)',
    zIndex: 1000,
    padding: '12px 0',
  },
  container: {
    maxWidth: '1250px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '22px',
    fontWeight: '700',
    color: 'white',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    color: 'white',
  },
  listingBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    position: 'relative',
    padding: '8px 4px',
  },
  badgeWrapper: {
    position: 'absolute',
    top: '-10px',
    right: '-5px',
  },
  businessBadge: {
    background: '#E01E5A',
    color: 'white',
    fontSize: '9px',
    fontWeight: 'bold',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  iconBtn: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: 'var(--primary)',
    color: 'white',
    fontSize: '10px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #0F0F1A',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderLeft: '1px solid var(--glass-border)',
    paddingLeft: '16px',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #FF5E36, #E01E5A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    position: 'relative',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '10px',
    height: '10px',
    background: '#00D34B',
    borderRadius: '50%',
    border: '2px solid #0F0F1A',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
  },
  dropdown: {
    position: 'absolute',
    top: '40px',
    right: '0',
    background: '#1A1A2E',
    border: '1px solid var(--glass-border)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
    borderRadius: '12px',
    padding: '8px 0',
    minWidth: '280px',
    maxWidth: 'calc(100vw - 40px)',
    zIndex: 100,
    animation: 'fadeIn 0.2s ease-out',
  },
  dropdownItem: {
    padding: '8px 16px',
    fontSize: '13px',
    cursor: 'pointer',
    color: 'white',
    transition: 'background 0.2s',
  },
  // Sidebar Styles
  sidebarOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  sidebar: {
    width: '100%',
    maxWidth: '420px',
    background: 'white',
    height: '100%',
    padding: '32px',
    animation: 'slideIn 0.3s ease-out',
    color: '#111',
  },
  sidebarHeader: {
    marginBottom: '40px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    marginBottom: '32px',
    display: 'block',
  },
  profileMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    flex: 1,
  },
  largeAvatar: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #FF5E36, #E01E5A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    border: '2px solid white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  sidebarBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
    fontSize: '17px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#333',
    transition: 'color 0.2s',
  },
  sidebarDivider: {
    height: '1px',
    background: '#f0f0f0',
    margin: '16px 0',
  },
  langSelect: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
  }
};

export default Navbar;
