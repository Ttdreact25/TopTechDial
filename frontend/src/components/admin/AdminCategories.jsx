import React, { useState } from 'react';
import { PlusCircle, Trash2, Tag, Search as SearchIcon } from 'lucide-react';

const AdminCategories = ({ categories, loading, newCategory, setNewCategory, handleAddCategory, handleDeleteCategory, styles }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.viewContent}>
      <div style={styles.viewHeader}>
        <div>
          <h2 style={styles.viewTitle}>Manage Categories ({categories.length})</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Add or remove categories dynamically</p>
        </div>
      </div>

      <form onSubmit={handleAddCategory} className="glass-card" style={{ display: 'flex', gap: '15px', padding: '20px', marginBottom: '30px' }}>
        <div style={{ flexGrow: 1, position: 'relative' }}>
          <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="New Category Name (e.g. Real Estate)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={18}/> Create New
        </button>
      </form>

      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <SearchIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Filter categories..." 
          className="form-control"
          style={{ paddingLeft: '40px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ color: 'white' }}>Loading categories...</p>
      ) : filteredCategories.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>No categories matched your filter.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {filteredCategories.map((c) => (
            <div key={c._id || c.name} className="glass-card" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h4 style={{ margin: 0, fontSize: '15px' }}>{c.name}</h4>
              <button 
                onClick={() => handleDeleteCategory(c._id)} 
                className="btn-icon" 
                style={{ 
                  color: 'var(--danger)', 
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '5px',
                  borderRadius: '50%'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(235, 64, 52, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
