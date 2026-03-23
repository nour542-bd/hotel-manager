import express from 'express';
import Room from '../models/Room.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const { hotel, status, type } = req.query;
    const filter = { status: 'available' };
    
    if (hotel) filter.hotel = hotel;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const rooms = await Room.find(filter).populate('hotel', 'name');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get rooms by hotel
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const rooms = await Room.find({ hotel: req.params.hotelId }).populate('hotel', 'name');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create room (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { roomNumber, hotel, type, capacity, price, amenities, floor, description } = req.body;

    const room = new Room({
      roomNumber,
      hotel,
      type,
      capacity,
      price,
      amenities,
      floor,
      description,
    });

    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update room (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete room (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
