import { useState, useEffect } from 'react';
import { FiLink, FiEye, FiX, FiMaximize2, FiSmartphone, FiMonitor } from 'react-icons/fi';
import QRCode from 'qrcode';
import api from '../utils/api';

const ShareTools = ({ username, profile }) => {
  const [showQR, setShowQR] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [previewMode, setPreviewMode] = useState('mobile'); // 'mobile' or 'desktop'
  const [copied, setCopied] = useState(false);
  
  const bioUrl = `${window.location.origin}/u/${username}`;

  useEffect(() => {
    if (showPreview && username) {
      fetchPreviewData();
    }
  }, [showPreview, username]);

  const fetchPreviewData = async () => {
    try {
      const { data } = await api.get(`/public/${username}`);
      setPreviewData(data);
    } catch (error) {
      console.error('Failed to fetch preview data:', error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateQR = async () => {
    try {
      const qr = await QRCode.toDataURL(bioUrl, {
        width: 300,
        margin: 2,
      });
      setQrCode(qr);
      setShowQR(true);
    } catch (error) {
      console.error('QR generation error:', error);
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `${username}-qr-code.png`;
    link.href = qrCode;
    link.click();
  };

  const getButtonClass = (style) => {
    const baseClass = 'w-full py-3 px-4 font-medium transition-all text-center';
    switch(style) {
      case 'rounded': return `${baseClass} rounded-lg`;
      case 'pill': return `${baseClass} rounded-full`;
      case 'square': return `${baseClass} rounded`;
      case 'sharp': return `${baseClass} rounded-none`;
      default: return `${baseClass} rounded-lg`;
    }
  };

  const getBackgroundStyle = (theme) => {
    if (!theme) return { background: '#ffffff' };
    
    return {
      background: theme.backgroundType === 'solid' 
        ? theme.backgroundColor 
        : `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
      color: theme.mode === 'dark' ? '#ffffff' : '#000000',
      fontFamily: theme.font || 'Inter',
    };
  };

  const PreviewModal = () => {
    if (!previewData) return null;

    const theme = previewData.user?.themeSettings || {};
    const backgroundStyle = getBackgroundStyle(theme);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                  title="Mobile view"
                >
                  <FiSmartphone size={18} />
                </button>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                  title="Desktop view"
                >
                  <FiMonitor size={18} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/u/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center gap-2 transition-colors"
              >
                <FiMaximize2 size={14} />
                Open Full
              </a>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
            <div 
              className={`${
                previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'
              } w-full bg-white rounded-xl shadow-lg overflow-hidden`}
              style={backgroundStyle}
            >
              <div className="p-8">
                {/* Profile Section */}
                <div className="text-center mb-8">
                  {previewData.user.profileImage && (
                    <img
                      src={previewData.user.profileImage.startsWith('http') 
                        ? previewData.user.profileImage 
                        : `http://localhost:5000${previewData.user.profileImage}`}
                      alt={previewData.user.displayName}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4"
                      style={{ borderColor: theme.accentColor || '#3b82f6' }}
                    />
                  )}
                  <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: theme.font }}>
                    {previewData.user.displayName}
                  </h1>
                  {previewData.user.bio && (
                    <p className="opacity-75" style={{ fontFamily: theme.font }}>
                      {previewData.user.bio}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                  {previewData.links && previewData.links.length > 0 ? (
                    previewData.links.map((link) => (
                      <div
                        key={link._id}
                        className={getButtonClass(theme.buttonStyle)}
                        style={{
                          backgroundColor: theme.accentColor || '#3b82f6',
                          color: '#ffffff',
                        }}
                      >
                        {link.title}
                      </div>
                    ))
                  ) : (
                    <p className="text-center opacity-50 py-8">No links yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleCopyLink}
          className="btn btn-secondary flex items-center gap-2 text-sm"
        >
          <FiLink />
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className="btn btn-secondary flex items-center gap-2 text-sm"
        >
          <FiEye />
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          onClick={handleGenerateQR}
          className="btn btn-secondary text-sm"
        >
          QR Code
        </button>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Your QR Code</h3>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <img src={qrCode} alt="QR Code" className="w-full" />
            </div>
            <p className="text-sm text-gray-600 text-center mt-4 mb-2">
              Scan to visit: <span className="font-mono text-xs">{bioUrl}</span>
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleDownloadQR}
                className="btn btn-secondary flex-1"
              >
                Download
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="btn btn-primary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && <PreviewModal />}
    </>
  );
};

export default ShareTools;
