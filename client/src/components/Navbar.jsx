
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/change-password`, {
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

  if (!user) return null;

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'superadmin': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'admin': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-green-500/20 text-green-400 border-green-500/50';
    }
  };

  return (
    <>
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ED1B2F] to-[#455185] bg-clip-text text-transparent">
                  Token System
                </h1>
                <p className="text-white/60 text-xs">Support Management Platform</p>
              </div>
            </div>
            
            {/* User Profile Section */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-white/60 text-sm">{user.email}</p>
              </div>

              {/* Role Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ED1B2F] to-[#455185] flex items-center justify-center text-white font-bold hover:scale-110 transition-transform"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1a1f3a] border border-white/20 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white font-semibold truncate">{user.name}</p>
                      <p className="text-white/60 text-xs truncate">{user.email}</p>
                      {user.employeeCode && (
                        <p className="text-white/50 text-xs mt-1">ID: {user.employeeCode}</p>
                      )}
                    </div>
                    <div className="p-2">
                      {(user.role === 'admin' || user.role === 'superadmin') && (
                        <button
                          onClick={() => {
                            setShowPasswordModal(true);
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                          🔒 Change Password
                        </button>
                      )}
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                      >
                        🏠 Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-gradient-to-br from-[#455185] to-[#2a3357] rounded-2xl p-8 max-w-md w-full border border-white/20" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-6">Change Password</h3>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg mb-4 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2 text-sm">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 text-sm">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 text-sm">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#ED1B2F] to-[#d41829] hover:from-[#d41829] hover:to-[#c01625] text-white rounded-xl transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
