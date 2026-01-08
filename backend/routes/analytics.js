import express from 'express';
import Analytics from '../models/Analytics.js';
import Link from '../models/Link.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview for current user
// @access  Private
router.get('/overview', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Total page views
    const totalViews = await Analytics.countDocuments({
      userId,
      type: 'pageView'
    });

    // Total link clicks
    const totalClicks = await Analytics.countDocuments({
      userId,
      type: 'linkClick'
    });

    // Device breakdown
    const deviceStats = await Analytics.aggregate([
      { $match: { userId, type: 'pageView' } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);

    const deviceBreakdown = {
      mobile: 0,
      desktop: 0,
      tablet: 0
    };

    deviceStats.forEach(stat => {
      deviceBreakdown[stat._id] = stat.count;
    });

    // Get link stats
    const links = await Link.find({ userId }).sort({ order: 1 });

    const linkStats = links.map(link => ({
      _id: link._id,
      title: link.title,
      url: link.url,
      clickCount: link.clickCount,
      isActive: link.isActive
    }));

    // Views over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsOverTime = await Analytics.aggregate([
      {
        $match: {
          userId,
          type: 'pageView',
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalViews,
      totalClicks,
      deviceBreakdown,
      linkStats,
      viewsOverTime
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
