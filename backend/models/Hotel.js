import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  address: {
    street: String,
    city: String,
    country: String,
    zipCode: String,
  },
  phone: String,
  email: String,
  website: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  amenities: [String],
  image: String,
  totalRooms: {
    type: Number,
    default: 0,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model('Hotel', hotelSchema);
