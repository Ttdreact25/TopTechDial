import React from 'react';
import { Search, MapPin, Tag, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

const AdminSearchAnalytics = ({ searchLogs, getSearchAnalytics, getGroupedLogs, selectedLogGroup, setSelectedLogGroup, styles }) => {
  const analytics = getSearchAnalytics();
  const groupedLogs = getGroupedLogs();

  return (
    <div style={styles.viewContent}>
      <div style={styles.viewHeader}>
        <div>
          <h2 style={styles.viewTitle}>Search Analytics & Intent</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Analyze user search patterns and identify market trends</p>
        </div>
        <div className="glass-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--primary-low)' }}>
          <TrendingUp size={20} color="var(--primary)" />
          <div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', display: 'block', lineHeight: 1 }}>{searchLogs.length}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Enquiries</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255, 94, 54, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--primary)' }}><Search size={18} /></div>
            <h5 style={{ margin: 0, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>Top Keywords</h5>
          </div>
          {analytics.topKeywords.length > 0 ? analytics.topKeywords.map((k, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: 'white' }}>{k.name}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>{k.count} hits</span>
            </div>
          )) : <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No keyword data yet</p>}
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(0, 211, 75, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--success)' }}><Tag size={18} /></div>
            <h5 style={{ margin: 0, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>Top Categories</h5>
          </div>
          {analytics.topCategories.length > 0 ? analytics.topCategories.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: 'white' }}>{c.name}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>{c.count} hits</span>
            </div>
          )) : <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No category data yet</p>}
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255, 179, 0, 0.1)', padding: '8px', borderRadius: '8px', color: 'orange' }}><MapPin size={18} /></div>
            <h5 style={{ margin: 0, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>Top Locations</h5>
          </div>
          {analytics.topLocations.length > 0 ? analytics.topLocations.map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: 'white' }}>{l.name}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>{l.count} hits</span>
            </div>
          )) : <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No location data yet</p>}
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>Recent Search History</h4>
        <div className="glass-card-no-padding" style={{ overflow: 'hidden', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                <th style={{ padding: '15px 20px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>User / IP</th>
                <th style={{ padding: '15px 20px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Query</th>
                <th style={{ padding: '15px 20px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time</th>
                <th style={{ padding: '15px 20px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchLogs.slice(0, 10).map((log, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>{log.user ? log.user.name : 'Guest User'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.userIp}</div>
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {log.query && <span style={{ background: 'rgba(255, 94, 54, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>"{log.query}"</span>}
                      {log.category && <span style={{ background: 'rgba(0, 211, 75, 0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{log.category}</span>}
                      {log.location && <span style={{ background: 'rgba(255, 179, 0, 0.1)', color: 'orange', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{log.location}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                     <button className="btn-text" style={{ color: 'var(--primary)', fontSize: '12px', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => setSelectedLogGroup(log)}>
                       Details <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {searchLogs.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No search history recorded yet</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminSearchAnalytics;
