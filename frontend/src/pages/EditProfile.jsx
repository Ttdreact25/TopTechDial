import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API from '../services/api';
import { User, Phone, Lock, Save, ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user, updateAuthUser } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await API.put(
        '/users/profile',
        { name, phone, password, avatar }
      );

      // Update local storage and context
      updateAuthUser(data.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassword(''); // Clear password field
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Please login to view this page.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
           <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={20} /> Back</button>
           <h2 style={styles.title}>Edit Profile</h2>
           <p style={styles.subtitle}>Update your personal information</p>
        </div>

        {message.text && (
          <div style={{
            ...styles.alert,
            background: message.type === 'success' ? 'rgba(0, 211, 75, 0.1)' : 'rgba(224, 30, 90, 0.1)',
            color: message.type === 'success' ? '#00D34B' : '#E01E5A',
            border: `1px solid ${message.type === 'success' ? '#02d14b' : '#E01E5A'}`
          }}>
            {message.text}
          </div>
        )}

        {/* Avatar Upload Section */}
        <div style={styles.avatarSection}>
           <div style={styles.avatarWrapper} onClick={() => fileInputRef.current?.click()}>
              {avatar ? (
                 <img src={avatar} alt="Profile" style={styles.avatarImg} />
              ) : (
                 <div style={styles.avatarFallback}>{name.charAt(0).toUpperCase()}</div>
              )}
              <div style={styles.avatarOverlay}>
                 <Camera size={20} color="white" />
              </div>
           </div>
           <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              style={{ display: 'none' }} 
              accept="image/*"
           />
           <p style={styles.avatarHint}>Click to change photo</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
           <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                 <User size={18} style={styles.icon} />
                 <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                    required
                 />
              </div>
           </div>

           <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.inputWrapper}>
                 <Phone size={18} style={styles.icon} />
                 <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    style={styles.input}
                 />
              </div>
           </div>

           <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address (Read-only)</label>
              <div style={{ ...styles.inputWrapper, background: 'rgba(255,255,255,0.03)', opacity: 0.6 }}>
                 <input 
                    type="email" 
                    value={user.email} 
                    style={styles.input}
                    disabled
                 />
              </div>
           </div>

           <div style={styles.inputGroup}>
              <label style={styles.label}>New Password (Leave blank to keep current)</label>
              <div style={styles.inputWrapper}>
                 <Lock size={18} style={styles.icon} />
                 <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                 />
              </div>
           </div>

           <button 
              type="submit" 
              style={styles.submitBtn}
              disabled={loading}
           >
              {loading ? 'Updating...' : <><Save size={18} /> Save Changes</>}
           </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0F0F1A',
    padding: '120px 24px 60px 24px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '40px',
    backdropFilter: 'blur(10px)',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
  },
  avatarWrapper: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
    border: '4px solid rgba(253, 96, 57, 0.2)',
    boxShadow: '0 10px 20px rgba(6, 6, 6, 0.3)',
    transition: 'transform 0.3s',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, #fe5b33, #E01E5A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: '700',
    color: 'white',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
    '&:hover': {
       opacity: 1
    }
  },
  avatarHint: {
    marginTop: '12px',
    fontSize: '13px',
    color: '#666',
    fontWeight: '500',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '16px',
    padding: 0,
  },
  title: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
    margin: 0,
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    color: '#888',
    fontSize: '14px',
    fontWeight: '500',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '0 16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: '52px',
    transition: 'border-color 0.3s',
  },
  icon: {
    color: '#666',
    marginRight: '12px',
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    width: '100%',
    outline: 'none',
    fontSize: '16px',
  },
  submitBtn: {
    marginTop: '12px',
    background: '#FF5E36',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    height: '52px',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    boxShadow: '0 8px 16px rgba(255, 94, 54, 0.3)',
    transition: 'all 0.3s',
  }
};

export default EditProfile;
