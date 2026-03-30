import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Search as SearchIcon, MapPin, Grid, Star, ExternalLink, Bookmark, Heart } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, updateAuthUser, gpsLocation } = useContext(AuthContext);

  const toggleSave = async (id) => {
    try {
      const { data } = await API.put('/auth/toggle-save', { businessId: id });
      updateAuthUser(data.data);
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const { data } = await API.put('/auth/toggle-favorite', { businessId: id });
      updateAuthUser(data.data);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  // Filter States initialized from URL params if available
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [sort, setSort] = useState('latest');

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [useNearMe, setUseNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user?.role === 'staff') {
      navigate('/dashboard/admin');
    }
  }, [user]);

  const getLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setUseNearMe(true);
        },
        (err) => { alert('Failed to get location: ' + err.message); }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const fetchFiltersAndBusinesses = async () => {
    try {
      setLoading(true);

      // Fetch dynamic filters
      try {
        const [catRes, citiesRes] = await Promise.all([
          API.get('/categories'),
          API.get('/businesses/cities')
        ]);
        setCategories(catRes.data.data);
        setCities(citiesRes.data.data);
      } catch (err) {
        console.error('Failed to load filters', err);
      }

      const params = {};
      if (keyword) params.keyword = keyword;
      if (category) params.category = category;
      if (city) params.city = city;
      if (sort) params.sort = sort;

      // 📍 Live Location Near Me Filters (10km)
      if (useNearMe && userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
        params.radius = 10;
      }

      const { data } = await API.get('/businesses', { params });
      setBusinesses(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch businesses');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation && !gpsLocation) {
       navigator.geolocation.getCurrentPosition((pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
       }, () => {}); // silent fail for auto-fetch
    }
  }, [gpsLocation]);

  useEffect(() => {
    // Update URL when filters change
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (category) newParams.category = category;
    if (city) newParams.city = city;
    setSearchParams(newParams);

    const delayDebounceFn = setTimeout(() => {
      fetchFiltersAndBusinesses();
      // Log analytics search details with live GPS coordinates if available
      if (keyword || category || city) {
        API.post('/search-logs', { 
          query: keyword, 
          category, 
          location: city || gpsLocation?.city || '',
          lat: userLocation?.lat || gpsLocation?.lat,
          lng: userLocation?.lng || gpsLocation?.lng
        }).catch(() => {});
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, category, city, sort, useNearMe, userLocation]);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div className="glass-card" style={styles.filterCard}>
          <h3 style={styles.filterTitle}>Filters</h3>
          
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="form-control"
              style={styles.select}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => <option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>)}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>City</label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              className="form-control"
              style={styles.select}
            >
              <option value="">All Cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sort By</label>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)} 
              className="form-control"
              style={styles.select}
            >
              <option value="latest">Latest</option>
              <option value="rating">Top Rated</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={getLiveLocation} 
              className={`btn ${useNearMe ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '14px' }}
            >
              <MapPin size={16} /> {useNearMe ? 'Near Me: 10km Active' : 'Near me'}
            </button>
            {useNearMe && (
              <button 
                onClick={() => setUseNearMe(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '12px', marginTop: '6px', cursor: 'pointer', textAlign: 'center', display: 'block', width: '100%' }}
              >
                Clear Location Filter
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div className="glass-card" style={styles.searchBar}>
          <SearchIcon size={20} color="var(--primary)" />
          <input 
            type="text" 
            placeholder="Search for services, shops, or keywords..." 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)} 
            style={styles.searchInput}
          />
        </div>

        {loading ? (
          <p style={{ color: 'white', marginTop: '20px' }}>Loading business results...</p>
        ) : error ? (
          <p style={{ color: 'var(--danger)', marginTop: '20px' }}>{error}</p>
        ) : businesses.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>No matches found. Try modifying filters.</p>
        ) : (
          <div style={styles.listGrid}>
            {businesses.map((biz) => (
              <div key={biz._id} className="glass-card" style={styles.bizCard}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.bizTitle}>{biz.title}</h3>
                  <div style={styles.categoryBadge}>
                    <Grid size={14} /> {biz.category}
                  </div>
                </div>

                <div style={styles.metaRow}>
                  <MapPin size={16} color="var(--primary)" />
                  <span>{biz.address.street}, {biz.address.city}</span>
                </div>

                <p style={styles.bizDesc}>
                  {biz.description ? biz.description.substring(0, 110) + '...' : 'No description provided.'}
                </p>

                <div style={styles.cardFooter}>
                  <div style={styles.ratingSection}>
                    <Star size={16} color="var(--accent)" fill="var(--accent)" />
                    <span style={{ fontWeight: '600', color: 'white' }}>{biz.averageRating || '0.0'}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({biz.numReviews || 0} reviews)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button 
                      onClick={() => toggleFavorite(biz._id)} 
                      style={{ 
                        ...styles.saveBtn, // Reuse saveBtn style for alignment
                        color: user?.favoriteItems?.includes(biz._id) ? '#E01E5A' : 'var(--text-muted)' 
                      }}
                      title={user?.favoriteItems?.includes(biz._id) ? "Favorited" : "Favorite"}
                    >
                      <Heart size={20} fill={user?.favoriteItems?.includes(biz._id) ? '#E01E5A' : 'transparent'} />
                    </button>

                    <button 
                      onClick={() => toggleSave(biz._id)} 
                      style={{ 
                        ...styles.saveBtn, 
                        color: user?.savedItems?.includes(biz._id) ? 'var(--primary)' : 'var(--text-muted)' 
                      }}
                      title={user?.savedItems?.includes(biz._id) ? "Saved" : "Save"}
                    >
                      <Bookmark size={20} fill={user?.savedItems?.includes(biz._id) ? 'var(--primary)' : 'transparent'} />
                    </button>
                    <Link to={`/business/${biz._id}`} style={styles.viewBtn}>
                      View Details <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '40px auto', padding: '0 24px', display: 'flex', gap: '30px' },
  sidebar: { width: '280px', flexShrink: 0 },
  content: { flexGrow: 1 },
  filterCard: { padding: '20px' },
  filterTitle: { fontSize: '18px', marginBottom: '16px', color: 'white' },
  filterGroup: { marginBottom: '16px' },
  filterLabel: { display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' },
  select: { padding: '10px', background: 'rgba(255,255,255,0.03)', color: 'white' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', marginBottom: '24px' },
  searchInput: { flexGrow: 1, background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '16px' },
  listGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' },
  bizCard: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  bizTitle: { fontSize: '18px', fontWeight: 'bold' },
  categoryBadge: { fontSize: '12px', background: 'rgba(255, 94, 54, 0.1)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' },
  metaRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' },
  bizDesc: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: 'auto' },
  ratingSection: { display: 'flex', alignItems: 'center', gap: '6px' },
  viewBtn: { textDecoration: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' },
  saveBtn: { 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  }
};

export default Search;
