import React from 'react';
import { Search, Construction, AlertTriangle, ArrowLeft, Home, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.blurBg} />
            
            <div className="glass-card" style={styles.errorBox}>
                <div style={styles.iconCircle}><Search size={48} color="var(--primary)" /></div>
                <h1 style={styles.code}>404</h1>
                <h2 style={styles.title}>Listing Not Found</h2>
                <p style={styles.desc}>We've conducted a deep audit of our directories, but it seems the page or business you're looking for has moved or no longer exists on TopTechDial.</p>
                
                <div style={styles.actions}>
                    <button onClick={() => navigate(-1)} className="btn btn-secondary">
                        <ArrowLeft size={18} /> Go Back One Step
                    </button>
                    <button onClick={() => navigate('/')} className="btn btn-primary">
                        <Home size={18} /> Return to Discovery
                    </button>
                </div>
            </div>

            <div style={styles.footerInfo}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <AlertTriangle size={14} color="var(--primary)" />
                    <span>System Error Trace: HTTP_NOT_FOUND_404 | TopTechDial v1.02 Integrity Engine</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#1c0808', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' },
    blurBg: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255, 94, 54, 0.05) 0%, transparent 70%)', zIndex: 0 },
    errorBox: { maxWidth: '600px', padding: '60px 40px', textAlign: 'center', zIndex: 1, border: '1px solid var(--primary-low)' },
    iconCircle: { width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255, 94, 54, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' },
    code: { fontSize: '100px', fontWeight: '900', margin: '0 0 10px', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-5px', opacity: 0.8 },
    title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' },
    desc: { color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '15px', marginBottom: '40px' },
    actions: { display: 'flex', gap: '15px', justifyContent: 'center' },
    footerInfo: { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: '#333' }
};

export default NotFound;
