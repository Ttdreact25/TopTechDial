import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Search as SearchIcon, MapPin, Briefcase, ShoppingBag, Heart, Coffee, Shield, Mic } from 'lucide-react';

const categories = [
  { name: 'Hotel & Travel', icon: Coffee, color: '#FF5E36' },
  { name: 'Business', icon: Briefcase, color: '#FFB300' },
  { name: 'Shopping', icon: ShoppingBag, color: '#00D34B' },
  { name: 'Health & Medical', icon: Heart, color: '#cb3b69ff' },
  { name: 'Insurance & Law', icon: Shield, color: '#2A85FF' },
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();

  useEffect(() => {
    if (user?.role === 'staff' || user?.role === 'admin' || user?.role === 'business_owner') {
      navigate('/dashboard/admin');
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/search?keyword=${search}&city=${city}`);
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
           {t('heroTitle_1')} {' '}
           <span style={{ color: 'var(--primary)' }}>{t('heroTitle_2')}</span><br/>
           <span style={{ color: '#2d65a1' }}>{t('heroTitle_3')}</span>
        </h1>

        <div style={styles.searchContainer}>
          <form onSubmit={handleSearch} style={styles.searchBox}>
            <div style={styles.locationWrapper}>
              <MapPin size={22} style={styles.searchIcon} />
              <input 
                type="text" 
                placeholder={t('searchCityPlaceholder')} 
                style={styles.input} 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
              />
            </div>
            
            <div style={styles.divider}></div>

            <div style={styles.queryWrapper}>
              <input 
                type="text" 
                placeholder={t('searchQueryPlaceholder')} 
                style={styles.input} 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <div style={styles.actionIcons}>
                 <Mic size={20} color="#008cff" style={{ cursor: 'pointer' }} />
                 <button type="submit" style={styles.searchBtn}>
                    <SearchIcon size={22} color="white" />
                 </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section style={styles.categories}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
           <h2 style={styles.secTitle}>{t('categories')}</h2>
           <span style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>{t('viewAll')} →</span>
        </div>
        <div style={styles.grid}>
          {categories.map((cat, idx) => (
            <div key={idx} className="glass-card" style={styles.catCard} onClick={() => { if (!user) navigate('/login'); else navigate(`/search?category=${cat.name}`); }}>
              <div style={{ ...styles.iconWrapper, background: cat.color + '20', color: cat.color }}>
                <cat.icon size={28} />
              </div>
              <h4 style={{ marginTop: '16px', fontSize: '16px', fontWeight: '600' }}>{cat.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Explore 100+ listings</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '80px',
    background: 'rgb(17, 17, 32)',
    minHeight: '100vh',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '120px 24px 80px 24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    fontSize: '56px',
    fontWeight: '800',
    marginBottom: '60px',
    lineHeight: '1.2',
    color: 'white',
    letterSpacing: '-1px',
  },
  searchContainer: {
    width: '100%',
    maxWidth: '900px',
    perspective: '1000px',
  },
  searchBox: {
    display: 'flex',
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '4px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    alignItems: 'center',
    height: '68px',
  },
  locationWrapper: {
    flex: '1.2',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 20px',
  },
  divider: {
    width: '1px',
    height: '35px',
    background: '#EAEAEA',
  },
  queryWrapper: {
    flex: '2.5',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 20px',
  },
  searchIcon: {
    color: '#757575',
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: '#212121',
    width: '100%',
    outline: 'none',
    fontSize: '17px',
    fontWeight: '400',
  },
  actionIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  searchBtn: {
    background: '#FF5E36',
    border: 'none',
    borderRadius: '12px',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 16px rgba(255, 94, 54, 0.3)',
    transition: 'transform 0.2s',
  },
  categories: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  secTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
  },
  catCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center',
    padding: '32px 20px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  iconWrapper: {
    width: '70px',
    height: '70px',
    borderRadius: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
};

export default Home;
