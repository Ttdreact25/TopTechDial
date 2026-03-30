import React, { useState } from 'react';
import { Trash2, Search as SearchIcon, Mail, Phone, Calendar } from 'lucide-react';

const AdminUsers = ({ users, loading, handleDeleteUser, styles }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => u.role === 'user' && (
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div style={styles.viewContent}>
      <div style={styles.viewHeader}>
        <div>
          <h2 style={styles.viewTitle}>Customers & Leads ({filteredUsers.length})</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Registered platform users and search engagements</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <SearchIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search by name, email, or phone..." 
          className="form-control"
          style={{ paddingLeft: '40px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ color: 'white' }}>Loading customers...</p>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No customers found matching your criteria.</p>
        </div>
      ) : (
        <div style={styles.listGrid}>
          {filteredUsers.map((u) => (
            <div key={u._id} className="glass-card" style={styles.listCard}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ 
                  width: '45px', 
                  height: '45px', 
                  borderRadius: '50%', 
                  background: 'var(--primary-gradient)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {u.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{u.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registered User</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-light)' }}>
                  <Mail size={14} color="var(--primary)" /> {u.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-light)' }}>
                  <Phone size={14} color="var(--primary)" /> {u.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <Calendar size={14} /> Joined: {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleDeleteUser(u._id)} 
                  className="btn btn-sm btn-outline-danger"
                  style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px' }}
                >
                  <Trash2 size={12} /> Remove User
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
