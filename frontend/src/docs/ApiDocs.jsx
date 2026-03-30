import React from 'react';
import { Code, Terminal, BookOpen, Send, ShieldCheck, Database, Key, Layout } from 'lucide-react';

const ApiDocs = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logoCircle}><Code size={40} color="var(--primary)" /></div>
        <h1 style={styles.title}>TopTechDial Interface API 1.0</h1>
        <p style={{ color: 'var(--text-muted)' }}>Public documentation for integrating third-party services with our directory.</p>
        <div style={styles.badgeLine}>
          <span style={styles.badge}>Stable</span>
          <span style={styles.badge}>RESTful</span>
          <span style={styles.badge}>JWT Protected</span>
          <span style={styles.badge}>PHP Backend</span>
        </div>
      </div>

      <div style={styles.content}>
        <div className="glass-card" style={styles.section}>
          <div style={styles.sectionTitle}><Key size={20} /> Authentication Layer</div>
          <p>All sensitive endpoints require a Bearer token in the Authorization header. Authentication is based on JSON Web Tokens (JWT) using the HS256 hashing algorithm.</p>
          <div style={styles.codeBlock}>
            <div style={styles.codeHeader}><Terminal size={12} /> request_header.txt</div>
            <code>Authorization: Bearer {'<your_access_token>'}</code>
          </div>
          <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>To obtain a token, use the <code>/auth/login</code> endpoint with valid credentials or a verified OTP.</p>
        </div>

        <div className="glass-card" style={styles.section}>
          <div style={styles.sectionTitle}><Database size={20} /> 1. Businesses Discovery API</div>
          <p>Retrieve individual or bulk business listings with advanced filtering capabilities.</p>
          <div style={styles.codeBlock}>
            <div style={styles.codeHeader}><Send size={12} /> GET /api/businesses</div>
            <code style={{ fontSize: '12px' }}>
              {'// Example response payload'}<br/>
              {'{\n  "success": true,\n  "data": [\n    {\n      "_id": 42,\n      "title": "Elite Catering",\n      "category": "Food",\n      "city": "Mumbai",\n      "averageRating": 4.9\n    }\n  ]\n}'}
            </code>
          </div>
          <p style={{ marginTop: '15px' }}>Query Parameters Available:</p>
          <ul style={styles.paramList}>
             <li><code>keyword</code>: String - Filter by name or description</li>
             <li><code>category</code>: String - Strictly filter by business category</li>
             <li><code>city</code>: String - Filter by geographic location</li>
          </ul>
        </div>

        <div className="glass-card" style={styles.section}>
          <div style={styles.sectionTitle}><Layout size={20} /> 2. Listing Management API</div>
          <p>Allows platform owners and verified businesses to modify their own information.</p>
          <div style={styles.codeBlock}>
            <div style={styles.codeHeader}><Send size={12} /> PUT /api/businesses/:id</div>
            <code style={{ fontSize: '12px' }}>
              {'{\n  "title": "Updated Business Name",\n  "description": "New description...",\n  "phone": "+91 90000 11111"\n}'}
            </code>
          </div>
        </div>

        <div className="glass-card" style={styles.section}>
          <div style={styles.sectionTitle}><ShieldCheck size={20} /> 3. Verification & Compliance</div>
          <p>TopTechDial enforces data integrity through our unified Security Auditor module. Any suspicious requests (more than 30 per minute) will trigger an automatic temporary IP ban to prevent scraping.</p>
          <div style={styles.alertBox}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div><strong>Rate Limit Warning:</strong> Public search endpoints are limited to 100 requests every 5 minutes per IP address. Exceeding this will result in a 429 status code.</div>
          </div>
        </div>

        <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <p style={{ color: '#888', marginBottom: '20px' }}>Need help integrating? Our technical team is available 24/7.</p>
            <button className="btn btn-primary">Connect with Dev Support</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '120px 40px' },
  header: { textAlign: 'center', marginBottom: '80px' },
  logoCircle: { width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  title: { fontSize: '42px', fontWeight: 'bold', margin: 0 },
  badgeLine: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' },
  badge: { fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px', color: '#888', border: '1px solid rgba(255,255,255,0.1)' },
  content: { maxWidth: '1000px', margin: '0 auto' },
  section: { padding: '40px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.05)' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--primary)' },
  codeBlock: { margin: '20px 0', background: 'black', borderRadius: '12px', padding: '20px', position: 'relative', border: '1px solid #222' },
  codeHeader: { fontSize: '10px', color: '#444', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
  paramList: { listStyle: 'none', padding: 0, marginTop: '20px', color: '#ccc', fontSize: '14px', lineHeight: 2 },
  alertBox: { background: 'rgba(255, 69, 58, 0.03)', border: '1px solid rgba(255, 69, 58, 0.2)', padding: '20px', borderRadius: '12px', marginTop: '30px', display: 'flex', gap: '20px', alignItems: 'center', fontSize: '13px' }
};

export default ApiDocs;
