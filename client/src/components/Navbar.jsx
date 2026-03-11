import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout, API_URL } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    employeeCode: user?.employeeCode || '',
    companyName: user?.companyName || ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setSuccess('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setError('Error changing password. Please try again.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setIsEditingProfile(false);
        setTimeout(() => {
          setSuccess('');
          window.location.reload();
        }, 1500);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Error updating profile. Please try again.');
    }
  };

  const openProfileModal = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      employeeCode: user?.employeeCode || '',
      companyName: user?.companyName || ''
    });
    setShowProfileModal(true);
    setIsProfileMenuOpen(false);
    setIsEditingProfile(false);
  };

  if (!user) return null;

  const getRoleStyles = (role) => {
    const styles = {
      superadmin: {
        badge: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-violet-500/25',
        avatar: 'from-violet-600 to-fuchsia-600',
        icon: 'text-fuchsia-400'
      },
      admin: {
        badge: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/25',
        avatar: 'from-blue-600 to-cyan-600',
        icon: 'text-cyan-400'
      },
      default: {
        badge: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25',
        avatar: 'from-emerald-600 to-teal-600',
        icon: 'text-teal-400'
      }
    };
    return styles[role] || styles.default;
  };

  const roleStyle = getRoleStyles(user.role);

  return (
    <>
      {/* Glassmorphic Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 rounded-2xl shadow-2xl shadow-black/20">
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                {/* Logo and Brand - Modern Minimalist */}
                <div 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  {/* Animated Logo Container */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ED1B2F] to-[#455185] rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                    </div>
                  </div>
                  
                  {/* Brand Text - Hidden on mobile */}
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      TICKETING SYSTEM
                    </h1>
                    <p className="text-white/40 text-[10px] font-medium tracking-wider">
                      SUPPORT MANAGEMENT
                    </p>
                  </div>
                </div>

                {/* Right Section - User Menu */}
                <div className="flex items-center gap-4">
                  {/* User Info - Hidden on mobile */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-white/40 text-xs">{user.email}</p>
                    </div>
                    
                    {/* Role Badge - Minimal */}
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${roleStyle.badge}`}>
                      {user.role}
                    </span>
                  </div>

                  {/* Profile Menu Trigger - Modern Avatar */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="relative group outline-none"
                    >
                      {/* Avatar Ring Animation */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${roleStyle.avatar} rounded-full opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-300`}></div>
                      
                      {/* Avatar */}
                      <div className="relative w-11 h-11 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-all">
                        <span className="text-white font-semibold text-lg">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </button>

                    {/* Modern Dropdown Menu */}
                    {isProfileMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsProfileMenuOpen(false)}
                        ></div>
                        
                        {/* Dropdown - Glassmorphic */}
                        <div className="absolute right-0 mt-3 w-72 z-50 animate-slideDown">
                          <div className="backdrop-blur-xl bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            
                            {/* Header - User Info */}
                            <div className="p-5 bg-gradient-to-r from-white/5 to-transparent border-b border-white/10">
                              <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${roleStyle.avatar} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                  {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-semibold truncate">{user.name}</p>
                                  <p className="text-white/40 text-sm truncate">{user.email}</p>
                                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${roleStyle.badge}`}>
                                    {user.role}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                              <MenuItem
                                icon="👤"
                                label="View Profile"
                                onClick={openProfileModal}
                              />
                              
                              {(user.role === 'admin' || user.role === 'superadmin') && (
                                <MenuItem
                                  icon="🔒"
                                  label="Change Password"
                                  onClick={() => {
                                    setShowPasswordModal(true);
                                    setIsProfileMenuOpen(false);
                                  }}
                                />
                              )}
                              
                              <MenuItem
                                icon="📊"
                                label="Dashboard"
                                onClick={() => {
                                  navigate('/dashboard');
                                  setIsProfileMenuOpen(false);
                                }}
                              />
                              
                              <div className="h-px bg-white/10 my-2"></div>
                              
                              <MenuItem
                                icon="🚪"
                                label="Logout"
                                onClick={handleLogout}
                                variant="danger"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals - Enhanced Design */}
      
      {/* Profile Modal - Modern Glassmorphic */}
      {showProfileModal && (
        <Modal 
          title="Profile" 
          onClose={() => setShowProfileModal(false)}
          maxWidth="max-w-2xl"
        >
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleStyle.avatar} flex items-center justify-center text-white text-3xl font-bold shadow-xl`}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-white text-xl font-semibold">{user.name}</h4>
                <p className="text-white/40 text-sm">{user.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${roleStyle.badge}`}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                value={profileData.name}
                onChange={(val) => setProfileData({ ...profileData, name: val })}
                disabled={!isEditingProfile}
                required
              />
              
              <FormField
                label="Email"
                value={profileData.email}
                disabled
                note="Email cannot be changed"
              />
              
              <FormField
                label="Employee Code"
                value={profileData.employeeCode}
                onChange={(val) => setProfileData({ ...profileData, employeeCode: val })}
                disabled={!isEditingProfile}
              />
              
              <FormField
                label="Company Name"
                value={profileData.companyName}
                onChange={(val) => setProfileData({ ...profileData, companyName: val })}
                disabled={!isEditingProfile}
              />
            </div>

            {/* Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.department && (
                <InfoCard label="Department" value={user.department.name} />
              )}
              
              <InfoCard 
                label="Account Status" 
                value={
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    user.status === 'suspended' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                    user.status === 'frozen' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                    'bg-green-500/20 text-green-400 border border-green-500/50'
                  }`}>
                    {user.status || 'active'}
                  </span>
                }
              />
              
              <InfoCard 
                label="Member Since" 
                value={new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditingProfile ? (
                <>
                  <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileData({
                        name: user?.name || '',
                        email: user?.email || '',
                        employeeCode: user?.employeeCode || '',
                        companyName: user?.companyName || ''
                      });
                      setError('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="success" type="submit">
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </form>
        </Modal>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <Modal 
          title="Change Password" 
          onClose={() => setShowPasswordModal(false)}
          maxWidth="max-w-md"
        >
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <form onSubmit={handlePasswordReset} className="space-y-5">
            <FormField
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(val) => setPasswordData({ ...passwordData, currentPassword: val })}
              required
            />
            
            <FormField
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(val) => setPasswordData({ ...passwordData, newPassword: val })}
              required
              note="Minimum 6 characters"
            />
            
            <FormField
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(val) => setPasswordData({ ...passwordData, confirmPassword: val })}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Password
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

// Reusable Components

const MenuItem = ({ icon, label, onClick, variant = 'default' }) => {
  const variants = {
    default: 'text-white/80 hover:text-white hover:bg-white/10',
    danger: 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${variants[variant]} group`}
    >
      <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
};

const Modal = ({ children, title, onClose, maxWidth = 'max-w-md' }) => (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    onClick={onClose}
  >
    <div 
      className={`${maxWidth} w-full animate-scaleIn`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="backdrop-blur-xl bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white/60 transition-colors text-xl"
          >
            ✕
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const Alert = ({ type, message }) => {
  const styles = {
    error: 'bg-red-500/10 border-red-500/50 text-red-400',
    success: 'bg-green-500/10 border-green-500/50 text-green-400'
  };

  const icons = {
    error: '⚠️',
    success: '✅'
  };

  return (
    <div className={`${styles[type]} border rounded-xl p-4 mb-6 flex items-start gap-3 animate-slideDown`}>
      <span className="text-xl">{icons[type]}</span>
      <span className="text-sm flex-1">{message}</span>
    </div>
  );
};

const FormField = ({ label, type = 'text', value, onChange, disabled, required, note }) => (
  <div>
    <label className="block text-white/60 text-sm mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 
        focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] focus:border-transparent transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
      placeholder={`Enter ${label.toLowerCase()}`}
      disabled={disabled}
      required={required}
    />
    {note && <p className="text-white/30 text-xs mt-1">{note}</p>}
  </div>
);

const InfoCard = ({ label, value }) => (
  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
    <p className="text-white/40 text-sm mb-1">{label}</p>
    <div className="text-white font-medium">{value}</div>
  </div>
);

const Button = ({ variant, children, onClick, type = 'button' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#ED1B2F] to-[#d41829] hover:from-[#d41829] hover:to-[#c01625] text-white',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex-1 px-4 py-3 rounded-xl transition-all font-medium shadow-lg ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Navbar;