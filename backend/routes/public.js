import express from 'express';
import User from '../models/User.js';
import Link from '../models/Link.js';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// Helper function to detect device type
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'desktop';
  
  if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) {
    return /tablet|ipad/i.test(userAgent) ? 'tablet' : 'mobile';
  }
  return 'desktop';
};

// @route   GET /api/public/:username
// @desc    Get public profile by username
// @access  Public
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get active links
    const links = await Link.find({ userId: user._id, isActive: true })
      .sort({ order: 1 })
      .select('-userId');

    // Track page view
    const deviceType = getDeviceType(req.headers['user-agent']);
    
    await Analytics.create({
      userId: user._id,
      type: 'pageView',
      deviceType
    });

    res.json({
      user: {
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        profileImage: user.profileImage,
        themeSettings: user.themeSettings
      },
      links
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/public/track-click/:linkId
// @desc    Track link click
// @access  Public
router.post('/track-click/:linkId', async (req, res) => {
  try {
    const { linkId } = req.params;

    const link = await Link.findById(linkId);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Increment click count
    link.clickCount += 1;
    await link.save();

    // Track analytics
    const deviceType = getDeviceType(req.headers['user-agent']);
    
    await Analytics.create({
      userId: link.userId,
      type: 'linkClick',
      linkId: link._id,
      deviceType
    });

    res.json({ message: 'Click tracked' });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
