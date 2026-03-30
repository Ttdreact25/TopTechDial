import React from 'react';
import { Shield, Lock, Eye, FileText, ChevronRight, AlertCircle, Info, CheckCircle, HelpCircle } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div style={styles.container}>
            <div style={styles.hero}>
                <h1 style={styles.title}>Privacy Protection & Data Security</h1>
                <p style={styles.subtitle}>Last Updated: March 30, 2024 • Version 2.0</p>
                <div style={styles.headerIcon}><Shield size={64} color="var(--primary)" /></div>
            </div>

            <div style={styles.content}>
                <div className="glass-card" style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <Info size={24} color="var(--primary)" />
                        <h2>1. Our Commitment To You</h2>
                    </div>
                    <p>At TopTechDial, we are deeply committed to maintaining the trust and confidence of our visitors to our web site. In particular, we want you to know that TopTechDial is not in the business of selling, renting or trading email lists with other companies and businesses for marketing purposes. In this Privacy Policy, we’ve provided detailed information on when and why we collect your personal information, how we use it, the limited conditions under which we may disclose it to others and how we keep it secure.</p>
                </div>

                <div className="glass-card" style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <Eye size={24} color="var(--success)" />
                        <h2>2. Data Collection & Analytics</h2>
                    </div>
                    <p>When someone visits TopTechDial we use a third party service, Google Analytics, to collect standard internet log information and details of visitor behavior patterns. We do this to find out things such as the number of visitors to the various parts of the site. This information is only processed in a way which does not identify anyone. We do not make, and do not allow Google to make, any attempt to find out the identities of those visiting our website.</p>
                    <ul style={styles.list}>
                        <li><ChevronRight size={14} /> IP Address and Location Data</li>
                        <li><ChevronRight size={14} /> Browser signatures and device types</li>
                        <li><ChevronRight size={14} /> Search keyword history</li>
                        <li><ChevronRight size={14} /> Engagement durations on specific business listings</li>
                    </ul>
                </div>

                <div className="glass-card" style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <Lock size={24} color="var(--info)" />
                        <h2>3. User Account Security</h2>
                    </div>
                    <p>As part of the registration process for our newsletter or user account, we collect personal information. We use that information for a couple of reasons: to tell you about stuff you’ve asked us to tell you about; to contact you if we need to obtain or provide additional information; to check our records are right and to check every now and then that you’re happy and satisfied. We don't rent or trade email lists with other organisations and businesses.</p>
                    <div style={styles.alertBox}>
                        <AlertCircle size={20} />
                        <span>Crucial: All passwords on TopTechDial are hashed using industry-standard BCRYPT algorithms. Even our administrators cannot see your raw password.</span>
                    </div>
                </div>

                <div className="glass-card" style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <FileText size={24} color="var(--accent)" />
                        <h2>4. Business Listing Data</h2>
                    </div>
                    <p>When you register a business on our platform, the information you provide (Business Name, Address, Contact details) will be publicly visible to all users of the platform. This is the nature of a business directory services. However, private billing information and owner identity verification data remains strictly confidential and is never shared outside our core compliance team.</p>
                </div>

                <div className="glass-card" style={styles.section}>
                     <div style={styles.sectionHeader}>
                        <CheckCircle size={24} color="var(--success)" />
                        <h2>5. Your Rights Over Your Data</h2>
                    </div>
                    <p>You are entitled to view, amend, or delete the personal information that we hold. Email your request to our data protection officer at privacy@toptechdial.com and we will respond to your request within 30 days. You have the right to request a digital copy of all your interactions with our platform.</p>
                </div>

                <div className="glass-card" style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <HelpCircle size={24} color="var(--warning)" />
                        <h2>6. Changes to this Privacy Notice</h2>
                    </div>
                    <p>TopTechDial reserves the right to modify this policy at any time without prior notice. Significant changes will be announced on our dashboard or via the email address associated with your account. We recommend regularly reviewing this page to stay informed about how we are protecting your information.</p>
                </div>

                <div style={styles.footer}>
                     <button onClick={() => window.history.back()} className="btn btn-secondary">Go Back</button>
                     <button onClick={() => window.print()} className="btn btn-primary">Print Policy</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#050505', color: 'white' },
    hero: { padding: '120px 20px 60px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255, 94, 54, 0.05) 0%, transparent 100%)' },
    title: { fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' },
    subtitle: { color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px' },
    headerIcon: { margin: '0 auto' },
    content: { maxWidth: '1000px', margin: '0 auto', padding: '0 40px 100px' },
    section: { padding: '40px', marginBottom: '30px', border: '1px solid var(--border-glass)' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
    list: { listStyle: 'none', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
    alertBox: { marginTop: '25px', padding: '15px', background: 'rgba(0, 163, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 163, 255, 0.2)', display: 'flex', gap: '15px', alignItems: 'center', fontSize: '13px', color: 'var(--info)' },
    footer: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '60px' }
};

export default PrivacyPolicy;
