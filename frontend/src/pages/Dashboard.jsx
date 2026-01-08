import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProfileEditor from '../components/ProfileEditor';
import LinksEditor from '../components/LinksEditor';
import ThemeEditor from '../components/ThemeEditor';
import Analytics from '../components/Analytics';
import ShareTools from '../components/ShareTools';
import { FiLogOut, FiUser, FiLink, FiLayout, FiBarChart2 } from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, linksRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/links'),
      ]);
      setProfile(profileRes.data);
      setLinks(linksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'links', label: 'Links', icon: FiLink },
    { id: 'theme', label: 'Theme', icon: FiLayout },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LinkNest</h1>
              <p className="text-sm text-gray-600">@{user?.username}</p>
            </div>
            <div className="flex items-center gap-4">
              <ShareTools username={user?.username} profile={profile} />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'profile' && (
            <ProfileEditor profile={profile} onUpdate={setProfile} />
          )}
          {activeTab === 'links' && (
            <LinksEditor links={links} onUpdate={setLinks} />
          )}
          {activeTab === 'theme' && (
            <ThemeEditor profile={profile} onUpdate={setProfile} />
          )}
          {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
