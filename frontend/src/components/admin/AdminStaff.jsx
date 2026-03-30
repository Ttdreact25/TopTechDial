import React from 'react';
import { PlusCircle, Users, Trash2, Mail, Phone, Calendar, UserPlus } from 'lucide-react';

const AdminStaff = ({ users, handleDeleteUser, setShowStaffModal, styles }) => {
  const staffMembers = users.filter(u => u.role === 'staff');

  return (
    <div style={styles.viewContent}>
      <div style={styles.viewHeader}>
        <div>
          <h2 style={styles.viewTitle}>Manage Support Staff ({staffMembers.length})</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Admins can create and manage platform moderators</p>
        </div>
        <button 
          onClick={() => setShowStaffModal(true)} 
          className="btn btn-primary" 
          style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
        >
          <UserPlus size={18} /> Add Staff Account
        </button>
      </div>

      {staffMembers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', borderRadius: '12px' }} className="glass-card">
          <Users size={48} style={{ marginBottom: '20px', color: 'var(--text-muted)' }} />
          <h3 style={{ color: 'white', marginBottom: '10px' }}>No staff members found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Start building your moderation team by creating a staff account.</p>
        </div>
      ) : (
        <div style={styles.listGrid}>
          {staffMembers.map((s) => (
            <div key={s._id} className="glass-card" style={{ ...styles.listCard, border: '1px solid var(--primary-low)' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px', 
                  background: 'rgba(255, 94, 54, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'var(--primary)'
                }}>
                  {s.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{s.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Moderator</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-light)' }}>
                  <Mail size={14} color="var(--primary)" /> {s.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-light)' }}>
                  <Phone size={14} color="var(--primary)" /> {s.phone || 'No phone recorded'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <Calendar size={14} /> Created: {new Date(s.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <div style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Active Status
                </div>
                <button 
                  onClick={() => handleDeleteUser(s._id)} 
                  className="btn btn-sm btn-outline-danger"
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  Terminate Access
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
