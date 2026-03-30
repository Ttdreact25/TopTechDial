import React from 'react';
import { X as CloseIcon, UserPlus } from 'lucide-react';

const StaffModal = ({ showStaffModal, setShowStaffModal, newStaff, setNewStaff, handleCreateStaff, styles }) => {
  if (!showStaffModal) return null;

  return (
    <div style={styles.modalOverlay}>
      <div className="glass-card" style={{ ...styles.modalContent, maxWidth: '450px' }}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, color: 'white' }}>Provision Moderator Account</h3>
          <button style={styles.closeBtn} onClick={() => setShowStaffModal(false)}><CloseIcon size={24} /></button>
        </div>
        
        <form onSubmit={handleCreateStaff} style={styles.modalForm}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Moderator Name *</label>
            <input 
              name="name" 
              className="form-control" 
              value={newStaff.name} 
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Login Email address *</label>
            <input 
              name="email" 
              type="email"
              className="form-control" 
              value={newStaff.email} 
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Phone Number *</label>
            <input 
              name="phone" 
              className="form-control" 
              value={newStaff.phone} 
              onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label>Moderator Access Password *</label>
            <input 
              name="password" 
              type="password"
              className="form-control" 
              value={newStaff.password} 
              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px' }}>
            <UserPlus size={18} /> Grant Moderation Privileges
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;
