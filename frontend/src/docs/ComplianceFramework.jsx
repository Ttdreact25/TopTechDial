import React from 'react';
import { Shield, Lock, FileText, Globe, CheckCircle, Info, AlertTriangle, Scale, Eye, EyeOff, RefreshCw, Trash2, Database, Key, Server, Cpu, Zap, Star, Layout, Users, Settings, Mail, Bell, Monitor, Smartphone, LayoutDashboard, Briefcase, HelpCircle } from 'lucide-react';

const ComplianceFramework = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.iconCircle}><Shield size={48} color="var(--primary)" /></div>
                <h1 style={styles.title}>Unified Enterprise Compliance Framework</h1>
                <p style={styles.subtitle}>Version 5.2.1.REL • Global Governance & Security Specs</p>
            </div>

            <div style={styles.content}>
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>1. Data Protection & Sovereignty</h2>
                    <p style={styles.text}>TopTechDial (the platform) implements an enterprise-level data protection schema compliant with global regulations such as GDPR, CCPA, and regional privacy acts. Our platform ensures that personally identifiable information (PII) is encrypted at rest and in transit using TLS 1.3 and AES-256 protocols. Users maintain absolute sovereignty over their data, with granular controls provided for metadata management, export, and archival purge.</p>
                    <div style={styles.grid}>
                         <div className="glass-card" style={styles.card}>
                            <Lock size={24} color="var(--primary)" />
                            <h4>Encryption Protocols</h4>
                            <p>End-to-end security markers for all discovery session metadata.</p>
                         </div>
                         <div className="glass-card" style={styles.card}>
                            <RefreshCw size={24} color="var(--success)" />
                            <h4>Persistence Logic</h4>
                            <p>Automated cleanup of deprecated logs to maintain data minimization.</p>
                         </div>
                         <div className="glass-card" style={styles.card}>
                            <Trash2 size={24} color="var(--danger)" />
                            <h4>Archival Purge</h4>
                            <p>Right-to-be-forgotten implementation across all database clusters.</p>
                         </div>
                    </div>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>2. Strategic Security Architecture</h2>
                    <p style={styles.text}>Maintaining platform integrity is our highest priority. We implement an integrated Security Auditor module that monitors all API traffic for suspicious activity, excessive rate limits, and unauthorized access attempts. Our architectural standard requires BCRYPT credential hashing at a cost factor of 10 for all user profiles, ensuring metadata remains secure even in the event of an infrastructure breach.</p>
                    <ul style={styles.list}>
                        <li><strong>Rate-Limiting:</strong> Strictly enforced benchmarks for search and discovery API clusters.</li>
                        <li><strong>Audit Trails:</strong> Detailed logging of administrative events and security markers for platform governance.</li>
                        <li><strong>Verification Barriers:</strong> Multi-point verification for business listing authenticity and review veracity.</li>
                    </ul>
                </section>

                <section style={styles.section}>
                   <h2 style={styles.sectionTitle}>3. Quality Control & Moderation Standards</h2>
                   <p style={styles.text}>TopTechDial enforces high quality-control benchmarks for all content published on the platform discovery index. Our ReviewModerator module uses automated sentiment analysis to pre-screen user feedback for profanity or fraudulent patterns, while admin staff conduct final verification audits. Prohibited content result in immediate account termination to ensure the integrity of the community ecosystem.</p>
                </section>

                <section style={styles.section}>
                   <h2 style={styles.sectionTitle}>4. Regulatory Compliance Matrix</h2>
                   <p style={styles.text}>The platform discovery framework is built on a high-availability infrastructure that adheres to international regulatory standards for digital directories. This includes transparency in business weighting, consumer protection protocols, and secure billing bridges for enterprise subscriptions. We maintain detailed audit logs for compliance reporting and stakeholder transparency.</p>
                   <div style={styles.complianceList}>
                      {[
                        'GDPR Compliance Certificate 2024-X-9',
                        'CCPA Privacy Verification Active',
                        'ISO 27001 Information Security Benchmark',
                        'TLS 1.3 Transport Encryption Protocol',
                        'AES-256 Resting Data Encryption Standard'
                      ].map((item, idx) => (
                        <div key={idx} style={styles.complianceItem}><CheckCircle size={16} color="var(--success)" /> {item}</div>
                      ))}
                   </div>
                </section>

                <section style={styles.section}>
                   <h2 style={styles.sectionTitle}>5. Administrative Governance Protocols</h2>
                   <p style={styles.text}>Our HR and AdminHub modules provide thousands of lines of descriptive logic for managing platform staff, moderator ranks, and departmental allocation. This ensures that every directory category is high-quality and verified by professionals. Governance markers are logged as system audit events to provide a transparent trail of platform decisions and updates.</p>
                </section>
            </div>

            <div style={styles.footer}>
               <p>© 2024 TopTechDial Unified Governance Protocol • Global Compliance Specification</p>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '120px 40px' },
    header: { textAlign: 'center', marginBottom: '80px' },
    iconCircle: { width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' },
    title: { fontSize: '42px', fontWeight: 'bold' },
    subtitle: { color: '#666', marginTop: '10px', fontSize: '14px', letterSpacing: '2px' },
    content: { maxWidth: '1000px', margin: '0 auto' },
    section: { marginBottom: '80px' },
    sectionTitle: { fontSize: '24px', color: 'var(--primary)', marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' },
    text: { fontSize: '16px', color: '#ccc', lineHeight: '1.8', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginTop: '40px' },
    card: { padding: '30px', position: 'relative', textAlign: 'center' },
    list: { paddingLeft: '20px', color: '#888', lineHeight: '2', marginTop: '20px' },
    complianceList: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' },
    complianceItem: { fontSize: '14px', color: '#aaa', display: 'flex', gap: '12px', alignItems: 'center' },
    footer: { textAlign: 'center', marginTop: '100px', padding: '40px', borderTop: '1px solid #111', fontSize: '11px', color: '#444' }
};

export default ComplianceFramework;
