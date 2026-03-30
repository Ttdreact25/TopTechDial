import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Key } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const { loginUser, verifyOtp, forgotPassword, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      
      if (res.requiresOtp) {
        setIsOtpRequired(true);
      } else if (res.success) {
        if (res.user?.role === 'user') {
           navigate('/dashboard/customer');
        } else {
           navigate('/dashboard/admin');
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        if (res.user?.role === 'user') {
          navigate('/dashboard/customer');
        } else {
          navigate('/dashboard/admin');
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setForgotPasswordStep(2);
        alert('OTP sent to your email.');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await resetPassword(email, otp, newPassword);
      if (res.success) {
        alert('Password reset successfully. Please login with your new password.');
        setIsForgotPassword(false);
        setForgotPasswordStep(1);
        setOtp('');
        setNewPassword('');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    if (isForgotPassword) {
      return forgotPasswordStep === 1 ? 'Forgot Password' : 'Reset Password';
    }
    return isOtpRequired ? 'Verify OTP' : 'Login';
  };

  const getFormSubmitHandler = () => {
    if (isForgotPassword) {
      return forgotPasswordStep === 1 ? handleSendResetOtp : handleResetPassword;
    }
    return isOtpRequired ? handleOtpVerify : handleLoginSubmit;
  };

  return (
    <div style={styles.container}>
      <form onSubmit={getFormSubmitHandler()} className="glass-card" style={styles.formCard}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>
          {getFormTitle()}
        </h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
          {isForgotPassword 
              ? forgotPasswordStep === 1 ? 'Enter your email to receive an OTP' : `Enter OTP and your new password`
              : isOtpRequired ? `Enter the 6-digit code sent to ${email}` : 'Welcome back to TopTechDial'}
        </p>

        {error && <div style={styles.errAlert}>{error}</div>}

        {isForgotPassword ? (
          forgotPasswordStep === 1 ? (
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
          ) : (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>OTP Code</label>
                <div style={styles.inputWrapper}>
                  <Key size={18} color="var(--text-muted)" />
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="123456" 
                    maxLength="6"
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="var(--text-muted)" />
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </>
          )
        ) : !isOtpRequired ? (
          <>
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
              <div style={{ textAlign: 'right', marginTop: '6px' }}>
                <span onClick={() => setIsForgotPassword(true)} style={{ color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>Forgot Password?</span>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.inputGroup}>
            <label style={styles.label}>OTP Code</label>
            <div style={styles.inputWrapper}>
              <Key size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                className="form-control" 
                placeholder="123456" 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
              />
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
          {loading ? 'Processing...' : isForgotPassword ? forgotPasswordStep === 1 ? 'Send OTP' : 'Reset Password' : isOtpRequired ? 'Verify & Login' : 'Sign In'}
        </button>

        {isForgotPassword ? (
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
            <span onClick={() => { setIsForgotPassword(false); setForgotPasswordStep(1); }} style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'none' }}>Back to Login</span>
          </p>
        ) : !isOtpRequired && (
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Register here</Link>
          </p>
        )}
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  formCard: {
    maxWidth: '400px',
    width: '100%',
    padding: '32px',
  },
  errAlert: {
    background: 'rgba(255, 59, 59, 0.1)',
    color: 'var(--danger)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    border: '1px solid rgba(255, 59, 59, 0.2)',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '6px',
    color: 'var(--text-muted)',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    paddingLeft: '14px',
  },
};

export default Login;
