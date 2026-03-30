import React from 'react';
import { BarChart3, PieChart, TrendingUp, Search, Clock, ShieldCheck, Zap, Award, Target, Layout, Activity, MousePointer2 } from 'lucide-react';

const EngagementStats = ({ myLogs, styles }) => {
  // Aggregate mock stats from logs
  const totalSearches = myLogs.length;
  const popularCategory = myLogs.length > 0 ? myLogs[0].category : 'No Search Yet';
  const lastLocation = myLogs.length > 0 ? myLogs[0].location : 'Unknown';

  return (
    <div className="animate-slide-up">
       <header style={styles.contentHeader}>
          <h1 style={{ fontSize: '32px', color: 'white' }}>Your Usage Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>Insights into your service discovery behavior and platform interaction.</p>
       </header>

       <div style={styles.metricsRow}>
          <div className="glass-card" style={styles.metricItem}>
             <div style={styles.innerIcon}><Search size={24} color="var(--primary)" /></div>
             <div><div style={styles.statValue}>{totalSearches}</div><div style={styles.statLabel}>Lifetime Searches</div></div>
          </div>
          <div className="glass-card" style={styles.metricItem}>
             <div style={styles.innerIcon}><Activity size={24} color="var(--success)" /></div>
             <div><div style={styles.statValue}>12</div><div style={styles.statLabel}>Monthly Enquiries</div></div>
          </div>
          <div className="glass-card" style={styles.metricItem}>
             <div style={styles.innerIcon}><ShieldCheck size={24} color="var(--info)" /></div>
             <div><div style={styles.statValue}>Verified</div><div style={styles.statLabel}>Privacy Level</div></div>
          </div>
       </div>

       <div style={styles.splitRow}>
          <div className="glass-card" style={{ padding: '40px' }}>
             <h3 style={{ marginBottom: '30px', color: 'white' }}>Geographic Interest Distribution</h3>
             <div style={styles.simulatedGraphContainer}>
                {[10, 25, 15, 45, 30, 20, 50, 60, 40, 55].map((h, i) => (
                  <div key={i} style={styles.growthBarContainer}>
                     <div style={{ ...styles.growthBarItem, height: `${h}%`, background: `hsla(${255 + (i * 10)}, 100%, 70%, 1)` }}></div>
                  </div>
                ))}
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', color: '#444', fontSize: '10px' }}>
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span>
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div className="glass-card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                   <div style={styles.iconCircle}><PieChart size={24} color="var(--accent)" /></div>
                   <div>
                      <h4 style={{ margin: 0, color: 'white' }}>Interest Categorization</h4>
                      <p style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>Leading Category identified: <strong>{popularCategory}</strong></p>
                   </div>
                </div>
                <div style={styles.progressRow}>
                   <div style={{ ...styles.progressFill, width: '65%', background: 'var(--accent)' }}></div>
                </div>
             </div>

             <div className="glass-card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                   <div style={styles.iconCircle}><MousePointer2 size={24} color="var(--primary)" /></div>
                   <div>
                      <h4 style={{ margin: 0, color: 'white' }}>Conversion Index</h4>
                      <p style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>Your service discovery rate is <strong>4x faster</strong> than average.</p>
                   </div>
                </div>
                <div style={styles.progressRow}>
                   <div style={{ ...styles.progressFill, width: '40%', background: 'var(--primary)' }}></div>
                </div>
             </div>

             <div className="glass-card" style={{ padding: '30px', background: 'var(--primary-gradient)', border: 'none' }}>
                 <h4 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><Award size={20} /> Professional Verification</h4>
                 <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '10px', lineHeight: '1.6' }}>Unlock comprehensive enterprise discovery by completing your verified customer profile today.</p>
                 <button className="btn btn-secondary" style={{ width: '100%', padding: '12px', background: 'white', color: 'black', fontWeight: 'bold', marginTop: '15px' }}>Upgrade to Premium Discovery</button>
             </div>
          </div>
       </div>

       <div className="glass-card" style={{ marginTop: '40px', padding: '40px', border: '1px solid rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: '22px', margin: 0 }}>Discover Emerging Service Clusters</h3>
             <button className="btn btn-secondary" style={{ fontSize: '11px' }}>System Audit Export</button>
          </div>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '10px' }}>Platform-wide metadata trending in your region: <strong>{lastLocation}</strong> (Real-time Latency: 42ms)</p>
          <div style={styles.clusterGrid}>
             {['Hospitals', 'IT Agencies', 'Legal Firms', 'Construction'].map(cluster => (
                <div key={cluster} style={styles.clusterItem}>
                   <Target size={14} color="var(--primary)" /> <span>{cluster}</span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

// Internal specific styles for stats
const styles = {
  contentHeader: { marginBottom: '50px' },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '50px' },
  metricItem: { padding: '30px', display: 'flex', gap: '20px', alignItems: 'center' },
  innerIcon: { width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: '32px', fontWeight: '900', color: 'white' },
  statLabel: { fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' },
  splitRow: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' },
  simulatedGraphContainer: { height: '220px', display: 'flex', alignItems: 'flex-end', gap: '12px', borderBottom: '1px solid #111', paddingBottom: '20px' },
  growthBarContainer: { flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' },
  growthBarItem: { width: '100%', borderRadius: '8px 8px 0 0', opacity: 0.7, cursor: 'pointer', transition: 'all 0.3s' },
  iconCircle: { width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  progressRow: { height: '4px', background: '#111', borderRadius: '10px', marginTop: '15px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '10px' },
  clusterGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '30px' },
  clusterItem: { padding: '15px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', border: '1px solid #111' }
};

export default EngagementStats;
