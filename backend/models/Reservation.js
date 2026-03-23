import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  reservationNumber: {
    type: String,
    unique: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  specialRequests: String,
  paymentMethod: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Generate reservation number before saving
reservationSchema.pre('save', async function(next) {
  if (this.isNew && !this.reservationNumber) {
    const count = await mongoose.model('Reservation').countDocuments();
    this.reservationNumber = `RES-${Date.now()}-${count + 1}-${Math.random().toString(36).substr(2, 5)}`;
  }
  next();
});

export default mongoose.model('Reservation', reservationSchema);
