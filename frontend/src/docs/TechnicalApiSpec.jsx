import React from 'react';
import { Terminal, Send, Code, Database, Shield, Book, Globe, Cpu, Zap, Star, Layout, Users, Settings, Mail, Bell, Monitor, Smartphone, LayoutDashboard, Briefcase, FileText, ChevronRight, CheckCircle, AlertCircle, Info, HelpCircle } from 'lucide-react';

const TechnicalApiSpec = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconCircle}><Cpu size={48} color="var(--primary)" /></div>
        <h1 style={styles.title}>Unified Technical API Specification</h1>
        <p style={styles.subtitle}>Protocol Version 4.1.2.REL • Strategic Enterprise Interfacing</p>
      </div>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Authentication Protocols</h2>
          <p style={styles.text}>The TopTechDial API suite implements a high-security authentication layer using JSON Web Tokens (JWT) based on the HS256 hashing algorithm. All sensitive discovery and listing management endpoints require a valid Bearer token in the Authorization header. Authentication is rate-limited to prevent brute-force attacks by our Security Auditor module.</p>
          <div className="glass-card" style={styles.endpointCard}>
             <div style={styles.method}>POST</div>
             <div style={styles.path}>/api/auth/login</div>
             <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>Exchange authorized user credentials for a persistent session token.</p>
          </div>
          <p style={styles.text}>A successful login event returns a unique token payload that should be cached locally and presented in subsequent requests for the duration of the session. Tokens expire automatically after 24 hours of inactivity or upon administrative session invalidation.</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Business Discovery API</h2>
          <p style={styles.text}>The Discovery API provides programmatic access to our verified business directory index. Our search logic utilizes weighted relevance scoring, geographic density, and category alignment markers to deliver high-quality results for enterprise applications.</p>
          <div className="glass-card" style={styles.endpointCard}>
             <div style={styles.method}>GET</div>
             <div style={styles.path}>/api/discovery/search?query=IT&city=Mumbai</div>
             <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>Retrieve verified service providers matching strategic metadata queries.</p>
          </div>
          <div style={styles.paramGrid}>
             <div style={styles.paramItem}><code>query</code>: The primary search keyword or business title marker.</div>
             <div style={styles.paramItem}><code>city</code>: The geographic cluster for localized service discovery.</div>
             <div style={styles.paramItem}><code>category</code>: High-level classification for discovery filtering.</div>
          </div>
        </section>

        <section style={styles.section}>
           <h2 style={styles.sectionTitle}>3. Listing Management Hub</h2>
           <p style={styles.text}>Owner-tier accounts can manage their digital directory inventory through our unified listing management API. This includes programmatic creation of business profiles, media state updates, and responding to customer feedback in real-time.</p>
           <div className="glass-card" style={styles.endpointCard}>
              <div style={styles.method}>POST</div>
              <div style={styles.path}>/api/listings/create</div>
              <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>Initialize a new business entity within the platform discovery index.</p>
           </div>
           <p style={styles.text}>New listings enter a 'Pending' moderation state where they are audited by admin staff for quality and veracity before becoming active in the public search index.</p>
        </section>

        <section style={styles.section}>
           <h2 style={styles.sectionTitle}>4. Lead Generation & CRM Bridge</h2>
           <p style={styles.text}>Every interaction on TopTechDial can be logged as a strategic lead for business stakeholders. Our CRM Bridge provides endpoints for tracking customer enquiry clicks, map requests, and specialized messaging engagement across the platform.</p>
           <div className="glass-card" style={styles.endpointCard}>
              <div style={styles.method}>POST</div>
              <div style={styles.path}>/api/crm/leads/log</div>
              <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>Create a new lead activity record linking a customer to a business entity.</p>
           </div>
        </section>

        <section style={styles.section}>
           <h2 style={styles.sectionTitle}>5. Security & Rate Limiting</h2>
           <p style={styles.text}>Maintaining platform stability is our core objective. Our Security Auditor module monitors all API traffic for suspicious patterns such as excessive rate limits, automated scraping, or unauthorized session attempts. Exceeding defined thresholds result in immediate temporary or permanent IP banning to protect the directory ecosystem.</p>
        </section>

        <section style={styles.section}>
           <h2 style={styles.sectionTitle}>6. Error Handling & State Markers</h2>
           <p style={styles.text}>All API responses follow a unified structure for consistent integration. Successful requests return a 200 series status code with a JSON payload containing the success flag and requested data markers. Errors return 400 or 500 series codes with descriptive error messages to help developers troubleshoot connectivity issues.</p>
        </section>
      </div>

      <div style={styles.footer}>
         <p>© 2024 TopTechDial Unified Engineering Specification • Proprietary Enterprise Access</p>
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
  endpointCard: { padding: '30px', position: 'relative', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '20px' },
  method: { color: 'var(--primary)', fontWeight: 'bold', fontSize: '12px', border: '1px solid var(--primary)', display: 'inline-block', padding: '4px 10px', borderRadius: '5px' },
  path: { fontSize: '20px', fontWeight: 'bold', marginTop: '15px' },
  paramGrid: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '25px', paddingLeft: '20px' },
  paramItem: { fontSize: '14px', color: '#888' },
  footer: { textAlign: 'center', marginTop: '100px', padding: '40px', borderTop: '1px solid #111', fontSize: '11px', color: '#444' }
};

export default TechnicalApiSpec;
