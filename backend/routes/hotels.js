import express from 'express';
import Hotel from '../models/Hotel.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true }).populate('manager', 'name email');
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('manager', 'name email');
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create hotel (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, address, phone, email, website, amenities } = req.body;

    const hotel = new Hotel({
      name,
      description,
      address,
      phone,
      email,
      website,
      amenities,
      manager: req.user.id,
    });

    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update hotel (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete hotel (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
