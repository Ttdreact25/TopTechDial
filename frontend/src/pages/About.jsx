import React from 'react';
import { Award, Target, Users, Shield, TrendingUp, Globe, Building, MessageSquare, Briefcase, Zap } from 'lucide-react';

const About = () => {
   return (
      <div style={styles.container}>
         {/* Background Ornamentation */}
         <div style={styles.blurBg} />

         <div style={styles.heroSection}>
            <div className="animate-slide-up">
               <h1 style={styles.heroTitle}>Local Services, <span style={{ color: 'var(--primary)' }}>Redefined.</span></h1>
               <p style={styles.heroSubtitle}>Built by professionals, for professionals. TopTechDial connects the world’s most demanding customers with the highest quality service providers across the country.</p>
            </div>
         </div>

         <div style={styles.mainContent}>
            <div style={styles.metricsGrid}>
               <div className="glass-card" style={styles.metricCard}>
                  <Users size={32} color="var(--primary)" />
                  <div style={styles.metricValue}>10,000+</div>
                  <div style={styles.metricLabel}>Verified Accounts</div>
               </div>
               <div className="glass-card" style={styles.metricCard}>
                  <Briefcase size={32} color="var(--success)" />
                  <div style={styles.metricValue}>5,000+</div>
                  <div style={styles.metricLabel}>Active Businesses</div>
               </div>
               <div className="glass-card" style={styles.metricCard}>
                  <Award size={32} color="var(--accent)" />
                  <div style={styles.metricValue}>1M+</div>
                  <div style={styles.metricLabel}>Monthly Directory Searches</div>
               </div>
            </div>

            <div style={styles.twoColumnGrid}>
               <div style={styles.textColumn}>
                  <h2 style={styles.sectionTitle}>The Platform Vision</h2>
                  <p style={styles.text}>The current local service discovery market is plagued by outdated directories, unverified reviews, and clunky user interfaces. TopTechDial was born out of a desire for a clean, fast, and secure directory that uses modern web technologies to simplify the connection between businesses and consumers.</p>
                  <p style={styles.text}>Our advanced weighted search algorithm, designed with data scientist feedback, ensures that users find exactly what they are looking for by prioritizing business relevance, geographic proximity, and historical user satisfaction data.</p>

                  <div style={styles.featureList}>
                     <div style={styles.featureItem}>
                        <Zap size={20} color="var(--primary)" />
                        <div><strong>Lightning Fast Performance:</strong> Built on Vite & React with a highly optimized PHP core, we deliver results in milliseconds.</div>
                     </div>
                     <div style={styles.featureItem}>
                        <Shield size={20} color="var(--success)" />
                        <div><strong>No-Compromise Security:</strong> From password hashing to rate limiting and audit logging, your data integrity is our priority.</div>
                     </div>
                     <div style={styles.featureItem}>
                        <MessageSquare size={20} color="var(--accent)" />
                        <div><strong>Unified Communication:</strong> Integrated lead management systems that bridge the gap between enquiry and execution.</div>
                     </div>
                  </div>
               </div>
               <div style={styles.imageColumn}>
                  <div className="glass-card" style={styles.abstractCard}>
                     <div style={{ padding: '60px', textAlign: 'center' }}>
                        <Globe size={180} color="rgba(255, 94, 54, 0.1)" strokeWidth={1} />
                        <div style={{ marginTop: '-120px' }}>
                           <Target size={60} color="var(--primary)" strokeWidth={3} />
                        </div>
                     </div>
                     <h4 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Global Logic, Local Focus</h4>
                  </div>
               </div>
            </div>

            <div style={styles.teamSection}>
               <h2 style={{ fontSize: '30px', textAlign: 'center', marginBottom: '60px' }}>Our Core Pillars</h2>
               <div style={styles.pillarsGrid}>
                  <div style={styles.pillar}>
                     <div style={styles.pillarIcon}><Building size={24} /></div>
                     <h3>Transparency</h3>
                     <p>Every business listing and review on TopTechDial is moderated using our specialized content moderation systems to maintain the highest level of authenticity and truth in our directory.</p>
                  </div>
                  <div style={styles.pillar}>
                     <div style={styles.pillarIcon}><TrendingUp size={24} /></div>
                     <h3>Growth</h3>
                     <p>We provide enterprise-level business growth toolkits, detailed performance analytics, and lead conversion insights to help our listed partners scale their operations effectively.</p>
                  </div>
                  <div style={styles.pillar}>
                     <div style={styles.pillarIcon}><Globe size={24} /></div>
                     <h3>Community</h3>
                     <p>By empowering local residents with the best digital tools to discover services, we contribute to more vibrant, economically active, and resilient local communities across the globe.</p>
                  </div>
               </div>
            </div>

            <div className="glass-card" style={styles.ctaBanner}>
               <h2 style={{ fontSize: '28px', color: 'white' }}>Ready to Scale Your Local Presence?</h2>
               <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '15px auto 30px' }}>Join over 5,000 businesses already using the TopTechDial platform to connect with thousands of daily users and grow their service influence.</p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  <button className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '16px' }}>Get Started Today</button>
                  <button className="btn btn-secondary" style={{ padding: '15px 40px', fontSize: '16px' }}>View Integration API</button>
               </div>
            </div>
         </div>
      </div>
   );
};

const styles = {
   container: { minHeight: '100vh', background: '#050505', color: 'white', position: 'relative', overflowX: 'hidden' },
   blurBg: { position: 'absolute', top: '10%', right: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(255, 94, 54, 0.05) 0%, transparent 70%)', zIndex: 0 },
   heroSection: { padding: '160px 20px 100px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)', position: 'relative', zIndex: 1 },
   heroTitle: { fontSize: '56px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px', color: 'white' },
   heroSubtitle: { fontSize: '18px', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' },
   mainContent: { maxWidth: '1400px', margin: '0 auto', padding: '0 40px 120px', position: 'relative', zIndex: 1 },
   metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', margin: '-40px auto 100px' },
   metricCard: { padding: '40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' },
   metricValue: { fontSize: '40px', fontWeight: '900', color: 'white', margin: '15px 0 5px' },
   metricLabel: { fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' },
   twoColumnGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '120px' },
   sectionTitle: { fontSize: '36px', fontWeight: 'bold', marginBottom: '30px', color: 'white' },
   text: { fontSize: '16px', color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '20px' },
   featureList: { marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '25px' },
   featureItem: { display: 'flex', gap: '20px', alignItems: 'flex-start', fontSize: '14px', color: 'var(--text-light)' },
   abstractCard: { padding: '40px', border: '1px dashed rgba(255,255,255,0.1)' },
   teamSection: { marginBottom: '120px' },
   pillarsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' },
   pillar: { textAlign: 'center' },
   pillarIcon: { width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'var(--primary)' },
   ctaBanner: { padding: '80px', textAlign: 'center', border: '1px solid var(--primary-low)', background: 'linear-gradient(135deg, rgba(255, 94, 54, 0.05) 0%, transparent 100%)' }
};

export default About;
