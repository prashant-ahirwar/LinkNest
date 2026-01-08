import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import api from '../utils/api';
import { FiSun, FiMoon, FiEye } from 'react-icons/fi';

const ThemeEditor = ({ profile, onUpdate }) => {
  const defaultTheme = {
    mode: 'light',
    accentColor: '#3b82f6',
    font: 'Inter',
    buttonStyle: 'rounded',
    backgroundType: 'solid',
    backgroundColor: '#ffffff',
    gradientFrom: '#ffffff',
    gradientTo: '#f3f4f6',
  };

  const [theme, setTheme] = useState({
    ...defaultTheme,
    ...(profile?.themeSettings || {})
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(null);

  const presetThemes = [
    { name: 'Ocean', accent: '#0ea5e9', bgFrom: '#f0f9ff', bgTo: '#e0f2fe' },
    { name: 'Forest', accent: '#10b981', bgFrom: '#f0fdf4', bgTo: '#dcfce7' },
    { name: 'Sunset', accent: '#f59e0b', bgFrom: '#fef3c7', bgTo: '#fed7aa' },
    { name: 'Purple', accent: '#a855f7', bgFrom: '#faf5ff', bgTo: '#f3e8ff' },
    { name: 'Rose', accent: '#f43f5e', bgFrom: '#fff1f2', bgTo: '#ffe4e6' },
    { name: 'Dark', accent: '#6366f1', bgFrom: '#1f2937', bgTo: '#111827' },
  ];

  const fonts = [
    { name: 'Inter', label: 'Inter (Modern Sans)' },
    { name: 'Georgia', label: 'Georgia (Classic Serif)' },
    { name: 'Courier New', label: 'Courier (Monospace)' },
    { name: 'Comic Sans MS', label: 'Comic Sans (Playful)' },
    { name: 'Arial', label: 'Arial (Simple Sans)' },
    { name: 'Times New Roman', label: 'Times (Traditional)' },
  ];

  const buttonStyles = [
    { value: 'rounded', label: 'Rounded', class: 'rounded-lg' },
    { value: 'pill', label: 'Pill', class: 'rounded-full' },
    { value: 'square', label: 'Square', class: 'rounded' },
    { value: 'sharp', label: 'Sharp', class: 'rounded-none' },
  ];

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      console.log('Saving theme:', theme);
      const response = await api.put('/user/theme', theme);
      console.log('Theme saved successfully:', response.data);
      onUpdate({ ...profile, themeSettings: response.data });
      setMessage('Theme updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save theme:', error);
      setMessage('Failed to update theme');
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = (key, value) => {
    setTheme({ ...theme, [key]: value });
  };

  const applyPreset = (preset) => {
    setTheme({
      ...theme,
      accentColor: preset.accent,
      backgroundType: 'gradient',
      gradientFrom: preset.bgFrom,
      gradientTo: preset.bgTo,
      mode: preset.name === 'Dark' ? 'dark' : 'light',
    });
  };

  const ColorPickerPopup = ({ color, onChange, label }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowColorPicker(showColorPicker === label ? null : label)}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm hover:border-gray-400 transition-colors"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="input flex-1"
          placeholder="#000000"
        />
      </div>
      {showColorPicker === label && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowColorPicker(null)}
          />
          <div className="absolute z-20 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200">
            <HexColorPicker color={color} onChange={onChange} />
          </div>
        </>
      )}
    </div>
  );

  // Preview style
  const previewStyle = {
    fontFamily: theme.font,
    background: theme.backgroundType === 'solid' 
      ? theme.backgroundColor 
      : `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
    color: theme.mode === 'dark' ? '#ffffff' : '#000000',
  };

  return (
    <div className="space-y-6">
      <div className="card max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Theme Customization</h2>

        {message && (
          <div className={`px-4 py-3 rounded-lg mb-4 ${
            message.includes('success')
              ? 'bg-green-50 border border-green-200 text-green-600'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Controls */}
          <div className="space-y-6">
            {/* Preset Themes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presetThemes.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="p-3 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all text-sm font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${preset.bgFrom}, ${preset.bgTo})`,
                      color: preset.name === 'Dark' ? '#fff' : '#000',
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Theme Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateTheme('mode', 'light')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    theme.mode === 'light'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <FiSun size={20} />
                  Light
                </button>
                <button
                  onClick={() => updateTheme('mode', 'dark')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    theme.mode === 'dark'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <FiMoon size={20} />
                  Dark
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <ColorPickerPopup
              color={theme.accentColor || '#3b82f6'}
              onChange={(color) => updateTheme('accentColor', color)}
              label="Accent Color"
            />

            {/* Background Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Background Style
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateTheme('backgroundType', 'solid')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                    theme.backgroundType === 'solid'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Solid
                </button>
                <button
                  onClick={() => updateTheme('backgroundType', 'gradient')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                    theme.backgroundType === 'gradient'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Gradient
                </button>
              </div>
            </div>

            {/* Background Colors */}
            {theme.backgroundType === 'solid' ? (
              <ColorPickerPopup
                color={theme.backgroundColor || '#ffffff'}
                onChange={(color) => updateTheme('backgroundColor', color)}
                label="Background Color"
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <ColorPickerPopup
                  color={theme.gradientFrom || '#ffffff'}
                  onChange={(color) => updateTheme('gradientFrom', color)}
                  label="Gradient Start"
                />
                <ColorPickerPopup
                  color={theme.gradientTo || '#f3f4f6'}
                  onChange={(color) => updateTheme('gradientTo', color)}
                  label="Gradient End"
                />
              </div>
            )}

            {/* Font Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={theme.font || 'Inter'}
                onChange={(e) => updateTheme('font', e.target.value)}
                className="input"
              >
                {fonts.map((font) => (
                  <option key={font.name} value={font.name} style={{ fontFamily: font.name }}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Button Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Button Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {buttonStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updateTheme('buttonStyle', style.value)}
                    className={`py-2 px-4 border-2 transition-all ${style.class} ${
                      theme.buttonStyle === style.value
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div>
            <div className="sticky top-4">
              <div className="flex items-center gap-2 mb-3">
                <FiEye className="text-gray-600" />
                <label className="text-sm font-medium text-gray-700">Live Preview</label>
              </div>
              <div 
                className="rounded-xl shadow-lg overflow-hidden border-2 border-gray-200"
                style={previewStyle}
              >
                <div className="p-8 text-center">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-300" />
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: theme.font }}>
                    Your Name
                  </h3>
                  <p className="text-sm opacity-75 mb-6" style={{ fontFamily: theme.font }}>
                    Your bio goes here
                  </p>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`py-3 px-4 transition-all cursor-pointer ${
                          buttonStyles.find(s => s.value === theme.buttonStyle)?.class || 'rounded-lg'
                        }`}
                        style={{
                          backgroundColor: theme.accentColor || '#3b82f6',
                          color: '#ffffff',
                        }}
                      >
                        Link {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : 'Save Theme'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;
