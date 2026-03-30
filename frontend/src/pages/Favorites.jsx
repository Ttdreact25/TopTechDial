import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Heart, MapPin, Grid, Star, ExternalLink, ArrowLeft, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user, updateAuthUser } = useContext(AuthContext);
  const [favoriteBusinesses, setFavoriteBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      if (!user || !user.favoriteItems || user.favoriteItems.length === 0) {
        setFavoriteBusinesses([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Reuse the logic for fetching specific business IDs
        const { data } = await API.get('/businesses', { 
            params: { ids: user.favoriteItems.join(',') } 
        });
        setFavoriteBusinesses(data.data);
      } catch (err) {
        console.error('Failed to load favorite items', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteItems();
  }, [user?.favoriteItems]);

  const removeFavorite = async (id) => {
    try {
      const { data } = await API.put('/auth/toggle-favorite', { businessId: id });
      updateAuthUser(data.data);
    } catch (err) {
      console.error('Failed to remove favorite', err);
    }
  };

  if (!user) return <div style={styles.container}><p style={{ color: 'white' }}>Please Login.</p></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
         <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={18} /> Back</button>
         <h2 style={styles.title}>Your Favorites</h2>
         <p style={styles.subtitle}>You have {user.favoriteItems?.length || 0} items favorited</p>
      </div>

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center' }}>Syncing your favorites...</p>
      ) : favoriteBusinesses.length === 0 ? (
        <div style={styles.emptyState}>
           <Heart size={50} color="#333" />
           <h3>No favorites yet</h3>
           <p>Start giving some love to the services you enjoy!</p>
           <button onClick={() => navigate('/search')} className="btn btn-primary" style={{ marginTop: '20px' }}>Explore Now</button>
        </div>
      ) : (
        <div style={styles.listGrid}>
          {favoriteBusinesses.map((biz) => (
            <div key={biz._id} className="glass-card" style={styles.bizCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.bizTitle}>{biz.title}</h3>
                <div style={styles.categoryBadge}><Grid size={14} /> {biz.category}</div>
              </div>

              <div style={styles.metaRow}>
                <MapPin size={16} color="var(--primary)" />
                <span>{biz.address.city}</span>
              </div>

              <div style={styles.cardFooter}>
                <div style={styles.ratingSection}>
                  <Star size={16} color="var(--accent)" fill="var(--accent)" />
                  <span style={{ fontWeight: '600', color: 'white' }}>{biz.averageRating || '0.0'}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                   <button onClick={() => removeFavorite(biz._id)} style={styles.removeBtn} title="Remove"><Trash2 size={16} /></button>
                   <Link to={`/business/${biz._id}`} style={styles.viewBtn}>View <ExternalLink size={14} /></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0F0F1A', padding: '120px 24px 60px 24px', maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '40px' },
  backBtn: { background: 'none', border: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px', padding: 0 },
  title: { color: 'white', fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' },
  subtitle: { color: '#666', fontSize: '16px', margin: 0 },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#666', gap: '12px' },
  listGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  bizCard: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  bizTitle: { fontSize: '18px', fontWeight: 'bold' },
  categoryBadge: { fontSize: '11px', background: 'rgba(255, 94, 54, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' },
  metaRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: 'auto' },
  ratingSection: { display: 'flex', alignItems: 'center', gap: '6px' },
  viewBtn: { textDecoration: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' },
  removeBtn: { background: 'rgba(255, 94, 54, 0.1)', color: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', transition: 'all 0.2s' }
};

export default Favorites;
