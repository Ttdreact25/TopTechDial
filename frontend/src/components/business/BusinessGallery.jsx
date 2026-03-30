import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const BusinessGallery = ({ images, businessTitle, styles }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div style={{ height: '400px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Maximize2 size={32} color="var(--text-muted)" />
        </div>
        <p style={{ color: 'var(--text-muted)' }}>No high-resolution images available for this listing.</p>
      </div>
    );
  }

  const handlePrev = () => setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
      <div style={{ height: '450px', position: 'relative' }}>
          <img 
            src={images[activeIndex]} 
            alt={`${businessTitle} - ${activeIndex + 1}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease-in-out' }}
          />
          
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent 30%)' }} />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev} 
                className="btn-icon" 
                style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(5px)' }}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext} 
                className="btn-icon" 
                style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(5px)' }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
            {activeIndex + 1} / {images.length}
          </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveIndex(idx)} 
              style={{ 
                minWidth: '80px', 
                height: '80px', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                cursor: 'pointer',
                border: activeIndex === idx ? '2px solid var(--primary)' : '2px solid transparent',
                opacity: activeIndex === idx ? 1 : 0.6,
                transition: 'all 0.3s'
              }}
            >
              <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default BusinessGallery;
