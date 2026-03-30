import React from 'react';
import { Eye, Users, Search, Briefcase, MessageSquare, ArrowUpRight } from 'lucide-react';

const AdminOverview = ({ stats, users, searchLogs, requests, setActiveTab, styles }) => {
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={styles.viewContent}>
      {pendingRequests > 0 && (
        <div 
          onClick={() => setActiveTab('requests')}
          style={{ 
            background: 'rgba(255, 179, 0, 0.1)', 
            border: '1px solid orange', 
            padding: '16px', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            animation: 'pulse 2s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MessageSquare color="orange" size={24} />
            <div>
              <strong style={{ color: 'white' }}>Action Required</strong>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                 You have {pendingRequests} customers waiting for service approval
              </p>
            </div>
          </div>
          <button className="btn btn-sm btn-primary" style={{ background: 'orange' }}>View Requests</button>
        </div>
      )}

      <div style={styles.viewHeader}>
        <div>
          <h2 style={styles.viewTitle}>Overview & CRM Workspace</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Analyze performance, manage incoming leads, and track listings</p>
        </div>
        <button 
          onClick={() => setActiveTab('customers')} 
          className="btn btn-sm btn-secondary" 
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          Manage Leads <ArrowUpRight size={16} />
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div className="glass-card" style={styles.statCard}>
          <div style={{...styles.iconBg, background: 'rgba(255, 94, 54, 0.1)', color: 'var(--primary)' }}><Eye size={24} /></div>
          <div>
            <span style={styles.statLabel}>Total Page Views</span>
            <p style={styles.statVal}>{stats.views}</p>
          </div>
        </div>
        <div className="glass-card" style={styles.statCard}>
          <div style={{...styles.iconBg, background: 'rgba(0, 211, 75, 0.1)', color: 'var(--success)' }}><Users size={24} /></div>
          <div>
            <span style={styles.statLabel}>Total Platform Leads</span>
            <p style={styles.statVal}>{users.length}</p>
          </div>
        </div>
        <div className="glass-card" style={styles.statCard}>
          <div style={{...styles.iconBg, background: 'rgba(255, 179, 0, 0.1)', color: 'orange' }}><Search size={24} /></div>
          <div>
            <span style={styles.statLabel}>Search Enquiries</span>
            <p style={styles.statVal}>{searchLogs.length}</p>
          </div>
        </div>
        <div className="glass-card" style={styles.statCard}>
          <div style={{...styles.iconBg, background: 'rgba(233, 30, 99, 0.1)', color: '#E91E63' }}><Briefcase size={24} /></div>
          <div>
            <span style={styles.statLabel}>Total Listings</span>
            <p style={styles.statVal}>{stats.listings}</p>
          </div>
        </div>
      </div>

      <div style={styles.splitRowGridCRM}>
        <div className="glass-card" style={{ ...styles.chartWidget, flexGrow: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4>Business Engagement Insights</h4>
            <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>Weekly</span> | <span style={{ color: 'var(--primary)' }}>Monthly</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Engagement trends for your business listings</p>
          <div style={styles.simulatedGraph}>
            <div style={{ ...styles.bar, height: '35%' }}><div style={styles.barTooltip}>350 Views</div></div>
            <div style={{ ...styles.bar, height: '55%' }}><div style={styles.barTooltip}>550 Views</div></div>
            <div style={{ ...styles.bar, height: '75%', background: 'var(--primary)' }}><div style={styles.barTooltip}>750 Views</div></div>
            <div style={{ ...styles.bar, height: '65%' }}><div style={styles.barTooltip}>650 Views</div></div>
            <div style={{ ...styles.bar, height: '90%', background: 'var(--primary)' }}><div style={styles.barTooltip}>900 Views</div></div>
            <div style={{ ...styles.bar, height: '45%' }}><div style={styles.barTooltip}>450 Views</div></div>
          </div>
        </div>

        <div className="glass-card" style={styles.leadsWidgetCRM}>
          <div style={styles.widgetHeader}>
            <h4>Recent Leads</h4>
            <button onClick={() => setActiveTab('customers')} style={styles.widgetLink}>View All</button>
          </div>
          {users.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No leads captured yet</p>
          ) : (
            <div style={styles.leadsListCRM}>
              {users.slice(0, 4).map((u) => (
                <div key={u._id} style={styles.leadItemCRM}>
                  <div style={styles.leadAvatarCRM}>{u.name.substring(0, 1).toUpperCase()}</div>
                  <div style={{ flexGrow: 1 }}>
                    <h6 style={{ margin: 0, fontSize: '14px', color: 'white' }}>{u.name}</h6>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</span>
                  </div>
                  <span style={styles.statusBadgeSmallStatusCRM}>New</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <h4 style={{ color: 'white', marginBottom: '16px' }}>Quick CRM Actions</h4>
        <div style={styles.quickGridCRM}>
          <button onClick={() => setActiveTab('listings')} style={styles.actionCardCRM}>
            <div style={{ ...styles.actionIconCRM, background: 'rgba(255, 94, 54, 0.1)', color: 'var(--primary)' }}><Briefcase size={20} /></div>
            <div style={{ textAlign: 'left' }}>
              <h5 style={{ margin: 0, fontSize: '14px' }}>Manage Listings</h5>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Extend directory reach</p>
            </div>
          </button>
          <button onClick={() => setActiveTab('categories')} style={styles.actionCardCRM}>
            <div style={{ ...styles.actionIconCRM, background: 'rgba(0, 211, 75, 0.1)', color: 'var(--success)' }}><Search size={20} /></div>
            <div style={{ textAlign: 'left' }}>
              <h5 style={{ margin: 0, fontSize: '14px' }}>Edit Categories</h5>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Structure platform tags</p>
            </div>
          </button>
          <button onClick={() => setActiveTab('settings')} style={styles.actionCardCRM}>
            <div style={{ ...styles.actionIconCRM, background: 'rgba(255, 179, 0, 0.1)', color: 'orange' }}><Users size={20} /></div>
            <div style={{ textAlign: 'left' }}>
              <h5 style={{ margin: 0, fontSize: '14px' }}>Configuration</h5>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Manage account controls</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
