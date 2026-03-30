import React, { useState } from 'react';
import { Terminal, Send, Code, Database, Shield, Book, Globe, Cpu, Zap, Star, Layout, Users, Settings, Mail, Bell, Monitor, Smartphone, LayoutDashboard, Briefcase, FileText, ChevronRight, CheckCircle, AlertCircle, Info, HelpCircle } from 'lucide-react';

const DeveloperSupport = () => {
    const [apiKey, setApiKey] = useState('ttd_live_xxxxxxxxxxxxxxxxxxxxxxxxxx');
    const [activeEndpoint, setActiveEndpoint] = useState('search');

    return (
        <div style={styles.container}>
            <div style={styles.hero}>
                <div style={styles.iconCircle}><Cpu size={48} color="var(--primary)" /></div>
                <h1 style={styles.title}>Developer Platform Support</h1>
                <p style={styles.subtitle}>Unified Technical Documentation for Platform Integration Engineers.</p>
                <div style={styles.tagLine}>
                    <span>API v1.02</span>
                    <span>HTTPS Mandatory</span>
                    <span>CORS Policy Active</span>
                </div>
            </div>

            <div style={styles.content}>
                <div className="glass-card" style={styles.section}>
                    <div style={styles.sectionHeader}><Shield size={24} color="var(--primary)" /> <h2>Authentication & Authorization</h2></div>
                    <p>All developer requests to the TopTechDial API suite must be authenticated using the persistent X-API-KEY header or a dynamic Bearer token for unified session access.</p>
                    
                    <div style={styles.codePanel}>
                        <div style={styles.panelHeader}><code>Authorization: Bearer <span style={{ color: 'var(--primary)' }}>{apiKey}</span></code></div>
                        <div style={styles.panelBody}>
                             <p>// Authorization required for:</p>
                             <ul style={{ color: '#888', listStyle: 'none', padding: 0 }}>
                                <li>• Listing modifications</li>
                                <li>• Internal user analytics</li>
                                <li>• Bulk CSV imports</li>
                                <li>• Audit log extraction</li>
                             </ul>
                        </div>
                    </div>
                </div>

                <div style={styles.endpointGrid}>
                    <div className="glass-card" style={styles.endpointCard}>
                        <div style={styles.methodTag}>GET</div>
                        <h3>/api/search.php</h3>
                        <p>Search using weighted relevance scoring with geographic context.</p>
                        <ul style={styles.paramList}>
                            <li><code>keyword</code> - Pattern Matching</li>
                            <li><code>city</code> - Geographic Locality</li>
                        </ul>
                    </div>
                    <div className="glass-card" style={styles.endpointCard}>
                        <div style={styles.methodTag}>POST</div>
                        <h3>/api/listings.php</h3>
                        <p>Programmatic creation of business directory listings.</p>
                        <ul style={styles.paramList}>
                            <li><code>owner_id</code> - Internal UID</li>
                            <li><code>payload</code> - Listing Content</li>
                        </ul>
                    </div>
                    <div className="glass-card" style={styles.endpointCard}>
                        <div style={styles.methodTag}>PUT</div>
                        <h3>/api/users.php</h3>
                        <p>Real-time modification of administrative and staff profiles.</p>
                        <ul style={styles.paramList}>
                            <li><code>target_id</code> - Resource ID</li>
                        </ul>
                    </div>
                </div>

                <div className="glass-card" style={styles.statusSection}>
                    <div style={styles.sectionHeader}><Zap size={24} color="var(--success)" /> <h2>Platform Health Monitoring</h2></div>
                    <div style={styles.statusGrid}>
                        <div style={styles.statusItem}>
                            <div style={styles.dotActive}></div>
                            <span>Core Discovery API</span>
                            <span style={styles.statusValue}>99.98% Uptime</span>
                        </div>
                        <div style={styles.statusItem}>
                            <div style={styles.dotActive}></div>
                            <span>Authentication Service</span>
                            <span style={styles.statusValue}>Operational</span>
                        </div>
                        <div style={styles.statusItem}>
                            <div style={styles.dotActive}></div>
                            <span>Search Analytics Engine</span>
                            <span style={styles.statusValue}>Healthy</span>
                        </div>
                        <div style={styles.statusItem}>
                            <div style={styles.dotWarning}></div>
                            <span>Bulk Media Processing</span>
                            <span style={styles.statusValue}>Degraded (42ms latency)</span>
                        </div>
                    </div>
                </div>

                <div style={styles.ctaFooter}>
                    <h3>Integration Challenges?</h3>
                    <p style={{ color: '#888', marginBottom: '30px' }}>Our core engineering team is available for deep technical consultation on enterprise-level data migrations and strategic platform integrations.</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                         <button className="btn btn-primary">Connect with Engineer</button>
                         <button className="btn btn-secondary">Report Technical Bug</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#050505', color: 'white', paddingBottom: '120px' },
    hero: { padding: '140px 20px 80px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255, 94, 54, 0.05) 0%, transparent 100%)' },
    iconCircle: { width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' },
    title: { fontSize: '42px', fontWeight: '900', color: 'white' },
    subtitle: { color: 'var(--text-muted)', fontSize: '16px', margin: '15px auto 30px', maxWidth: '600px', lineHeight: '1.6' },
    tagLine: { display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px' },
    content: { maxWidth: '1200px', margin: '0 auto', padding: '0 40px' },
    section: { padding: '40px', marginBottom: '40px' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
    codePanel: { background: 'black', borderRadius: '15px', border: '1px solid #1a1a1a', overflow: 'hidden' },
    panelHeader: { padding: '15px 25px', background: '#111', borderBottom: '1px solid #1a1a1a', fontSize: '13px' },
    panelBody: { padding: '25px', fontSize: '14px', lineHeight: '2' },
    endpointGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '60px' },
    endpointCard: { padding: '30px', position: 'relative' },
    methodTag: { position: 'absolute', top: '20px', right: '20px', fontSize: '10px', background: 'var(--primary-low)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '5px', fontWeight: 'bold' },
    paramList: { listStyle: 'none', padding: 0, marginTop: '20px', fontSize: '13px', color: '#888', display: 'flex', flexDirection: 'column', gap: '8px' },
    statusSection: { padding: '50px', border: '1px dashed var(--border-glass)' },
    statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', marginTop: '40px' },
    statusItem: { display: 'flex', alignItems: 'center', gap: '15px', fontSize: '15px' },
    dotActive: { width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' },
    dotWarning: { width: '10px', height: '10px', background: 'var(--warning)', borderRadius: '50%', boxShadow: '0 0 10px var(--warning)' },
    statusValue: { marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '13px' },
    ctaFooter: { marginTop: '100px', textAlign: 'center' }
};

export default DeveloperSupport;
