import React from 'react';
import { Settings, User, Image, Lock, ArrowUpRight, Shield, Bell, Database } from 'lucide-react';

const AdminSettings = ({ activeSettingsTab, setActiveSettingsTab, profileData, setProfileData, passwordData, setPasswordData, avatarFile, setAvatarFile, profileLoading, passwordLoading, avatarLoading, handleUpdateProfile, handleUpdateAvatar, handleChangePassword, user, styles }) => {
  return (
    <div style={styles.viewContent}>
      <div style={styles.viewHeader}>
        <div>
          <h2 style={styles.viewTitle}>Account Configuration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage security, profile details, and platform preferences</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px', marginTop: '30px' }}>
        {/* Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveSettingsTab('profile')} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              background: activeSettingsTab === 'profile' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.02)', 
              color: 'white', 
              border: 'none', 
              textAlign: 'left', 
              cursor: 'pointer' 
            }}
          >
            <User size={18} /> Profile Details
          </button>
          <button 
            onClick={() => setActiveSettingsTab('avatar')} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              background: activeSettingsTab === 'avatar' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.02)', 
              color: 'white', 
              border: 'none', 
              textAlign: 'left', 
              cursor: 'pointer' 
            }}
          >
            <Image size={18} /> Change Avatar
          </button>
          <button 
            onClick={() => setActiveSettingsTab('password')} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              background: activeSettingsTab === 'password' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.02)', 
              color: 'white', 
              border: 'none', 
              textAlign: 'left', 
              cursor: 'pointer' 
            }}
          >
            <Lock size={18} /> Security & Password
          </button>
          
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 94, 54, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 94, 54, 0.1)' }}>
            <h5 style={{ color: 'var(--primary)', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
              <Shield size={16} /> Admin Controls
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button disabled style={{ fontSize: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', textAlign: 'left', cursor: 'not-allowed' }}><Bell size={12} /> Notification Logic</button>
              <button disabled style={{ fontSize: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', textAlign: 'left', cursor: 'not-allowed' }}><Database size={12} /> Database Backup</button>
            </div>
          </div>
        </div>

        {/* Settings View Panel */}
        <div className="glass-card" style={{ padding: '30px' }}>
          {activeSettingsTab === 'profile' && (
            <form onSubmit={handleUpdateProfile}>
              <h4 style={{ marginBottom: '20px', color: 'white' }}>Update Personal Information</h4>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>Your Full Name</label>
                <input 
                  className="form-control" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>Phone Number</label>
                <input 
                  className="form-control" 
                  value={profileData.phone} 
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} 
                  required 
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={profileLoading}>
                {profileLoading ? 'Saving changes...' : 'Save Profile Changes'}
              </button>
            </form>
          )}

          {activeSettingsTab === 'avatar' && (
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ marginBottom: '20px', color: 'white' }}>Your Account Avatar</h4>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '15px', 
                margin: '0 auto 25px', 
                background: 'rgba(255,255,255,0.05)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={48} color="rgba(255,255,255,0.2)" />
                )}
              </div>
              <form onSubmit={handleUpdateAvatar} style={{ maxWidth: '300px', margin: '0 auto' }}>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={(e) => setAvatarFile(e.target.files[0])} 
                  accept="image/*"
                  style={{ marginBottom: '20px' }}
                />
                <button className="btn btn-primary" type="submit" disabled={avatarLoading}>
                  {avatarLoading ? 'Uploading...' : 'Upload New Avatar'}
                </button>
              </form>
            </div>
          )}

          {activeSettingsTab === 'password' && (
            <form onSubmit={handleChangePassword}>
              <h4 style={{ marginBottom: '20px', color: 'white' }}>Change Login Password</h4>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>Current Password</label>
                <input 
                  type="password"
                  className="form-control" 
                  value={passwordData.currentPassword} 
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>New Password</label>
                <input 
                  type="password"
                  className="form-control" 
                  value={passwordData.newPassword} 
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>Confirm New Password</label>
                <input 
                  type="password"
                  className="form-control" 
                  value={passwordData.confirmPassword} 
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                  required 
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Updating password...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
