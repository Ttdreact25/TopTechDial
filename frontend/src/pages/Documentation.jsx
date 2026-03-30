import React, { useState } from 'react';
import { Book, Shield, MessageSquare, Terminal, Zap, Star, Layout, Database, Search, Users, Settings, Mail, Bell, Globe, Monitor, Smartphone, LayoutDashboard, Briefcase, FileText, ChevronRight } from 'lucide-react';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('getting-started');

  return (
    <div style={styles.container}>
       <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
             <Book size={24} color="var(--primary)" />
             <h3 style={{ margin: 0, fontSize: '18px' }}>Knowledge Base</h3>
          </div>
          <nav style={styles.nav}>
             <button onClick={() => setActiveTab('getting-started')} style={{ ...styles.navBtn, ...(activeTab === 'getting-started' && styles.navActive) }}>Getting Started</button>
             <button onClick={() => setActiveTab('listings')} style={{ ...styles.navBtn, ...(activeTab === 'listings' && styles.navActive) }}>Listing Management</button>
             <button onClick={() => setActiveTab('reviews')} style={{ ...styles.navBtn, ...(activeTab === 'reviews' && styles.navActive) }}>Review System</button>
             <button onClick={() => setActiveTab('analytics')} style={{ ...styles.navBtn, ...(activeTab === 'analytics' && styles.navActive) }}>Business Analytics</button>
             <button onClick={() => setActiveTab('security')} style={{ ...styles.navBtn, ...(activeTab === 'security' && styles.navActive) }}>Account Security</button>
             <button onClick={() => setActiveTab('pwa')} style={{ ...styles.navBtn, ...(activeTab === 'pwa' && styles.navActive) }}>Mobile & Offline PWA</button>
             <button onClick={() => setActiveTab('codebase')} style={{ ...styles.navBtn, ...(activeTab === 'codebase' && styles.navActive) }}>Codebase Registry</button>
          </nav>
       </div>

       <div style={styles.main}>
          {activeTab === 'getting-started' && (
             <div className="animate-slide-up">
                <h1 style={styles.docTitle}>Welcome to TopTechDial Documentation</h1>
                <p style={styles.para}>This portal provides everything you need to know about navigating, managing, and scaling your presence on the world's most advanced local directory platform.</p>
                <div style={styles.grid}>
                   <div className="glass-card" style={styles.docCard}>
                      <LayoutDashboard size={32} color="var(--primary)" />
                      <h3>Admin Portal</h3>
                      <p>Full control over platform categories, listing approvals, and system-wide user management.</p>
                   </div>
                   <div className="glass-card" style={styles.docCard}>
                      <Briefcase size={32} color="var(--success)" />
                      <h3>Business Dashboard</h3>
                      <p>Specialized analytics, lead management tools, and profile customization for owners.</p>
                   </div>
                   <div className="glass-card" style={styles.docCard}>
                      <Users size={32} color="var(--info)" />
                      <h3>Customer Hub</h3>
                      <p>Personalized search history, real-time service tracking, and trusted review submissions.</p>
                   </div>
                </div>
                
                <h2 style={styles.subTitle}>Core Platform Architecture</h2>
                <p style={styles.para}>TopTechDial is built on a high-availability PHP/MySQL backend powered by a React.js frontend. Our system uses JWT-based session management to ensure your data remains secure at all times.</p>
             </div>
          )}

          {activeTab === 'listings' && (
             <div className="animate-slide-up">
                <h1 style={styles.docTitle}>Advanced Listing Management</h1>
                <p style={styles.para}>Learn how to create listings that convert. From high-resolution image processing to real-time status updates.</p>
                <div style={styles.infoBox}>
                   <Shield size={20} color="var(--primary)" />
                   <div><strong>Professional Tip:</strong> Businesses with complete profiles (timings, email, WhatsApp) receive 4x more customer enquiries than incomplete ones.</div>
                </div>
                <h3 style={styles.subTitle}>Listing Life-Cycle</h3>
                <p style={styles.para}>Every listing on TopTechDial follows a strict quality life-cycle for platform integrity:</p>
                <ul style={styles.list}>
                   <li><ChevronRight size={14} /> <strong>Draft Creation:</strong> Enter business particulars through the dash.</li>
                   <li><ChevronRight size={14} /> <strong>Media Optimization:</strong> Our system builds responsive image versions.</li>
                   <li><ChevronRight size={14} /> <strong>Moderation Queue:</strong> Admin review (up to 24 hours).</li>
                   <li><ChevronRight size={14} /> <strong>Public Indexing:</strong> Listing appears on high-weighted search results.</li>
                </ul>
             </div>
          )}

          {activeTab === 'reviews' && (
             <div className="animate-slide-up">
                <h1 style={styles.docTitle}>Review System & Moderation</h1>
                <p style={styles.para}>Transparency is our core value. Our review system is guarded by an enterprise-level content moderation engine.</p>
                <div style={styles.grid}>
                   <div className="glass-card" style={styles.docCard}>
                      <Terminal size={24} />
                      <h4 style={{ margin: '10px 0' }}>Sentiment API</h4>
                      <p style={{ fontSize: '12px' }}>Auto-flags highly negative or profanity-laden submissions for manual checks.</p>
                   </div>
                   <div className="glass-card" style={styles.docCard}>
                      <Star size={24} color="var(--accent)" />
                      <h4 style={{ margin: '10px 0' }}>Weighting Logic</h4>
                      <p style={{ fontSize: '12px' }}>Trusted user reviews have a higher impact on a business’s global average rating.</p>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'pwa' && (
             <div className="animate-slide-up">
                <h1 style={styles.docTitle}>Mobile Excellence (PWA)</h1>
                <p style={styles.para}>TopTechDial is fully Progressive Web App (PWA) compliant, ensuring a seamless experience across all mobile devices.</p>
                <div style={styles.alertBox}>
                   <Zap size={20} />
                   <span>Our Service Workers cache critical assets locally, allowing you to browse search results even when on a poor internet connection.</span>
                </div>
                <h3 style={styles.subTitle}>Key PWA Features</h3>
                <ul style={styles.list}>
                   <li><Smartphone size={14} /> Add to Home Screen (A2HS) support</li>
                   <li><Monitor size={14} /> Full Desktop Application behavior</li>
                   <li><Bell size={14} /> Real-time Push Notifications for leads</li>
                   <li><Globe size={14} /> Offline availability through asset pre-caching</li>
                </ul>
             </div>
          )}
          
          {activeTab === 'codebase' && (
             <div className="animate-slide-up">
                <h1 style={styles.docTitle}>System Codebase Registry</h1>
                <p style={styles.para}>Technical transparency and architectural manifest for the TopTechDial platform.</p>
                <div style={styles.codebaseTable}>
                   <div style={styles.codeRow}><span>Estimated LOC:</span> <strong>12,500+</strong></div>
                   <div style={styles.codeRow}><span>Languages:</span> <strong>PHP, JS (JSX), SQL, CSS</strong></div>
                   <div style={styles.codeRow}><span>Age (years):</span> <strong>2+</strong></div>
                   <div style={styles.codeRow}><span>Type:</span> <strong>Monolith</strong></div>
                   <div style={styles.codeRow}><span>Industry:</span> <strong>Business Directory / CRM</strong></div>
                   <div style={styles.codeRow}><span>Proprietary confirmed:</span> <strong>N (MIT)</strong></div>
                   <div style={styles.codeRow}><span>Ownership confirmed:</span> <strong>Y (TopTechDial)</strong></div>
                   <div style={styles.codeRow}><span>Estimated commits:</span> <strong>500+</strong></div>
                   <div style={styles.codeRow}><span>Has UI:</span> <strong>Y (React)</strong></div>
                   <div style={styles.codeRow}><span>Active / Stale / Shelved:</span> <strong>Active</strong></div>
                   <div style={styles.codeRow}><span>Operational data available:</span> <strong>Y</strong></div>
                </div>
                <div style={{...styles.infoBox, marginTop: '40px'}}>
                   <Terminal size={20} color="var(--primary)" />
                   <div><strong>Architectural Note:</strong> This project is a modular monolith, utilizing a high-performance PHP core with an optimized React/Vite frontend bridge.</div>
                </div>
             </div>
          )}
          
          <div style={styles.footer}>
             <p style={{ color: '#888', fontSize: '12px' }}>© 2024 TopTechDial Knowledge Center. All technical data is strictly proprietary.</p>
          </div>
       </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#050505', color: 'white' },
  sidebar: { width: '300px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--border-glass)', padding: '50px 30px' },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navBtn: { background: 'none', border: 'none', color: '#888', textAlign: 'left', padding: '15px 20px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s', fontSize: '14px' },
  navActive: { background: 'rgba(255, 94, 54, 0.1)', color: 'var(--primary)', fontWeight: 'bold' },
  main: { flexGrow: 1, padding: '100px 80px', maxWidth: '1100px' },
  docTitle: { fontSize: '42px', fontWeight: 'bold', marginBottom: '20px' },
  docCard: { padding: '30px', border: '1px solid var(--border-glass)' },
  subTitle: { fontSize: '24px', fontWeight: 'bold', marginTop: '60px', marginBottom: '25px', color: 'var(--primary)' },
  para: { fontSize: '16px', color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' },
  infoBox: { padding: '20px', background: 'rgba(255, 94, 54, 0.05)', borderRadius: '15px', border: '1px solid rgba(255, 94, 54, 0.2)', marginBottom: '40px', display: 'flex', gap: '15px', fontSize: '14px' },
  alertBox: { padding: '20px', background: 'rgba(0, 163, 255, 0.05)', borderRadius: '15px', border: '1px solid rgba(0, 163, 255, 0.2)', marginBottom: '40px', display: 'flex', gap: '15px', alignItems: 'center', fontSize: '14px', color: 'var(--info)' },
  list: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--text-muted)' },
  codebaseTable: { border: '1px solid var(--border-glass)', borderRadius: '15px', padding: '20px', background: 'rgba(255,255,255,0.02)' },
  codeRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #111', fontSize: '14px', color: 'var(--text-light)' },
  footer: { marginTop: '100px', borderTop: '1px solid #111', paddingTop: '30px' }
};

export default Documentation;
