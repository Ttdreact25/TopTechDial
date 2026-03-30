import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

// Subcomponents for the detailed business view
import BusinessGallery from '../components/business/BusinessGallery';
import BusinessReviews from '../components/business/BusinessReviews';
import BusinessActionPanel from '../components/business/BusinessActionPanel';
import { MessageSquare, ArrowRight, User, TrendingUp, Search, Calendar, ShieldCheck, MapPin, Star, Building, Globe, Mail, Phone, WhatsApp, ArrowLeft, CheckCircle2, Zap, Award } from 'lucide-react';

const BusinessDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const [bizRes, reviewsRes] = await Promise.all([
        API.get(`/business?id=${id}`),
        API.get(`/reviews?business_id=${id}`)
      ]);
      
      if (bizRes.data.success) {
        setBusiness(bizRes.data.data);
        
        // Fetch related businesses by category
        const relRes = await API.get(`/businesses?category=${bizRes.data.data.category}`);
        if (relRes.data.success) {
          setRelated(relRes.data.data.filter(b => b._id !== id).slice(0, 4));
        }

        // Potential Owner/Admin: Fetch analytics
        if (user && (user._id === bizRes.data.data.ownerId || user.role === 'business_owner')) {
          const analyticsRes = await API.get(`/analytics?id=${id}`);
          if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
        }
      }
      
      if (reviewsRes.data.success) setReviews(reviewsRes.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch business details');
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, user]);

  if (loading) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>
      <div className="spinner">Analysing Directory...</div>
    </div>
  );

  if (!business) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'var(--danger)' }}>
      {error || 'Business not found'}
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Background Decor */}
      <div style={styles.blurBg} />

      <div style={styles.content}>
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          style={styles.backBtn}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateX(-5px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
        >
          <ArrowLeft size={18} /> Back to Directory
        </button>

        <div style={styles.grid}>
          {/* Main Info Column */}
          <div style={styles.mainCol}>
            <BusinessGallery images={business.images} businessTitle={business.title} />

            <div style={{ marginTop: '50px' }}>
              <h2 style={{ fontSize: '30px', marginBottom: '20px', color: 'white' }}>About this business</h2>
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-light)', whiteSpace: 'pre-wrap' }}>
                {business.description || 'No description provided by the business owner.'}
              </p>
            </div>

            <div style={styles.detailsGrid}>
               <div className="glass-card" style={styles.detailCard}>
                  <Building size={20} color="var(--primary)" />
                  <div>
                    <span style={styles.detailLabel}>Company Type</span>
                    <p style={styles.detailText}>{business.category} Specialists</p>
                  </div>
               </div>
               <div className="glass-card" style={styles.detailCard}>
                  <MapPin size={20} color="var(--success)" />
                  <div>
                    <span style={styles.detailLabel}>Location Area</span>
                    <p style={styles.detailText}>{business.address?.city}, {business.address?.state}</p>
                  </div>
               </div>
               <div className="glass-card" style={styles.detailCard}>
                  <ShieldCheck size={20} color="var(--accent)" />
                  <div>
                    <span style={styles.detailLabel}>Authentication</span>
                    <p style={styles.detailText}>Platform Verified Partner</p>
                  </div>
               </div>
            </div>

            {/* Premium Highlights */}
            <div style={{ marginTop: '50px' }}>
              <h3 style={{ fontSize: '20px', color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={20} color="var(--primary)" /> Why Choose {business.title}?
              </h3>
              <div style={styles.highlightsGrid}>
                  <div style={styles.highlightItem}>
                      <div style={styles.highlightIcon}><CheckCircle2 size={24} color="var(--success)" /></div>
                      <div>
                          <h4 style={styles.highlightTitle}>Verified Quality</h4>
                          <p style={styles.highlightDesc}>This business has undergone our rigorous 12-point authentication process.</p>
                      </div>
                  </div>
                  <div style={styles.highlightItem}>
                      <div style={styles.highlightIcon}><Zap size={24} color="var(--accent)" /></div>
                      <div>
                          <h4 style={styles.highlightTitle}>Fast Response</h4>
                          <p style={styles.highlightDesc}>Typical response time is under 2 hours for all business enquiries.</p>
                      </div>
                  </div>
                  <div style={styles.highlightItem}>
                      <div style={styles.highlightIcon}><Award size={24} color="var(--primary)" /></div>
                      <div>
                          <h4 style={styles.highlightTitle}>Expert Team</h4>
                          <p style={styles.highlightDesc}>Staff members are certified professionals in the {business.category} industry.</p>
                      </div>
                  </div>
              </div>
            </div>

            {/* Performance Analytics (Owner Only) */}
            {analytics && (
              <div className="glass-card" style={styles.analyticsSection}>
                <div style={styles.analyticsHeader}>
                  <h3 style={{ fontSize: '18px', color: 'white', margin: 0 }}>Listing Performance (Owner Only)</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time Statistics</div>
                </div>
                <div style={styles.analyticsStats}>
                   <div style={styles.statBox}>
                      <div style={styles.statValue}>{analytics.summary.totalViews}</div>
                      <div style={styles.statLabel}>Lifetime Views</div>
                   </div>
                   <div style={styles.statBox}>
                      <div style={styles.statValue}>{analytics.summary.totalLeads}</div>
                      <div style={styles.statLabel}>Total Leads</div>
                   </div>
                   <div style={styles.statBox}>
                      <div style={styles.statValue}>{analytics.summary.conversionRate}%</div>
                      <div style={styles.statLabel}>Conversion Ratio</div>
                   </div>
                </div>
                <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Insights based on visitor behavior from the last 30 days.
                </p>
              </div>
            )}

            <BusinessReviews 
              reviews={reviews} 
              businessId={id} 
              user={user} 
              onReviewAdded={fetchBusinessData} 
            />
          </div>

          {/* Sticky Action Panel Column */}
          <div style={styles.sideCol}>
            <BusinessActionPanel business={business} user={user} />

            <div style={{ marginTop: '40px' }}>
                <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>Similar Businesses</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {related.length > 0 ? related.map((r) => (
                      <div 
                        key={r._id} 
                        className="glass-card" 
                        onClick={() => navigate(`/business/${r._id}`)}
                        style={{ padding: '15px', cursor: 'pointer', display: 'flex', gap: '15px', alignItems: 'center' }}
                      >
                         <div style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', background: '#333' }}>
                            {r.images && r.images.length > 0 ? (
                              <img src={r.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : <Building color="gray" size={24} style={{ margin: '18px' }} />}
                         </div>
                         <div style={{ flexGrow: 1 }}>
                            <h5 style={{ margin: 0, fontSize: '14px', color: 'white' }}>{r.title}</h5>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                               <MapPin size={10} /> {r.city} • <Star size={10} fill="var(--accent)" /> {r.averageRating || '4.5'}
                            </div>
                         </div>
                         <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    )) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No similar businesses found in this category.</p>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#050505', color: 'white', position: 'relative', overflowX: 'hidden' },
  blurBg: { position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255, 94, 54, 0.08) 0%, transparent 70%)', zIndex: 0 },
  content: { maxWidth: '1400px', margin: '0 auto', padding: '120px 40px', position: 'relative', zIndex: 1 },
  grid: { display: 'flex', gap: '60px', alignItems: 'flex-start' },
  mainCol: { width: '65%', minWidth: '0' },
  sideCol: { width: '35%', position: 'sticky', top: '100px' },
  
  detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '40px' },
  detailCard: { padding: '20px', display: 'flex', gap: '15px', alignItems: 'center' },
  detailLabel: { fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' },
  detailText: { fontWeight: 'bold', fontSize: '14px', color: 'white', margin: 0 },
  
  analyticsSection: { marginTop: '50px', padding: '30px', border: '1px dashed rgba(255,255,255,0.1)' },
  analyticsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' },
  analyticsStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' },
  statBox: { padding: '15px' },
  statValue: { fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '5px' },
  statLabel: { fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' },

  backBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer', marginBottom: '30px', transition: 'all 0.3s ease', outline: 'none' },
  highlightsGrid: { display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' },
  highlightItem: { display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '20px', borderRadius: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' },
  highlightIcon: { background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' },
  highlightTitle: { margin: '0 0 5px 0', fontSize: '16px', color: 'white' },
  highlightDesc: { margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }
};

export default BusinessDetails;
