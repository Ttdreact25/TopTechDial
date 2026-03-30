import React, { useState } from 'react';
import { PlusCircle, FileText, Edit, Trash2, Search as SearchIcon } from 'lucide-react';

const AdminListings = ({ listings, loading, error, setShowModal, setEditId, setFormData, handleEditClick, handleDeleteListing, downloadCsvTemplate, handleCsvUpload, styles }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredListings = listings.filter(biz => 
    biz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    biz.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.viewContent}>
      <div style={styles.viewHeader}>
        <div>
          <h2 style={styles.viewTitle}>Manage Content ({listings.length})</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Search, add, edit or remove business listings</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="file" 
            accept=".csv" 
            id="csvUpload" 
            style={{ display: 'none' }} 
            onChange={handleCsvUpload} 
          />
          <button 
            onClick={downloadCsvTemplate} 
            className="btn btn-sm btn-outline-secondary"
            style={{ display: 'flex', gap: '6px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <FileText size={16} /> Template
          </button>

          <button 
            onClick={() => document.getElementById('csvUpload').click()} 
            className="btn btn-sm btn-secondary"
            style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
          >
            <FileText size={16} /> Bulk Import
          </button>

          <button 
            onClick={() => {
              setEditId(null);
              setFormData({
                title: '', description: '', category: 'Restaurant', 
                street: '', city: '', state: '', zip: '',
                phone: '', email: '', website: '', whatsapp: '', 
                openTime: '09:00', closeTime: '21:00'
              });
              setShowModal(true);
            }} 
            style={styles.addBtn} 
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={16} /> Add Listing
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <SearchIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search by title, category, or city..." 
          className="form-control"
          style={{ paddingLeft: '40px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ color: 'white' }}>Loading listings...</p>
      ) : error ? (
        <p style={{ color: 'var(--danger)' }}>{error}</p>
      ) : filteredListings.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No businesses found matching your search.</p>
      ) : (
        <div style={styles.listGrid}>
          {filteredListings.map((business) => (
            <div key={business._id} className="glass-card" style={styles.listCard}>
              <div style={styles.listHeader}>
                <h4 style={{ fontSize: '16px' }}>{business.title}</h4>
                <span style={{ 
                  ...styles.statusTag, 
                  background: business.isApproved ? 'rgba(0, 211, 75, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                  color: business.isApproved ? 'var(--success)' : 'orange',
                  border: business.isApproved ? '1px solid var(--success)' : '1px solid orange',
                  fontSize: '10px'
                }}>
                  {business.isApproved ? 'Live' : 'Pending'}
                </span>
              </div>
              <p style={{ ...styles.cardDesc, fontSize: '13px' }}>{business.category} • {business.city}</p>
              <p style={{ ...styles.cardDesc, height: '40px', overflow: 'hidden' }}>
                {business.description ? business.description.substring(0, 80) + '...' : 'No description'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {business.views || 0} views
                </div>
                <div style={styles.cardActions}>
                  <button onClick={() => handleEditClick(business)} style={{ ...styles.actionBtn, padding: '4px 8px' }}><Edit size={12} /> Edit</button>
                  <button onClick={() => handleDeleteListing(business._id)} style={{ ...styles.actionBtn, color: 'var(--danger)', padding: '4px 8px' }}><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminListings;
