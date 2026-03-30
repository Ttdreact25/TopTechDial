import React from 'react';
import { HelpCircle, Mail, MessageCircle, FileText, ChevronRight, Layout, Globe, Star, Users, Settings, Bell, Monitor, Smartphone, LayoutDashboard, Briefcase, Info, AlertTriangle, CheckCircle, Database, Terminal, Code } from 'lucide-react';

const SupportHubGuide = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.iconCircle}><HelpCircle size={48} color="var(--primary)" /></div>
                <h1 style={styles.title}>Unified Enterprise Support Hub</h1>
                <p style={styles.subtitle}>Version 3.4.9.REL • Client Support & Ticket Management</p>
            </div>

            <div style={styles.content}>
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>1. Support Ticketing Lifecycle</h2>
                    <p style={styles.text}>The SupportTicketSystem at TopTechDial provides consumers and business owners with a strategic channel to communicate with platform staff. Tickets are categorized by department and priority, ensuring that critical issues are addressed through our automated escalation protocols.</p>
                    <div className="glass-card" style={styles.stepGrid}>
                        {[
                          { title: 'Open Ticket', desc: 'User submits a formal enquiry with subject and priority markers.' },
                          { title: 'Department Routing', desc: 'Tickets are automatically routed to specialized staff clusters.' },
                          { title: 'Thread Management', desc: 'Secure asynchronous communication between user and moderator.' },
                          { title: 'Strategic Resolution', desc: 'Tickets are closed once verified solutions are implemented.' }
                        ].map((step, idx) => (
                          <div key={idx} style={styles.stepItem}>
                             <div style={styles.stepNum}>{idx + 1}</div>
                             <h4>{step.title}</h4>
                             <p>{step.desc}</p>
                          </div>
                        ))}
                    </div>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>2. Service Level Agreements (SLA)</h2>
                    <p style={styles.text}>We prioritize platform uptime and user satisfaction through strict SLAs. Support requests from Enterprise tiered business profiles receive prioritized routing and sub-4 hour initial response benchmarks. Consumer enquiries are generally addressed within a 12-24 hour window by our global moderation teams.</p>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>3. Messaging Protocols</h2>
                    <p style={styles.text}>Our MessagingEngine (api/enterprise/MessagingEngine.php) powers real-time interactions for platform enquiries. All communication is encrypted at rest and audited periodically to ensure adherence to community standards and prevent fraudulent activity or harassment.</p>
                </section>
            </div>

            <div style={styles.footer}>
               <p>© 2024 TopTechDial Unified Support Protocol • Enterprise Help Systems</p>
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
    stepGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', marginTop: '40px' },
    stepItem: { padding: '30px', position: 'relative' },
    stepNum: { fontSize: '32px', fontWeight: '900', color: 'var(--primary-low)', marginBottom: '10px' },
    footer: { textAlign: 'center', marginTop: '100px', padding: '40px', borderTop: '1px solid #111', fontSize: '11px', color: '#444' }
};

export default SupportHubGuide;
