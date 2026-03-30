import React from 'react';
import { Search, MapPin, TrendingUp, Star, Zap, Bell, Clock, Briefcase, Award, ZapOff, CheckCircle, HelpCircle } from 'lucide-react';

const CustomerHome = ({ user, myLogs, styles }) => {
  return (
    <div className="animate-slide-up">
      <header style={styles.contentHeader}>
        <h1 style={{ fontSize: '36px', color: 'white', fontWeight: 'bold' }}>Welcome Back, {user?.name.split(' ')[0]} 👋</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Your daily Local Directory Insights based on geographic markers.</p>

        {/* Quick Actions Bar */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button className="btn btn-primary" style={{ padding: '12px 25px', borderRadius: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} /> Rate a Business</button>
            <button className="btn btn-secondary" style={{ padding: '12px 25px', borderRadius: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><User size={18} /> Edit Profile</button>
            <button className="btn btn-secondary" style={{ padding: '12px 25px', borderRadius: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Bell size={18} /> Settings</button>
        </div>
      </header>
      
      <div style={styles.metricsRow}>
         <div className="glass-card" style={styles.metricItem}>
            <div style={styles.innerIcon}><Search size={24} color="var(--primary)" /></div>
            <div>
               <div style={styles.statValue}>1,250</div>
               <div style={styles.statLabel}>Available Services</div>
            </div>
         </div>
         <div className="glass-card" style={styles.metricItem}>
            <div style={styles.innerIcon}><TrendingUp size={24} color="var(--success)" /></div>
            <div>
               <div style={styles.statValue}>48</div>
               <div style={styles.statLabel}>New Today</div>
            </div>
         </div>
         <div className="glass-card" style={styles.metricItem}>
            <div style={styles.innerIcon}><Award size={24} color="var(--accent)" /></div>
            <div>
               <div style={styles.statValue}>4.8 / 5.0</div>
               <div style={styles.statLabel}>User Satisfaction</div>
            </div>
         </div>
      </div>

      <div style={styles.splitRow}>
          {/* Main Feed */}
          <div style={styles.feedCol}>
             <div className="glass-card" style={styles.feedCard}>
                <div style={styles.cardHeader}>
                   <h3 style={{ fontSize: '18px', margin: 0 }}>Discover Businesses Nearby</h3>
                </div>
                {/* Dummy Featured Content */}
                <div style={styles.dummyFeed}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={styles.feedItem}>
                         <div style={styles.feedImg}><Briefcase color="gray" size={24} /></div>
                         <div style={{ flexGrow: 1 }}>
                            <h4 style={{ margin: 0, color: 'white' }}>Elite Tech Hub Business #{i}00</h4>
                            <div style={{ fontSize: '11px', color: '#666' }}>Technology • Noida Sector 62 • Open Now</div>
                            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                               {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="var(--accent)" />)}
                            </div>
                         </div>
                         <button className="btn btn-primary" style={{ padding: '6px 15px', fontSize: '12px' }}>Details</button>
                      </div>
                    ))}
                </div>
             </div>
             
             <div className="glass-card" style={{ marginTop: '20px', padding: '30px', border: '1px dashed var(--border-glass)' }}>
                <h3 style={{ marginBottom: '15px' }}>Help Center Resources</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={styles.resourceCard}><HelpCircle size={16} /> FAQ & Guidelines</div>
                    <div style={styles.resourceCard}><Zap size={16} /> Quick Start Video</div>
                    <div style={styles.resourceCard}><CheckCircle size={16} /> Verify Your Identity</div>
                    <div style={styles.resourceCard}><Search size={16} /> Advanced Search Tips</div>
                </div>
             </div>

             {/* Recently Viewed (New Extra Content) */}
             <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '20px', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Clock size={20} color="var(--primary)" /> Recently Viewed
                </h3>
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px' }}>
                   {[1, 2, 3, 4].map(i => (
                      <div key={i} className="glass-card" style={{ minWidth: '220px', padding: '15px' }}>
                         <div style={{ height: '100px', background: '#1a1a1a', borderRadius: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase color="#333" size={30} />
                         </div>
                         <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'white' }}>Premium Tech Hub {i}</h4>
                         <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Electronics • 2km away</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Side Widgets */}
          <div style={styles.widgetCol}>
             <div className="glass-card" style={styles.notifWidget}>
                <div style={styles.sectionTitle}>
                   <Bell size={18} /> Recent Activity
                </div>
                <div style={styles.logList}>
                    {myLogs.length > 0 ? myLogs.slice(0, 4).map((log, idx) => (
                      <div key={idx} style={styles.logItem}>
                         <div style={styles.logIcon}><Search size={12} /></div>
                         <div style={{ flexGrow: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{log.query || log.category}</div>
                            <div style={{ fontSize: '10px', color: '#555' }}>Region detected: {log.location}</div>
                         </div>
                         <div style={{ fontSize: '10px', color: 'var(--primary)' }}>Just Now</div>
                      </div>
                    )) : (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>No recent history</div>
                    )}
                </div>
                <button style={styles.allBtn}>See Search History Archive</button>
             </div>

             <div className="glass-card" style={styles.loyaltyCard}>
                <h4 style={{ color: 'white' }}>Enterprise Loyalty System</h4>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>Unlock premium features by contributing to directory accuracy.</p>
                <div style={styles.progressContainer}>
                    <div style={styles.progressBar}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '5px' }}>
                   <span>Explorer Level 1</span>
                   <span>65 / 100 XP</span>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default CustomerHome;
