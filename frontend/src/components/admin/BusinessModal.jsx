import React from 'react';
import { X as CloseIcon } from 'lucide-react';

const BusinessModal = ({ showModal, setShowModal, editId, formData, setFormData, formLoading, formError, categories, handleFormSubmit, styles }) => {
  if (!showModal) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.modalOverlay}>
      <div className="glass-card" style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, color: 'white' }}>{editId ? 'Modify Business Details' : 'Register New Business'}</h3>
          <button style={styles.closeBtn} onClick={() => setShowModal(false)}><CloseIcon size={24} /></button>
        </div>
        
        <form onSubmit={handleFormSubmit} style={styles.modalForm}>
          {formError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontSize: '13px' }}>{formError}</div>}
          
          <div style={styles.formGrid}>
            <div className="form-group">
              <label>Business Title *</label>
              <input name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" className="form-control" value={formData.category} onChange={handleInputChange} required>
                {categories.map(c => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Business Description *</label>
            <textarea name="description" className="form-control" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
          </div>

          <div style={styles.formGrid}>
            <div className="form-group"><label>Street Address *</label><input name="street" className="form-control" value={formData.street} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>City *</label><input name="city" className="form-control" value={formData.city} onChange={handleInputChange} required /></div>
          </div>

          <div style={styles.formGrid}>
            <div className="form-group"><label>State *</label><input name="state" className="form-control" value={formData.state} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>ZIP Code *</label><input name="zip" className="form-control" value={formData.zip} onChange={handleInputChange} required /></div>
          </div>

          <div style={styles.formGrid}>
            <div className="form-group"><label>Primary Phone *</label><input name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Business Email</label><input name="email" type="email" className="form-control" value={formData.email} onChange={handleInputChange} /></div>
          </div>

          <div style={styles.formGrid}>
            <div className="form-group"><label>Website (URL)</label><input name="website" className="form-control" value={formData.website} onChange={handleInputChange} /></div>
            <div className="form-group"><label>WhatsApp Number</label><input name="whatsapp" className="form-control" value={formData.whatsapp} onChange={handleInputChange} /></div>
          </div>

          <div style={styles.formGrid}>
            <div className="form-group"><label>Opening Time</label><input name="openTime" type="time" className="form-control" value={formData.openTime} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Closing Time</label><input name="closeTime" type="time" className="form-control" value={formData.closeTime} onChange={handleInputChange} /></div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '12px' }} disabled={formLoading}>
            {formLoading ? 'Synchronizing with Database...' : (editId ? 'Verify & Commit Changes' : 'Publish Business Listing')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessModal;
