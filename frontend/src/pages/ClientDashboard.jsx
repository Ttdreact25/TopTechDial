import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  Plus, LayoutDashboard, Briefcase, FileText, Settings, Users, Search, 
  MessageSquare, TrendingUp, BarChart3, PieChart, ShieldCheck, 
  Calendar, MapPin, Star, MoreVertical, Edit2, Trash2, Bell, Globe, Zap
} from 'lucide-react';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total_views: 0, enquiries: 0, rating: 0 });

    const fetchClientData = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/businesses');
            if (data.success) {
                // Filter to show only owned businesses
                const filtered = data.data.filter(b => b.ownerId === user?._id);
                setMyListings(filtered);
                
                // Calculate aggregated stats
                const totalViews = filtered.reduce((acc, b) => acc + (b.views || 0), 0);
                const avgRating = filtered.length > 0 ? filtered.reduce((acc, b) => acc + (b.averageRating || 0), 0) / filtered.length : 0;
                
                setStats({
                  total_views: totalViews,
                  enquiries: Math.floor(totalViews * 0.05), // Simulated 5% lead rate
                  rating: avgRating.toFixed(1)
                });
            }
        } catch (err) {
            console.error('Failed to sync client dashboard', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientData();
    }, [user]);

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.sidebarBrand}>
                   <div style={styles.brandLogo}><Briefcase size={20} color="white" /></div>
                   <h3 style={{ margin: 0 }}>Business Core</h3>
                </div>
                <nav style={styles.nav}>
                   <button style={{ ...styles.navItem, ...styles.navActive }}><LayoutDashboard size={18} /> Dashboard</button>
                   <button style={styles.navItem}><Briefcase size={18} /> My Listings</button>
                   <button style={styles.navItem}><MessageSquare size={18} /> Leads & Enquiry</button>
                   <button style={styles.navItem}><BarChart3 size={18} /> Detailed Analytics</button>
                   <button style={styles.navItem}><FileText size={18} /> Review Moderation</button>
                </nav>
            </div>

            <div style={styles.main}>
                <header style={styles.header}>
                    <div style={styles.headerLeft}>
                        <h1 style={{ fontSize: '32px', color: 'white' }}>Enterprise Hub</h1>
                        <p style={{ color: '#878686' }}>Management suite for <span style={{ color: 'var(--primary)' }}>{user?.name}'s</span> verified agencies.</p>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '12px 25px' }}>
                        <Plus size={20} /> Register New Business
                    </button>
                </header>

                <div style={styles.statsGrid}>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={styles.statIcon}><BarChart3 size={24} color="var(--primary)" /></div>
                        <div>
                            <div style={styles.statLabel}>Lifetime Views</div>
                            <div style={styles.statValue}>{stats.total_views}</div>
                        </div>
                        <div style={styles.trendUp}>+12.5%</div>
                    </div>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={{ ...styles.statIcon, background: 'rgba(2, 162, 255, 0.1)' }}><Users size={24} color="var(--info)" /></div>
                        <div>
                            <div style={styles.statLabel}>Total Leads</div>
                            <div style={styles.statValue}>{stats.enquiries}</div>
                        </div>
                        <div style={styles.trendUp}>+4.8%</div>
                    </div>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={{ ...styles.statIcon, background: 'rgba(255, 179, 0, 0.1)' }}><Star size={24} color="var(--accent)" /></div>
                        <div>
                            <div style={styles.statLabel}>Trust Score</div>
                            <div style={styles.statValue}>{stats.rating}</div>
                        </div>
                        <div style={styles.ratingBadge}>Elite Status</div>
                    </div>
                </div>

                <div style={styles.splitRow}>
                    <div className="glass-card" style={styles.listingSection}>
                        <div style={styles.sectionHeader}>
                            <h3 style={{ fontSize: '20px', margin: 0, color: 'white' }}>Active Listing Inventory</h3>
                            <div style={{ fontSize: '13px', color: '#929191' }}>Total: {myListings.length} Active</div>
                        </div>
                        <div style={styles.listingList}>
                           {myListings.length > 0 ? myListings.map((list) => (
                             <div key={list._id} style={styles.listingItem}>
                                <div style={styles.listingImg}>
                                   {list.images && list.images.length > 0 ? (
                                     <img src={list.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                   ) : <PieChart size={24} color="gray" />}
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <h4 style={{ margin: 0, fontSize: '17px', color: 'white' }}>{list.title}</h4>
                                      {list.isApproved && <ShieldCheck size={16} color="var(--success)" />}
                                   </div>
                                   <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{list.category} • {list.city}</div>
                                </div>
                                <div style={styles.listingStatGrid}>
                                   <div style={styles.lStat}><div style={styles.lStatVal}>{list.views || 0}</div><div style={styles.lStatName}>Views</div></div>
                                   <div style={styles.lStat}><div style={styles.lStatVal}>{list.reviewCount || 0}</div><div style={styles.lStatName}>Reviews</div></div>
                                </div>
                                <div style={styles.listingActions}>
                                   <button style={styles.roundAction}><Edit2 size={16} /></button>
                                   <button style={styles.roundAction}><MoreVertical size={16} /></button>
                                </div>
                             </div>
                           )) : (
                             <div style={{ textAlign: 'center', padding: '60px' }}>
                                <Briefcase size={48} color="#222" style={{ marginBottom: '20px' }} />
                                <h4>No Registered Businesses</h4>
                                <p style={{ fontSize: '14px', color: '#888' }}>You haven't added any listings to your portfolio yet. Start growing your local brand today.</p>
                             </div>
                           )}
                        </div>
                    </div>

                    <div style={styles.analyticsWidget}>
                        <div className="glass-card" style={styles.growthCard}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h4 style={{ margin: 0 }}>Growth Forecast</h4>
                              <TrendingUp size={20} color="var(--success)" />
                           </div>
                           <p style={{ fontSize: '12px', color: '#929191', marginTop: '10px' }}>Based on recent organic search traffic patterns.</p>
                           <div style={styles.simulatedGraph}>
                              {[40, 65, 55, 90, 80, 100, 120].map((h, i) => (
                                <div key={i} style={{ ...styles.graphBar, height: `${h}px` }} />
                              ))}
                           </div>
                        </div>

                        <div className="glass-card" style={{ padding: '25px', marginTop: '20px' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                              <h4 style={{ margin: 0 }}>System Notifications</h4>
                              <Bell size={18} color="var(--primary)" />
                           </div>
                           <div style={styles.notifItem}>
                              <div style={styles.notifDot}></div>
                              <div style={{ fontSize: '12px' }}>Your listing 'Elite Catering' has been verified by the admin team.</div>
                           </div>
                           <div style={styles.notifItem}>
                              <div style={styles.notifDot}></div>
                              <div style={{ fontSize: '12px' }}>New review received from 'Ananya S.' for your listed agency.</div>
                           </div>
                        </div>

                        <div className="glass-card" style={{ padding: '25px', marginTop: '20px' }}>
                           <h3 style={{ margin: 0 }}>Active Enquiries</h3>
                           <div style={styles.enquiryBrief}>
                              <div style={styles.eAvatar}>R</div>
                              <div style={{ flexGrow: 1 }}>
                                 <div style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>Rajesh Kumar</div>
                                 <div style={{ fontSize: '11px', color: '#8d8c8c' }}>Enquiry for Web Development Services</div>
                              </div>
                              <div style={{ fontSize: '10px', color: 'var(--primary)' }}>2m ago</div>
                           </div>
                           <button style={{ width: '100%', background: 'none', border: '1px solid #333', color: '#888', borderRadius: '10px', padding: '12px', marginTop: '20px', fontSize: '12px', cursor: 'pointer' }}>View Unified Lead Center</button>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ marginTop: '40px', padding: '40px', border: '1px dashed var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                            <h3 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold' }}>Enterprise Business Growth Toolkit</h3>
                            <p style={{ color: '#8f8e8e', fontSize: '14px', marginTop: '5px' }}>Strategic extensions and AI-driven insights to amplify your brand's reach across the TopTechDial platform ecosystem.</p>
                        </div>
                        <button className="btn btn-secondary">Explore Expert Toolkit</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                         <div className="glass-card" style={styles.toolItem}>
                            <Globe size={24} color="var(--info)" />
                            <div style={{ fontWeight: 'bold', color: 'white' }}>Regional Reach</div>
                            <div style={{ fontSize: '10px' }}>Expand Listing Visibility</div>
                         </div>
                         <div className="glass-card" style={styles.toolItem}>
                            <TrendingUp size={24} color="var(--success)" />
                            <div style={{ fontWeight: 'bold', color: 'white' }}>Ad Campaigns</div>
                            <div style={{ fontSize: '10px' }}>Priority Search Ranking</div>
                         </div>
                         <div className="glass-card" style={styles.toolItem}>
                            <Users size={24} color="var(--accent)" />
                            <div style={{ fontWeight: 'bold', color: 'white' }}>Identity Verify</div>
                            <div style={{ fontSize: '10px' }}>Premium Verified Badge</div>
                         </div>
                         <div className="glass-card" style={styles.toolItem}>
                            <Settings size={24} color="var(--primary)" />
                            <div style={{ fontWeight: 'bold', color: 'white' }}>API Connect</div>
                            <div style={{ fontSize: '10px' }}>CRM External Sync</div>
                         </div>
                    </div>
                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #111', fontSize: '12px', color: '#555', textAlign: 'center' }}>
                         All professional tools are governed by the Enterprise Service Level Agreement. Activation requires account verification.
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#050505', color: 'white' },
    sidebar: { width: '280px', background: 'rgba(255,255,255,0.01)', borderRight: '1px solid #1a1a1a', padding: '40px 20px' },
    sidebarBrand: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '60px' },
    brandLogo: { width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    nav: { display: 'flex', flexDirection: 'column', gap: '5px' },
    navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', borderRadius: '15px', color: '#666', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s', fontSize: '14px' },
    navActive: { background: 'rgba(255, 94, 54, 0.08)', color: 'white', fontWeight: 'bold', border: '1px solid rgba(255, 94, 54, 0.1)' },
    main: { flexGrow: 1, padding: '60px', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' },
    headerLeft: { display: 'flex', flexDirection: 'column', gap: '5px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' },
    statCard: { padding: '30px', display: 'flex', gap: '20px', alignItems: 'center', position: 'relative' },
    statIcon: { width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(255, 94, 54, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statLabel: { fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' },
    statValue: { fontSize: '32px', fontWeight: '900', color: 'white' },
    trendUp: { position: 'absolute', top: '20px', right: '20px', fontSize: '11px', color: 'var(--success)', background: 'rgba(0, 211, 75, 0.1)', padding: '4px 10px', borderRadius: '20px' },
    ratingBadge: { position: 'absolute', top: '20px', right: '20px', fontSize: '11px', color: 'var(--accent)', background: 'rgba(255, 179, 0, 0.1)', padding: '4px 10px', borderRadius: '20px' },
    splitRow: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' },
    listingSection: { padding: '30px' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #1a1a1a' },
    listingList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    listingItem: { padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' },
    listingImg: { width: '60px', height: '60px', borderRadius: '10px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    listingStatGrid: { display: 'flex', gap: '25px', padding: '0 20px' },
    lStat: { textAlign: 'center' },
    lStatVal: { fontSize: '15px', fontWeight: 'bold' },
    lStatName: { fontSize: '10px', color: '#555' },
    listingActions: { display: 'flex', gap: '10px' },
    roundAction: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    growthCard: { padding: '30px', background: 'linear-gradient(180deg, rgba(0, 211, 75, 0.05) 0%, transparent 100%)' },
    simulatedGraph: { height: '150px', display: 'flex', alignItems: 'flex-end', gap: '10px', marginTop: '30px', paddingBottom: '20px', borderBottom: '1px solid #1a1a1a' },
    graphBar: { width: '25px', background: 'var(--success)', borderRadius: '5px 5px 0 0', opacity: 0.6, cursor: 'pointer', transition: 'all 0.3s' },
    enquiryBrief: { marginTop: '25px', display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' },
    eAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' },
    notifItem: { display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' },
    notifDot: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '5px' },
    toolItem: { padding: '25px 15px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'center', fontSize: '12px', color: '#888', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', border: '1px solid var(--border-glass)', transition: 'all 0.3s' }
};

export default ClientDashboard;
