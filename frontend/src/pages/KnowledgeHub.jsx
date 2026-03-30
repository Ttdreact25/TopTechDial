import React, { useState } from 'react';
import { Book, Shield, Zap, Search, HelpCircle, FileText, ChevronRight, Layout, Globe, Star, Users, Settings, Mail, Bell, Monitor, Smartphone, LayoutDashboard, Briefcase, Info, AlertTriangle, CheckCircle, Database, Terminal, Code } from 'lucide-react';

const KnowledgeHub = () => {
    const [activeSection, setActiveSection] = useState('getting-started');

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <div style={styles.iconBox}><Book size={24} color="var(--primary)" /></div>
                    <h3 style={{ margin: 0 }}>Master Knowledge Hub</h3>
                </div>
                <nav style={styles.nav}>
                    <button onClick={() => setActiveSection('getting-started')} style={{ ...styles.navBtn, ...(activeSection === 'getting-started' && styles.navActive) }}><Globe size={18} /> Getting Started</button>
                    <button onClick={() => setActiveSection('business')} style={{ ...styles.navBtn, ...(activeSection === 'business' && styles.navActive) }}><Briefcase size={18} /> Business Onboarding</button>
                    <button onClick={() => setActiveSection('api')} style={{ ...styles.navBtn, ...(activeSection === 'api' && styles.navActive) }}><Terminal size={18} /> Technical API Docs</button>
                    <button onClick={() => setActiveSection('erp')} style={{ ...styles.navBtn, ...(activeSection === 'erp' && styles.navActive) }}><Database size={18} /> ERP Integration</button>
                    <button onClick={() => setActiveSection('content')} style={{ ...styles.navBtn, ...(activeSection === 'content' && styles.navActive) }}><FileText size={18} /> Content Moderation</button>
                    <button onClick={() => setActiveSection('compliance')} style={{ ...styles.navBtn, ...(activeSection === 'compliance' && styles.navActive) }}><Shield size={18} /> Compliance & Privacy</button>
                    <button onClick={() => setActiveSection('faq')} style={{ ...styles.navBtn, ...(activeSection === 'faq' && styles.navActive) }}><HelpCircle size={18} /> Community FAQ</button>
                </nav>
            </div>

            <div style={styles.main}>
                {activeSection === 'getting-started' && (
                  <div className="animate-slide-up">
                      <h1 style={styles.title}>Global Platform Governance</h1>
                      <p style={styles.para}>TopTechDial is a next-generation business discovery platform built to connect high-quality local service providers with customers through a verified directory.</p>
                      <div className="glass-card" style={styles.infoBox}>
                          <Info size={24} color="var(--primary)" />
                          <div><strong>Unified Mission:</strong> Our goal is to empower local communities with professional tools to discover, engage, and grow.</div>
                      </div>
                      <h3 style={styles.subTitle}>Platform Overview</h3>
                      <p style={styles.para}>We implement a hybrid architecture that ensures lightning-fast performance while maintaining strict data integrity markers. Every interaction on the platform is logged and audited to provide a secure environment for all users.</p>
                  </div>
                )}

                {activeSection === 'business' && (
                  <div className="animate-slide-up">
                      <h1 style={styles.title}>Strategic Business Onboarding</h1>
                      <div style={styles.stepGrid}>
                          {[
                            { step: 1, title: 'Identity Registration', desc: 'Securely create your business owner account and verify your email.' },
                            { step: 2, title: 'Profile Construction', desc: 'Add detailed metadata, including high-resolution media and categories.' },
                            { step: 3, title: 'Moderation Audit', desc: 'Admin staff will verify your business status within 24-48 hours.' },
                            { step: 4, title: 'Public Indexing', desc: 'Once approved, your listing is live and indexed for global search.' }
                          ].map(s => (
                            <div key={s.step} className="glass-card" style={styles.stepCard}>
                                <div style={styles.stepNum}>{s.step}</div>
                                <h4>{s.title}</h4>
                                <p style={{ fontSize: '13px', color: '#888' }}>{s.desc}</p>
                            </div>
                          ))}
                      </div>
                  </div>
                )}

                {activeSection === 'api' && (
                  <div className="animate-slide-up">
                      <h1 style={styles.title}>Technical API Reference</h1>
                      <p style={styles.para}>Developers can integrate with the TopTechDial REST API to automate service discovery and lead management.</p>
                      <div className="glass-card" style={styles.codeBlock}>
                          <div style={styles.codeHeader}><Code size={14} /> GET /api/businesses?city=Mumbai</div>
                          <code style={{ fontSize: '13px', color: '#ccc' }}>
                             {'{ "success": true, "data": [{ "title": "Elite Services", "rating": 4.9 }] }'}
                          </code>
                      </div>
                      <div className="glass-card" style={styles.codeBlock}>
                          <div style={styles.codeHeader}><Code size={14} /> POST /api/leads</div>
                          <code style={{ fontSize: '13px', color: '#ccc' }}>
                             {'{ "customer_email": "user@example.com", "business_id": 42, "source": "API" }'}
                          </code>
                      </div>
                  </div>
                )}

                {activeSection === 'erp' && (
                  <div className="animate-slide-up">
                      <h1 style={styles.title}>Enterprise Resource Planning (ERP)</h1>
                      <p style={styles.para}>The TopTechDial ERP Core framework enables complex business operations within the platform.</p>
                      <div style={styles.grid}>
                          <div className="glass-card" style={styles.erpCard}>
                             <Users size={24} color="var(--primary)" />
                             <h4>Master CRM</h4>
                             <p style={{ fontSize: '12px', color: '#888' }}>Strategic lead funnel and conversion tracking.</p>
                          </div>
                          <div className="glass-card" style={styles.erpCard}>
                             <Zap size={24} color="var(--success)" />
                             <h4>HR Performance</h4>
                             <div style={{ fontSize: '12px', color: '#888' }}>Staff benchmarking and rank management.</div>
                          </div>
                          <div className="glass-card" style={styles.erpCard}>
                             <Database size={24} color="var(--accent)" />
                             <h4>Asset Inventory</h4>
                             <div style={{ fontSize: '12px', color: '#888' }}>High-resolution media and listing auditing.</div>
                          </div>
                          <div className="glass-card" style={styles.erpCard}>
                             <Settings size={24} color="var(--info)" />
                             <h4>Billing Cycles</h4>
                             <div style={{ fontSize: '12px', color: '#888' }}>Automated invoicing and payment bridging.</div>
                          </div>
                      </div>
                  </div>
                )}

                {activeSection === 'compliance' && (
                  <div className="animate-slide-up">
                      <h1 style={styles.title}>Verification & Legal Compliance</h1>
                      <div className="glass-card" style={styles.alertBox}>
                          <Shield size={32} color="var(--primary)" />
                          <div>
                              <h4>GDPR & Privacy Standards</h4>
                              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>All personally identifiable information (PII) is encrypted and processed in accordance with global data protection regulations. Users can request a full metadata export or permanent account purge at any time.</p>
                          </div>
                      </div>
                      <div style={styles.complianceGrid}>
                          <div style={styles.complianceItem}><CheckCircle size={14} color="var(--success)" /> Encryption: TLS 1.3</div>
                          <div style={styles.complianceItem}><CheckCircle size={14} color="var(--success)" /> Auth: JWT HS256</div>
                          <div style={styles.complianceItem}><CheckCircle size={14} color="var(--success)" /> Storage: AES-256 (Media)</div>
                          <div style={styles.complianceItem}><CheckCircle size={14} color="var(--success)" /> Auditing: ISO Standard Logs</div>
                      </div>
                  </div>
                )}

                {activeSection === 'faq' && (
                  <div className="animate-slide-up">
                      <h1 style={styles.title}>Community Knowledge Base</h1>
                      <div style={styles.faqList}>
                          {[
                            { q: 'How do I become a verified business?', a: 'Verification requires submission of regional business registration documents for moderator audit.' },
                            { q: 'Is TopTechDial free for customers?', a: 'Yes, searching and discovering services is 100% free for all consumers.' },
                            { q: 'Can I manage multiple entities?', a: 'Yes, business owners can manage thousands of listings from a single master dashboard.' },
                            { q: 'How is search relevance calculated?', a: 'Our weighted algorithm considers rating, city proximity, and historical engagement density.' }
                          ].map((faq, i) => (
                             <div key={i} className="glass-card" style={styles.faqItem}>
                                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Q: {faq.q}</div>
                                <div style={{ color: '#888', fontSize: '14px' }}>A: {faq.a}</div>
                             </div>
                          ))}
                      </div>
                  </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#050505', color: 'white' },
    sidebar: { width: '320px', background: 'rgba(255,255,255,0.01)', borderRight: '1px solid #1a1a1a', padding: '60px 30px' },
    sidebarHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '50px' },
    iconBox: { width: '48px', height: '48px', borderRadius: '15px', background: 'var(--primary-low)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
    navBtn: { background: 'none', border: 'none', color: '#666', width: '100%', textAlign: 'left', padding: '15px 20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.3s', fontSize: '14px' },
    navActive: { background: 'rgba(255, 94, 54, 0.08)', color: 'white', fontWeight: 'bold', border: '1px solid rgba(255, 94, 54, 0.1)' },
    main: { flexGrow: 1, padding: '100px 80px', maxWidth: '1100px' },
    title: { fontSize: '48px', fontWeight: 'bold', marginBottom: '30px' },
    subTitle: { fontSize: '24px', fontWeight: 'bold', marginTop: '60px', marginBottom: '25px', color: 'var(--primary)' },
    para: { fontSize: '16px', color: '#888', lineHeight: '1.8', marginBottom: '30px' },
    infoBox: { padding: '25px', marginBottom: '50px', display: 'flex', gap: '20px', alignItems: 'center', fontSize: '15px', border: '1px solid var(--border-glass)' },
    stepGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' },
    stepCard: { padding: '30px', position: 'relative' },
    stepNum: { position: 'absolute', top: '20px', right: '20px', fontSize: '40px', fontWeight: '900', opacity: 0.05 },
    codeBlock: { background: 'black', padding: '25px', marginBottom: '20px', borderRadius: '20px', border: '1px solid #1a1a1a' },
    codeHeader: { fontSize: '11px', color: '#444', textTransform: 'uppercase', marginBottom: '15px', display: 'flex', gap: '8px', alignItems: 'center' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' },
    erpCard: { padding: '30px' },
    alertBox: { padding: '40px', display: 'flex', gap: '30px', alignItems: 'center', background: 'rgba(255, 94, 54, 0.03)', border: '1px solid var(--primary-low)', marginBottom: '40px' },
    complianceGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '30px' },
    complianceItem: { fontSize: '13px', color: '#666', display: 'flex', gap: '10px', alignItems: 'center' },
    faqList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    faqItem: { padding: '30px' }
};

export default KnowledgeHub;
