import React from 'react';
import { Heart, Search, Star, Share2, Trash2, MapPin, Phone, Building } from 'lucide-react';

const SavedListings = ({ styles }) => {
  const mockSaved = [
    { name: 'Elite Food Services', cat: 'Restaurant', city: 'Mumbai', rating: 4.8 },
    { name: 'Unified Tech Solutions', cat: 'IT Services', city: 'Dehradun', rating: 4.5 },
    { name: 'Global Health Care', cat: 'Medical', city: 'Delhi', rating: 4.9 },
    { name: 'Premium Real Estate', cat: 'Property', city: 'Bangalore', rating: 4.7 }
  ];

  return (
    <div className="animate-slide-up">
       <header style={styles.contentHeader}>
          <h1 style={{ fontSize: '32px', color: 'white' }}>Your Favorite Listings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Quick access to services you are interested in.</p>
       </header>

       <div style={styles.discoveryGrid}>
          {mockSaved.map((item, idx) => (
            <div key={idx} className="glass-card" style={styles.savedCard}>
               <div style={styles.savedImg}><Building size={48} color="#222" /></div>
               <div style={styles.savedContent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <div>
                        <h4 style={{ margin: 0, fontSize: '18px', color: 'white' }}>{item.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#666', marginTop: '3px' }}>
                           <MapPin size={10} /> {item.city} • {item.cat}
                        </div>
                     </div>
                     <button style={styles.roundAction}><Heart size={16} fill="var(--primary)" color="var(--primary)" /></button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '4px', margin: '15px 0' }}>
                     {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= 4 ? "var(--accent)" : "none"} color="var(--accent)" />)}
                  </div>

                  <div style={styles.cardFooter}>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '11px' }}><Share2 size={14} /> Shared Access</button>
                        <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '11px' }}>Quick Details</button>
                     </div>
                     <button style={{ ...styles.roundAction, color: '#444' }}><Trash2 size={16} /></button>
                  </div>
               </div>
            </div>
          ))}

          <div className="glass-card" style={styles.searchEmptyBox}>
              <div style={styles.pulseSearch}><Search size={32} /></div>
              <h3>Widen Your Search</h3>
              <p style={{ color: '#555', fontSize: '13px' }}>Discover thousands of verified directory services within seconds.</p>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>Global Directory Search</button>
          </div>
       </div>
    </div>
  );
};

export default SavedListings;
