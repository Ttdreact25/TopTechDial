import React from 'react';
import { FileText, Shield, AlertTriangle, Scale, Globe, User, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div style={styles.container}>
            <div style={styles.hero}>
                <h1 style={styles.title}>Unified Terms of Service Agreement</h1>
                <p style={styles.subtitle}>Version 3.1.4 • Mandatory User Agreement for Platform Interaction</p>
            </div>

            <div style={styles.content}>
                <div style={styles.glassSection}>
                    <div style={styles.iconHeading}><Scale size={32} /></div>
                    <h2>1. Acceptance of Agreement</h2>
                    <p>By accessing or using the TopTechDial platform, you represent that you have read, understood, and agreed to be bound by the terms and conditions set forth herein. These terms constitute a legally binding agreement between you and TopTechDial. If you do not agree, you must immediately terminate your use of our services.</p>
                </div>

                <div style={styles.glassSection}>
                    <div style={styles.iconHeading}><Globe size={32} /></div>
                    <h2>2. Geographic Coverage and Scope</h2>
                    <p>TopTechDial operates as a digital directory connecting local businesses with consumers across multiple regions. Information on our site is intended for residents of areas where we operate specifically. You are responsible for ensuring that your use of the site complies with local laws and regulations in your jurisdiction.</p>
                </div>

                <div style={styles.glassSection}>
                    <div style={styles.iconHeading}><User size={32} /></div>
                    <h2>3. User Account Responsibilities</h2>
                    <p>Registration of an account requires accurate and complete information. You are solely responsible for maintaining the confidentiality of your credentials. Any activity occurring under your account is deemed yours, and any breach of security must be reported instantly to compliance@toptechdial.com.</p>
                    <ul style={styles.list}>
                        <li>Minors under the age of 18 are not permitted to register.</li>
                        <li>Automated account creation (bot-registration) is strictly prohibited.</li>
                        <li>Illegal content distribution via user profile is grounds for permanent banning.</li>
                    </ul>
                </div>

                <div style={styles.glassSection}>
                    <div style={styles.iconHeading}><AlertTriangle size={32} /></div>
                    <h2>4. Business Listing Compliance</h2>
                    <p>Businesses listing on TopTechDial must provide truthful, non-misleading information. We do not tolerate fraudulent listings, fake reviews, or misleading promotional materials. We reserve the right to remove any listing that fails to meet our quality control standards or receives significant verified negative feedback.</p>
                    <div style={styles.importantBox}>
                        <strong>Verification Warning:</strong> While TopTechDial attempts to verify listed entities, we do not guarantee the performance of any listed business. Users engage with businesses at their own discretion and risk.
                    </div>
                </div>

                <div style={styles.glassSection}>
                    <div style={styles.iconHeading}><Shield size={32} /></div>
                    <h2>5. Intellectual Property Rights</h2>
                    <p>The design, code, logos, and content of TopTechDial are protected by global intellectual property laws. Users are granted a limited license to browse and interact with the site but may not scraping, copy, reproduce, or modify any portion of the platform without explicit written consent from our legal department.</p>
                </div>

                <div style={styles.glassSection}>
                    <div style={styles.iconHeading}><FileText size={32} /></div>
                    <h2>6. Limitation of Liability</h2>
                    <p>Under no circumstances shall TopTechDial or its subsidiaries be liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or the inability to use, our services. We provide the platform on an "as-is" and "as-available" basis without any warranties of any kind.</p>
                </div>

                <div style={styles.contactFooter}>
                    <h3 style={{ marginBottom: '20px' }}>Questions Regarding Terms?</h3>
                    <div style={styles.contactGrid}>
                        <div style={styles.contactCard}><Mail size={18} /> legal@toptechdial.com</div>
                        <div style={styles.contactCard}><Phone size={18} /> +91 99999-00000</div>
                        <div style={styles.contactCard}><MapPin size={18} /> Mumbai, India HQ</div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <button onClick={() => window.history.back()} className="btn btn-secondary">Close Terms</button>
                    <button className="btn btn-primary">Download Signed PDF Copy</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '100px 20px' },
    hero: { maxWidth: '900px', margin: '0 auto 60px', textAlign: 'center' },
    title: { fontSize: '42px', fontWeight: 'bold' },
    subtitle: { color: '#888', marginTop: '10px' },
    content: { maxWidth: '900px', margin: '0 auto' },
    glassSection: { padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', marginBottom: '30px' },
    iconHeading: { color: 'var(--primary)', marginBottom: '20px' },
    list: { marginTop: '15px', color: '#ccc', fontSize: '14px', lineHeight: '2' },
    importantBox: { marginTop: '20px', padding: '15px', background: 'rgba(255, 179, 0, 0.1)', color: 'orange', border: '1px solid orange', borderRadius: '12px', fontSize: '13px' },
    contactFooter: { marginTop: '60px', textAlign: 'center' },
    contactGrid: { display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' },
    contactCard: { display: 'flex', gap: '10px', alignItems: 'center', color: '#888', fontSize: '14px' }
};

export default TermsOfService;
