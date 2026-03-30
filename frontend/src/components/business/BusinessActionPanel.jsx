import React, { useState } from 'react';
import { Phone, MessageSquare, ExternalLink, Mail, Share2, Star, ShieldCheck, Clock, MapPin } from 'lucide-react';
import API from '../../services/api';

const BusinessActionPanel = ({ business, user, styles }) => {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to send an enquiry');
    setSubmitting(true);
    try {
      const { data } = await API.post('/requests', { 
          business_id: business._id, 
          message: enquiryMsg 
      });
      if (data.success) {
        alert('Enquiry sent! The business owner will contact you shortly.');
        setShowEnquiry(false);
        setEnquiryMsg('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '30px', position: 'sticky', top: '100px', border: '1px solid var(--primary-low)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
        <div>
          <h2 style={{ fontSize: '28px', color: 'white', fontWeight: 'bold', lineHeight: '1.2' }}>{business.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              background: 'rgba(0, 211, 75, 0.1)', 
              color: 'var(--success)',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} className="pulse-slow" />
              Open Now
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>• {business.category}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ color: 'var(--accent)', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
             {business.averageRating || '4.8'} <Star size={18} fill="var(--accent)" />
           </div>
           <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{business.reviewCount || 12} Verified Reviews</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', color: 'var(--text-light)', fontSize: '14px' }}>
          <div style={{ background: 'rgba(255, 94, 54, 0.1)', padding: '10px', borderRadius: '12px' }}><MapPin size={20} color="var(--primary)" /></div>
          <div>{business.address?.street}, {business.address?.city}, {business.address?.state}</div>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', color: 'var(--text-light)', fontSize: '14px' }}>
           <div style={{ background: 'rgba(0, 211, 75, 0.1)', padding: '10px', borderRadius: '12px' }}><Clock size={20} color="var(--success)" /></div>
           <div>Open Today: {business.timings?.open} - {business.timings?.close}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
        <a 
          href={`tel:${business.phone}`} 
          className="btn btn-primary" 
          style={{ height: '56px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px -5px rgba(255, 94, 54, 0.3)' }}
        >
          <Phone size={20} /> Call
        </a>
        <button 
          onClick={() => setShowEnquiry(!showEnquiry)} 
          className="btn btn-secondary" 
          style={{ height: '56px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <MessageSquare size={20} /> Message
        </button>
      </div>

      {showEnquiry && (
        <form onSubmit={handleEnquiry} className="animate-slide-up" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '25px', border: '1px solid var(--border-glass)' }}>
            <h4 style={{ marginBottom: '15px', fontSize: '15px' }}>Send enquiry to owner</h4>
            <textarea 
              className="form-control" 
              placeholder="How can this business help you? (e.g. asking for pricing, availability)" 
              value={enquiryMsg}
              onChange={(e) => setEnquiryMsg(e.target.value)}
              required
              rows="3"
              style={{ marginBottom: '15px' }}
            />
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Connecting...' : 'Submit Request'}
            </button>
        </form>
      )}

      <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '25px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
         <div style={{ display: 'flex', gap: '12px' }}>
            <a href={business.website} target="_blank" className="btn-icon" style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', color: 'white' }}><ExternalLink size={20} /></a>
            <a href={`mailto:${business.email}`} className="btn-icon" style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', color: 'white' }}><Mail size={20} /></a>
         </div>
         <button className="btn-icon" style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', gap: '8px', alignItems: 'center', border: 'none', cursor: 'pointer' }}><Share2 size={20} /> Share</button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
        Safety Tip: Always verify business credentials before making payments.
      </div>
    </div>
  );
};

export default BusinessActionPanel;
