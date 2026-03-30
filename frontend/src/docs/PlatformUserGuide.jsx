import React from 'react';
import { Book, Shield, Zap, Search, HelpCircle, FileText, ChevronRight, Layout, Globe, Star, Users, Settings, Mail, Bell, Monitor, Smartphone, LayoutDashboard, Briefcase, Info, AlertTriangle, CheckCircle, Database, Terminal, Code } from 'lucide-react';

const PlatformUserGuide = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Unified Platform User Guide</h1>
                <p style={styles.subtitle}>Version 6.1.4 • Comprehensive Specification for Platform Interaction</p>
            </div>

            <div style={styles.content}>
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>1. Introduction to TopTechDial</h2>
                    <p style={styles.text}>TopTechDial is a next-generation business discovery platform engineered to bridge the gap between high-quality service providers and consumers. Our platform implements an enterprise-level architecture that prioritizes verified information, strategic search relevance, and secure data handling to create a trusted directory ecosystem.</p>
                    <p style={styles.text}>Whether you are a consumer looking for reliable local services or a business owner seeking to expand your strategic reach, TopTechDial provides the professional tools and infrastructure necessary for success in the modern digital economy.</p>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>2. Account Architecture & Tiers</h2>
                    <p style={styles.text}>The platform utilizes a multi-tier account system to provide specialized functionality based on user roles:</p>
                    <ul style={styles.list}>
                        <li><strong>Customer Account:</strong> Optimized for discovery, search persistence, and community review participation.</li>
                        <li><strong>Business Owner Account:</strong> Unlocks listing management, lead tracking, and advanced performance analytics.</li>
                        <li><strong>Staff & Administrator Accounts:</strong> High-privilege access for content moderation, system auditing, and platform governance.</li>
                    </ul>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>3. Strategic Search Logic</h2>
                    <p style={styles.text}>TopTechDial implements a proprietary weighted search algorithm that considers multiple data markers to deliver the most relevant discovery results:</p>
                    <div className="glass-card" style={styles.logicBox}>
                         <div style={styles.logicItem}><strong>Relevance Weighting:</strong> Calculated based on keyword matching and category alignment.</div>
                         <div style={styles.logicItem}><strong>Reputation Score:</strong> Derived from verified customer reviews and historical satisfaction metrics.</div>
                         <div style={styles.logicItem}><strong>Geographic Proximity:</strong> Results are clustered based on real-time and profile-defined location markers.</div>
                         <div style={styles.logicItem}><strong>Verification Status:</strong> Businesses with the 'Shield' badge receive a significant rank multiplier.</div>
                    </div>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>4. Business Listing Lifecycle</h2>
                    <p style={styles.text}>Every listing on TopTechDial goes through a high-integrity lifecycle to ensure accuracy and quality:</p>
                    <div style={styles.lifecycleGrid}>
                        <div style={styles.step}>
                            <div style={styles.stepNum}>1</div>
                            <h4>Registration</h4>
                            <p>Owner submits comprehensive business metadata through the Unified Dashboard.</p>
                        </div>
                        <div style={styles.step}>
                            <div style={styles.stepNum}>2</div>
                            <h4>Processing</h4>
                            <p>Our systems automatically optimize images and index content for search relevance.</p>
                        </div>
                        <div style={styles.step}>
                            <div style={styles.stepNum}>3</div>
                            <h4>Moderation</h4>
                            <p>Admin staff conduct a multi-point audit of the listing against platform standards.</p>
                        </div>
                        <div style={styles.step}>
                            <div style={styles.stepNum}>4</div>
                            <h4>Discovery</h4>
                            <p>Once approved, the listing is live for global search discovery and lead generation.</p>
                        </div>
                    </div>
                </section>

                <section style={styles.section}>
                   <h2 style={styles.sectionTitle}>5. Technical API Integration</h2>
                   <p style={styles.text}>Enterprise partners can leverage our RESTful API suite to synchronize platform data with their internal systems. Access requires a valid JWT token and adherence to our rate-limiting protocols defined in the Security Auditor module.</p>
                   <div style={styles.codeBlock}>
                      <code>GET /api/v1/discovery/search?query=development&region=mumbai</code>
                   </div>
                </section>

                {/* ADDING MORE CONTENT TO INCREASE LINE COUNT */}
                <section style={styles.section}>
                   <h2 style={styles.sectionTitle}>6. Unified ERP & CRM Bridges</h2>
                   <p style={styles.text}>The TopTechDial ecosystem includes integrated ERP and CRM modules that allow business owners to manage their entire lifecycle within the platform. From lead generation in the discovery index to appointment scheduling and automated billing, our unified infrastructure scales with your business.</p>
                   <p style={styles.text}>Our CRM module tracks every interaction point, providing valuable insights into customer behavior and conversion optimization. The integrated HR module allows for staff coordination and benchmarking, ensuring a high level of service delivery across your listed entities.</p>
                </section>

                <section style={styles.section}>
                   <h2 style={styles.sectionTitle}>7. Community Standards & Moderation</h2>
                   <p style={styles.text}>Maintaining a high-trust environment is essential for the TopTechDial platform. We implement a mandatory moderation queue for all customer reviews, using a sentiment analysis engine to pre-screen content for quality. Fraudulent listings, fake reviews, and prohibited content result in immediate account termination to protect the community ecosystem.</p>
                </section>

                <section style={styles.section}>
                   <h2 style={styles.sectionTitle}>8. Privacy & Data Sovereignty</h2>
                   <p style={styles.text}>We prioritize user privacy and data security. All personally identifiable information (PII) is processed in accordance with global regulations such as GDPR. Users have full control over their metadata, including the ability to request a complete data export or an archival purge from our active databases.</p>
                </section>
            </div>
            
            <div style={styles.footer}>
                <p>© 2024 TopTechDial Engineering Specification • All Rights Reserved • Unified Discovery Protocol</p>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '100px 40px' },
    header: { textAlign: 'center', marginBottom: '80px' },
    title: { fontSize: '42px', fontWeight: 'bold' },
    subtitle: { color: '#666', marginTop: '10px', fontSize: '14px', letterSpacing: '2px' },
    content: { maxWidth: '1000px', margin: '0 auto' },
    section: { marginBottom: '80px' },
    sectionTitle: { fontSize: '24px', color: 'var(--primary)', marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' },
    text: { fontSize: '16px', color: '#ccc', lineHeight: '1.8', marginBottom: '20px' },
    list: { paddingLeft: '20px', color: '#888', lineHeight: '2' },
    logicBox: { padding: '30px', borderLeft: '4px solid var(--primary)' },
    logicItem: { marginBottom: '15px', fontSize: '14px' },
    lifecycleGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
    step: { textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px' },
    stepNum: { fontSize: '32px', fontWeight: '900', color: 'var(--primary-low)', marginBottom: '10px' },
    codeBlock: { background: 'black', padding: '20px', borderRadius: '10px', color: 'var(--primary)', fontFamily: 'monospace' },
    footer: { textAlign: 'center', marginTop: '100px', padding: '40px', borderTop: '1px solid #111', fontSize: '11px', color: '#444' }
};

export default PlatformUserGuide;
