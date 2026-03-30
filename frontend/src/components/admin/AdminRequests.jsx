import React from 'react';
import { CheckCircle, XCircle, Clock, Check, X, Phone, User, Home } from 'lucide-react';

const AdminRequests = ({ requests, requestsLoading, handleUpdateRequestStatus, styles }) => {
  return (
    <div style={styles.viewContent}>
      <div style={styles.viewHeader}>
        <div>
          <h2 style={styles.viewTitle}>Service Enquiries & Requests ({requests.length})</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Lead follow-ups from users enquiring through the platform</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="glass-card" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,165,0,0.2)' }}>
            <Clock size={16} color="orange" />
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{requests.filter(r => r.status === 'pending').length} Pending</span>
          </div>
          <div className="glass-card" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(0,211,75,0.2)' }}>
            <CheckCircle size={16} color="var(--success)" />
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{requests.filter(r => r.status === 'approved').length} Active</span>
          </div>
        </div>
      </div>

      {requestsLoading ? (
        <p style={{ color: 'white' }}>Loading requests...</p>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', opacity: 0.8 }} className="glass-card">
          <Clock size={48} style={{ marginBottom: '20px', color: 'var(--text-muted)' }} />
          <h3 style={{ color: 'white', marginBottom: '10px' }}>No requests yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Incoming service requests from customers will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {requests.map((r, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1.5fr', gap: '25px', padding: '25px', border: r.status === 'pending' ? '1px solid rgba(255, 165, 0, 0.15)' : '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <User size={16} color="var(--primary)" />
                  <h4 style={{ margin: 0, fontSize: '18px' }}>{r.userName}</h4>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    background: r.status === 'pending' ? 'rgba(255,165,0,0.1)' : r.status === 'approved' ? 'rgba(0,211,75,0.1)' : 'rgba(255,0,0,0.1)',
                    color: r.status === 'pending' ? 'orange' : r.status === 'approved' ? 'var(--success)' : 'var(--danger)',
                    border: '1px solid currentColor',
                    textTransform: 'uppercase',
                    marginLeft: '8px'
                  }}>
                    {r.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-light)', marginBottom: '5px' }}>
                  <Phone size={14} /> {r.userPhone}
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginTop: '15px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '13px', color: 'var(--text-light)', fontStyle: 'italic' }}>
                  "{r.message}"
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>Enquiring For</h5>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Home size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ color: 'white', fontSize: '15px', fontWeight: 'bold' }}>{r.businessTitle}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{r.businessCategory} • {r.businessCity}</div>
                  </div>
                </div>
                <div style={{ marginTop: '15px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Request Date: {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                {r.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleUpdateRequestStatus(r._id, 'approved')} 
                      className="btn btn-sm btn-success" 
                      style={{ background: 'var(--success)', border: 'none', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
                    >
                      <Check size={16} /> Approve Lead
                    </button>
                    <button 
                      onClick={() => handleUpdateRequestStatus(r._id, 'rejected')} 
                      className="btn btn-sm btn-outline-danger" 
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
                    >
                      <X size={16} /> Reject Lead
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Actions Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
