import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Briefcase } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(searchParams.get('role') || 'user'); // Defaults to 'user', allows 'business_owner'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasOwner, setHasOwner] = useState(false); // Platform Owner Lock

  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const { data } = await import('../services/api').then(m => m.default.get('/auth/check-owner'));
        setHasOwner(data.hasOwner);
        
        if (data.hasOwner && role === 'business_owner') {
          alert('An Admin account already exists on this platform. Redirecting to Login.');
          navigate('/login');
        }
      } catch (err) {}
    };
    
    checkOwner();
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await registerUser({ name, email, phone, password, role });
      if (res.success) {
        if (role === 'business_owner') {
          navigate('/login');
        } else {
          navigate('/dashboard/customer');
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} className="glass-card" style={styles.formCard}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Create Account</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
          Join TopTechDial today.
        </p>

        {error && <div style={styles.errAlert}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <div style={styles.inputWrapper}>
            <User size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              className="form-control" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputWrapper}>
            <Mail size={18} color="var(--text-muted)" />
            <input 
              type="email" 
              className="form-control" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Phone Number</label>
          <div style={styles.inputWrapper}>
            <Phone size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              className="form-control" 
              placeholder="+123456789" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrapper}>
            <Lock size={18} color="var(--text-muted)" />
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
        </div>

        {!searchParams.get('role') && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Account Type</label>
            <div style={styles.inputWrapper}>
              <Briefcase size={18} color="var(--text-muted)" />
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                style={styles.select}
                className="form-control"
              >
                <option value="user">User (Browse & Review)</option>
                {!hasOwner && (
                  <option value="business_owner">Admin (Manage Platform)</option>
                )}
              </select>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login here</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  formCard: { maxWidth: '420px', width: '100%', padding: '32px' },
  errAlert: { background: 'rgba(255, 59, 59, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', border: '1px solid rgba(255, 59, 59, 0.2)' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-muted)' },
  inputWrapper: { display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', paddingLeft: '14px' },
  select: { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', width: '100%', padding: '12px 0', outline: 'none' }
};

export default Register;
