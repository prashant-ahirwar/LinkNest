import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const BioPage = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBioData();
  }, [username]);

  const fetchBioData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/public/${username}`);
      setData(data);
    } catch (error) {
      setError(error.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = async (linkId, url) => {
    // Track click
    try {
      await axios.post(`http://localhost:5000/api/public/track-click/${linkId}`);
    } catch (error) {
      console.error('Failed to track click');
    }
    // Open link
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const { user, links } = data;
  const theme = user.themeSettings || {};

  // Apply theme styles
  const getBackgroundStyle = () => {
    if (theme.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${theme.gradientFrom || '#ffffff'}, ${theme.gradientTo || '#f3f4f6'})`,
      };
    }
    return {
      backgroundColor: theme.backgroundColor || '#ffffff',
    };
  };

  const getButtonClass = () => {
    switch(theme.buttonStyle) {
      case 'pill': return 'rounded-full';
      case 'square': return 'rounded';
      case 'sharp': return 'rounded-none';
      case 'rounded':
      default: return 'rounded-lg';
    }
  };

  const isDark = theme.mode === 'dark';
  const fontFamily = theme.font || 'Inter';

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        ...getBackgroundStyle(),
        color: isDark ? '#ffffff' : '#111827',
        fontFamily: fontFamily,
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {user.profileImage && (
            <img
              src={user.profileImage.startsWith('http') 
                ? user.profileImage 
                : `http://localhost:5000${user.profileImage}`}
              alt={user.displayName}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 shadow-lg object-cover"
              style={{ borderColor: theme.accentColor || '#3b82f6' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: isDark ? '#ffffff' : '#111827', fontFamily: fontFamily }}
          >
            {user.displayName || user.username}
          </h1>
          <p className="text-sm opacity-75 mb-4" style={{ fontFamily: fontFamily }}>@{user.username}</p>
          {user.bio && (
            <p
              className="max-w-md mx-auto opacity-90"
              style={{ color: isDark ? '#e5e7eb' : '#4b5563', fontFamily: fontFamily }}
            >
              {user.bio}
            </p>
          )}
        </motion.div>

        {/* Links Section */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <motion.button
              key={link._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleLinkClick(link._id, link.url)}
              className={`w-full px-6 py-4 font-medium transition-all duration-200 hover:scale-105 shadow-md ${getButtonClass()}`}
              style={{
                backgroundColor: theme.accentColor || '#3b82f6',
                color: '#ffffff',
                fontFamily: fontFamily,
              }}
            >
              {link.title}
            </motion.button>
          ))}
        </div>

        {links.length === 0 && (
          <div className="text-center py-12 opacity-75">
            <p style={{ fontFamily: fontFamily }}>No links yet</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 opacity-50 text-sm">
          <p style={{ fontFamily: fontFamily }}>Made with LinkNest</p>
        </div>
      </div>
    </div>
  );
};

export default BioPage;
