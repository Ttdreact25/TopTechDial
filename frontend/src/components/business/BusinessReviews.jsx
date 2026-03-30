import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, User } from 'lucide-react';
import API from '../../services/api';

const BusinessReviews = ({ reviews = [], businessId, user, onReviewAdded, styles }) => {
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to submit a review');
    if (!newReview.comment.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await API.post('/reviews', { 
          business_id: businessId, 
          rating: newReview.rating, 
          comment: newReview.comment 
      });
      
      if (data.success) {
        alert('Review submitted successfully! It will appear once moderated.');
        setNewReview({ rating: 5, comment: '' });
        onReviewAdded();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '24px', color: 'white' }}>Customer Reviews ({reviews.length})</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 'bold' }}>
          <Star size={20} fill="var(--accent)" />
          {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'No Ratings'}
        </div>
      </div>

      {/* Review Submission Form */}
      {user && (
        <div className="glass-card" style={{ padding: '25px', marginBottom: '40px', border: '1px solid var(--primary-low)' }}>
          <h4 style={{ marginBottom: '20px', fontSize: '18px' }}>Share your experience</h4>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                >
                  <Star size={24} fill={star <= newReview.rating ? 'var(--accent)' : 'none'} color={star <= newReview.rating ? 'var(--accent)' : 'var(--text-muted)'} />
                </button>
              ))}
            </div>
            <textarea 
              className="form-control" 
              placeholder="What did you like or dislike about this business? Your feedback helps thousands of users."
              rows="4"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
              style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.02)' }}
            />
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Authenticating & Saving...' : 'Post Your Review'} <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
            <MessageSquare size={48} color="var(--text-muted)" style={{ marginBottom: '15px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Be the first to review this business and help others!</p>
          </div>
        ) : (
          reviews.map((r, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {r.userName ? r.userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '16px', color: 'white' }}>{r.userName}</h5>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={12} fill={star <= r.rating ? 'var(--accent)' : 'none'} color={star <= r.rating ? 'var(--accent)' : 'var(--text-muted)'} />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', fontStyle: 'italic', marginBottom: '15px' }}>"{r.comment}"</p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button className="btn-text" style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '5px', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ThumbsUp size={14} /> Helpful (2)
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessReviews;
