import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { LayoutDashboard, Briefcase, CheckCircle, Clock, TrendingUp, Search, MessageSquare, Target, Zap, AlertTriangle, User, History } from 'lucide-react';

const StaffPortal = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ approved: 0, pending: 0, reviews_moderated: 0 });
    const [activeListings, setActiveListings] = useState([]);
    const [setLoading] = useState(true);

    const fetchStaffData = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/businesses/all-listings?role=staff');
            if (data.success) {
                setActiveListings(data.data.slice(0, 10));
                
                // Calculate simulated performance stats
                const approvedCount = data.data.filter(b => b.is_approved).length;
                setStats({
                   approved: approvedCount,
                   pending: data.data.length - approvedCount,
                   reviews_moderated: Math.floor(Math.random() * 50) + 10
                });
            }
        } catch (err) {
            console.error('Failed to sync staff portal data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffData();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.brand}>
                    <div style={styles.brandIcon}><Zap size={20} color="white" /></div>
                    <h3 style={{ margin: 0 }}>Staff Portal</h3>
                </div>
                <nav style={styles.nav}>
                    <button style={{ ...styles.navItem, ...styles.navActive }}><LayoutDashboard size={18} /> Daily Tasks</button>
                    <button style={styles.navItem}><Briefcase size={18} /> Review Queue</button>
                    <button style={styles.navItem}><History size={18} /> My Activity</button>
                    <button style={styles.navItem}><Target size={18} /> Performance Targets</button>
                </nav>
            </div>

            <div style={styles.main}>
                <header style={styles.header}>
                    <div>
                        <h1 style={{ fontSize: '28px', color: 'white' }}>Welcome Back, {user?.name.split(' ')[0]}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>You have <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{stats.pending} listings</span> awaiting your moderation today.</p>
                    </div>
                    <div style={styles.userBadge}>
                        <div style={styles.badgeLabel}>Staff Rank</div>
                        <div style={styles.badgeValue}>Strategic Hub Senior Moderator</div>
                    </div>
                </header>

                <div style={styles.statsGrid}>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={{ ...styles.iconBox, background: 'rgba(0, 211, 75, 0.1)' }}><CheckCircle size={24} color="var(--success)" /></div>
                        <div>
                            <div style={styles.statVal}>{stats.approved}</div>
                            <div style={styles.statName}>Approved Today</div>
                        </div>
                    </div>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={{ ...styles.iconBox, background: 'rgba(255, 94, 54, 0.1)' }}><Clock size={24} color="var(--primary)" /></div>
                        <div>
                            <div style={styles.statVal}>{stats.pending}</div>
                            <div style={styles.statName}>Pending Review</div>
                        </div>
                    </div>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={{ ...styles.iconBox, background: 'rgba(0, 163, 255, 0.1)' }}><MessageSquare size={24} color="var(--info)" /></div>
                        <div>
                            <div style={styles.statVal}>{stats.reviews_moderated}</div>
                            <div style={styles.statName}>Reviews Screened</div>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={styles.actionSection}>
                    <div style={styles.sectionHeader}>
                        <h3 style={{ fontSize: '18px', margin: 0 }}>Active Task Assignment</h3>
                        <button className="btn btn-secondary" style={{ fontSize: '11px' }}>Refresh Queue</button>
                    </div>
                    <div style={styles.taskList}>
                        {activeListings.map((list) => (
                           <div key={list._id} style={styles.taskItem}>
                               <div style={styles.taskIcon}><Briefcase size={18} color="gray" /></div>
                               <div style={{ flexGrow: 1 }}>
                                   <h5 style={{ margin: 0, color: 'white' }}>{list.title}</h5>
                                   <div style={{ fontSize: '11px', color: '#666' }}>Submitted from {list.city} • New Business Registration</div>
                               </div>
                               <div style={styles.taskStatus}>Awaiting Response</div>
                               <button className="btn btn-primary" style={{ padding: '6px 15px', fontSize: '12px' }}>Verify Data</button>
                           </div>
                        ))}
                    </div>
                </div>

                <div style={styles.footerInfo}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                         <AlertTriangle size={16} color="orange" />
                         <span>All operations on the staff portal are strictly audited by the TopTechDial security system.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: 'white' },
    sidebar: { width: '280px', background: '#111', borderRight: '1px solid #222', padding: '40px 20px' },
    brand: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '40px' },
    brandIcon: { width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    nav: { display: 'flex', flexDirection: 'column', gap: '5px' },
    navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '10px', color: '#888', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s', fontSize: '14px' },
    navActive: { color: 'var(--primary)', background: 'rgba(251, 94, 55, 0.05)' },
    main: { flexGrow: 1, padding: '60px', maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    userBadge: { textAlign: 'right' },
    badgeLabel: { fontSize: '11px', color: '#888', textTransform: 'uppercase' },
    badgeValue: { color: 'var(--primary)', fontStyle: 'italic', fontSize: '14px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' },
    statCard: { padding: '25px', display: 'flex', gap: '20px', alignItems: 'center' },
    iconBox: { width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statVal: { fontSize: '28px', fontWeight: 'bold', margin: 0 },
    statName: { fontSize: '12px', color: '#888' },
    actionSection: { padding: '30px' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    taskList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    taskItem: { display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' },
    taskIcon: { width: '40px', height: '40px', borderRadius: '10px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    taskStatus: { background: 'rgba(255, 179, 0, 0.1)', color: 'orange', padding: '4px 12px', borderRadius: '20px', fontSize: '11px' },
    footerInfo: { marginTop: '60px', color: '#555', fontSize: '12px', borderTop: '1px solid #222', paddingTop: '20px' }
};

export default StaffPortal;
