import express from 'express';
import Reservation from '../models/Reservation.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  notifyNewReservation,
  notifyCancelledReservation,
  notifyReservationStatus,
  notifyPaymentStatus
} from '../services/notificationService.js';

const router = express.Router();

// Get all reservations
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, hotel } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (hotel) filter.hotel = hotel;

    const reservations = await Reservation.find(filter)
      .populate('client', 'name email phone')
      .populate('room', 'roomNumber type')
      .populate('hotel', 'name');
    
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's reservations
router.get('/my-reservations', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ client: req.user.id })
      .populate('room', 'roomNumber type price')
      .populate('hotel', 'name address');
    
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get reservation by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('client')
      .populate('room')
      .populate('hotel');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && reservation.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create reservation
router.post('/', protect, async (req, res) => {
  try {
    const { room, hotel, checkInDate, checkOutDate, numberOfGuests, specialRequests, totalPrice, paymentMethod } = req.body;

    const reservation = new Reservation({
      client: req.user.id,
      room,
      hotel,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      totalPrice,
      paymentMethod: paymentMethod || 'card',
    });

    await reservation.save();
    
    // Populate for notifications
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('client', 'name')
      .populate('hotel', 'name');
    
    // Notify admins about new reservation
    await notifyNewReservation(populatedReservation);
    
    // Notify client about their reservation (pending status)
    await notifyReservationStatus(populatedReservation, 'pending');
    
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update reservation (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    // Populate for notifications
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('client', 'name')
      .populate('hotel', 'name');
    
    // Send notifications based on status changes
    if (req.body.status) {
      await notifyReservationStatus(populatedReservation, req.body.status);
    }
    
    if (req.body.paymentStatus) {
      await notifyPaymentStatus(populatedReservation, req.body.paymentStatus);
    }
    
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cancel reservation
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (req.user.role !== 'admin' && reservation.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    reservation.status = 'cancelled';
    await reservation.save();
    
    // Populate for notifications
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('client', 'name')
      .populate('hotel', 'name');

    // Notify admins about cancellation
    await notifyCancelledReservation(populatedReservation);
    
    // Notify client about cancellation
    await notifyReservationStatus(populatedReservation, 'cancelled');

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete reservation (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
