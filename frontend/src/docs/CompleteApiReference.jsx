import React from 'react';
import { Terminal, Send, Code, Database, Shield, Book, Globe, Cpu, Zap, Star, Layout, Users, Settings, Mail, Bell, Monitor, Smartphone, LayoutDashboard, Briefcase, FileText, ChevronRight, CheckCircle, AlertCircle, Info, HelpCircle } from 'lucide-react';

const CompleteApiReference = () => {
  const sections = [
    {
      title: 'Authentication & Session Control',
      endpoints: [
        { method: 'POST', path: '/auth/login', desc: 'Exchange user credentials for a valid JWT access token.', params: ['email', 'password'], response: 'JWT Token + User Profile' },
        { method: 'POST', path: '/auth/send-otp', desc: 'Trigger a secure 6-digit OTP delivery to the registered email.', params: ['email'], response: 'Success/Failure' },
        { method: 'POST', path: '/auth/verify-otp', desc: 'Validates a user-submitted OTP for account access.', params: ['email', 'otp'], response: 'Token' }
      ]
    },
    {
      title: 'Business Directory Engine',
      endpoints: [
        { method: 'GET', path: '/businesses', desc: 'The primary search endpoint for the platform.', params: ['keyword', 'category', 'city', 'range'], response: 'Collection of Business Objects' },
        { method: 'GET', path: '/business', desc: 'Retrieve precise detailed information for a specific business ID.', params: ['id'], response: 'Unified Business Entity' },
        { method: 'POST', path: '/businesses', desc: 'Programmatically register a new enterprise listing on the platform.', params: ['title', 'category', 'address', 'contact'], response: 'Creation Status' },
        { method: 'PUT', path: '/businesses/:id', desc: 'Update an existing listing with modified metadata.', params: ['title', 'description', 'timings'], response: 'Updated Object' }
      ]
    },
    {
        title: 'User & Profile Management',
        endpoints: [
          { method: 'GET', path: '/users/profile', desc: 'Fetch the authenticated user’s sensitive personal data.', params: [], response: 'User Record' },
          { method: 'PUT', path: '/users/profile', desc: 'Modify personal profile details like name or phone number.', params: ['name', 'phone'], response: 'Status' },
          { method: 'PUT', path: '/users/profile-avatar', desc: 'Upload and process a new binary avatar image.', params: ['avatar (File)'], response: 'Avatar Public URL' }
        ]
    },
    {
        title: 'Review & Engagement System',
        endpoints: [
          { method: 'GET', path: '/reviews', desc: 'Fetch all moderated reviews for a specific business listing.', params: ['business_id'], response: 'Review Collection' },
          { method: 'POST', path: '/reviews', desc: 'Post a new customer experience review to the moderation queue.', params: ['business_id', 'rating', 'comment'], response: 'Submission Status' }
        ]
    },
    {
        title: 'Enterprise Analytics Suite',
        endpoints: [
          { method: 'GET', path: '/analytics', desc: 'Retrieve time-series performance data for owned business listings.', params: ['id', 'range'], response: 'Trend Data + Funnels' }
        ]
    },
    {
        title: 'Notification & Support',
        endpoints: [
          { method: 'GET', path: '/notifications', desc: 'Synchronize unread platform alerts for the active session.', params: ['action=count'], response: 'Notification Count/Collection' },
          { method: 'POST', path: '/support/tickets', desc: 'Submit a new technical or billing support enquiry.', params: ['subject', 'message'], response: 'Ticket ID' }
        ]
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dynamic API Engineering Specification</h1>
        <p style={{ color: 'var(--text-muted)' }}>A comprehensive developer reference for the TopTechDial REST ecosystem.</p>
      </header>

      <div style={styles.content}>
         {sections.map((s, idx) => (
           <div key={idx} style={styles.section}>
              <h2 style={styles.sectionHeading}>{s.title}</h2>
              <div style={styles.endpointTable}>
                 {s.endpoints.map((e, eIdx) => (
                   <div key={eIdx} className="glass-card" style={styles.endpointRow}>
                      <div style={styles.rowTop}>
                         <div style={{ ...styles.method, ...(e.method === 'GET' ? styles.get : e.method === 'POST' ? styles.post : styles.put) }}>{e.method}</div>
                         <code style={styles.path}>{e.path}</code>
                      </div>
                      <p style={styles.desc}>{e.desc}</p>
                      <div style={styles.paramGrid}>
                         <strong>Required Parameters:</strong>
                         <div style={styles.tags}>
                            {e.params.length > 0 ? e.params.map((p, pIdx) => (
                              <span key={pIdx} style={styles.tag}>{p}</span>
                            )) : <span style={{ color: '#444' }}>None</span>}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         ))}
      </div>

      <div style={styles.docFooter}>
        <div style={styles.alertBox}>
           <Info size={24} />
           <div>
              <h4>Proprietary Integration Notice</h4>
              <p>Modification of this API architecture or attempts to bypass the security auditor module will result in permanent hardware-level IP banning and potential legal ramifications as defined in our Terms of Service.</p>
           </div>
        </div>
        <p style={{ textAlign: 'center', color: '#444', marginTop: '60px' }}>TopTechDial Engineering Protocol 2024. Confidential.</p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '100px 40px' },
  header: { textAlign: 'center', marginBottom: '80px' },
  title: { fontSize: '40px', fontWeight: 'bold' },
  content: { maxWidth: '1200px', margin: '0 auto' },
  section: { marginBottom: '80px' },
  sectionHeading: { fontSize: '24px', color: 'var(--primary)', marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' },
  endpointTable: { display: 'flex', flexDirection: 'column', gap: '20px' },
  endpointRow: { padding: '30px', border: '1px solid var(--border-glass)', transition: 'transform 0.2s' },
  rowTop: { display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' },
  method: { fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '5px' },
  get: { background: 'rgba(0, 211, 75, 0.1)', color: 'var(--success)' },
  post: { background: 'rgba(0, 163, 255, 0.1)', color: 'var(--info)' },
  put: { background: 'rgba(255, 179, 0, 0.1)', color: 'var(--accent)' },
  path: { fontSize: '18px', fontWeight: 'bold', color: 'white' },
  desc: { color: '#ccc', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' },
  paramGrid: { borderTop: '1px solid #1a1a1a', paddingTop: '20px', fontSize: '13px' },
  tags: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' },
  tag: { background: 'rgba(255,255,255,0.05)', color: '#888', padding: '4px 10px', borderRadius: '4px', fontSize: '11px' },
  docFooter: { marginTop: '100px', borderTop: '1px solid #111', paddingTop: '60px' },
  alertBox: { background: 'rgba(255, 94, 54, 0.03)', border: '1px solid var(--primary-low)', padding: '30px', borderRadius: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start', color: 'var(--primary)', fontSize: '14px' }
};

export default CompleteApiReference;
