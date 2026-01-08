import express from 'express';
import { body, validationResult } from 'express-validator';
import Link from '../models/Link.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/links
// @desc    Get all links for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user._id }).sort({ order: 1 });
    res.json(links);
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/links
// @desc    Create a new link
// @access  Private
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().isLength({ max: 100 }).withMessage('Title is required and must be under 100 characters'),
    body('url').isURL().withMessage('Please enter a valid URL')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, url } = req.body;

      // Get the highest order number
      const maxOrder = await Link.findOne({ userId: req.user._id }).sort({ order: -1 });
      const order = maxOrder ? maxOrder.order + 1 : 0;

      const link = await Link.create({
        userId: req.user._id,
        title,
        url,
        order
      });

      res.status(201).json(link);
    } catch (error) {
      console.error('Create link error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/links/:id
// @desc    Update a link
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, url, isActive } = req.body;

    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (title !== undefined) link.title = title;
    if (url !== undefined) link.url = url;
    if (isActive !== undefined) link.isActive = isActive;

    await link.save();

    res.json(link);
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/links/:id
// @desc    Delete a link
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    await link.deleteOne();

    res.json({ message: 'Link deleted' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/links/reorder
// @desc    Reorder links
// @access  Private
router.put('/reorder/all', protect, async (req, res) => {
  try {
    const { links } = req.body; // Array of { id, order }

    if (!Array.isArray(links)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Update all links
    const updatePromises = links.map(({ id, order }) =>
      Link.updateOne({ _id: id, userId: req.user._id }, { order })
    );

    await Promise.all(updatePromises);

    const updatedLinks = await Link.find({ userId: req.user._id }).sort({ order: 1 });

    res.json(updatedLinks);
  } catch (error) {
    console.error('Reorder links error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
