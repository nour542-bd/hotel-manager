import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';
import Reservation from './models/Reservation.js';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

// Nettoyer la DB
await User.deleteMany({});
await Hotel.deleteMany({});
await Room.deleteMany({});
await Reservation.deleteMany({});

// Créer les utilisateurs
const users = await User.create([
  { name: 'Admin', email: 'admin@hotel.com', password: 'password', role: 'admin' },
  { name: 'Ahmed Ben Ali', email: 'client@hotel.com', password: 'password', role: 'client' },
  { name: 'Sara Mansour', email: 'sara@hotel.com', password: 'password', role: 'client' },
]);

// Créer les hôtels
const hotels = await Hotel.create([
  {
    name: 'Hôtel Le Méditerranée',
    description: 'Un hôtel luxueux face à la mer avec vue panoramique.',
    address: { street: '12 Rue de la Plage', city: 'Tunis', country: 'Tunisie', zipCode: '1000' },
    phone: '+216 71 234 567',
    email: 'contact@mediterranee.tn',
    amenities: ['WiFi', 'Piscine', 'Spa', 'Restaurant', 'Parking'],
    totalRooms: 50,
    isActive: true,
  },
  {
    name: 'Hôtel Carthage Palace',
    description: 'Hôtel 5 étoiles au cœur de Carthage avec service premium.',
    address: { street: '5 Avenue Habib Bourguiba', city: 'Carthage', country: 'Tunisie', zipCode: '2016' },
    phone: '+216 71 345 678',
    email: 'info@carthagepalace.tn',
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Conférence'],
    totalRooms: 80,
    isActive: true,
  },
  {
    name: 'Hôtel Sousse Beach',
    description: 'Hôtel familial idéal pour les vacances en bord de mer.',
    address: { street: '8 Boulevard de la Corniche', city: 'Sousse', country: 'Tunisie', zipCode: '4000' },
    phone: '+216 73 456 789',
    email: 'contact@soussebeach.tn',
    amenities: ['WiFi', 'Piscine', 'Plage Privée', 'Animations'],
    totalRooms: 60,
    isActive: true,
  },
]);

// Créer les chambres
const rooms = await Room.create([
  // Hôtel 1
  { roomNumber: '101', hotel: hotels[0]._id, type: 'single', capacity: 1, price: 80, status: 'available', floor: 1, description: 'Chambre simple confortable' },
  { roomNumber: '102', hotel: hotels[0]._id, type: 'double', capacity: 2, price: 120, status: 'available', floor: 1, description: 'Chambre double avec balcon' },
  { roomNumber: '201', hotel: hotels[0]._id, type: 'suite', capacity: 4, price: 250, status: 'available', floor: 2, description: 'Suite luxueuse avec jacuzzi' },
  { roomNumber: '202', hotel: hotels[0]._id, type: 'deluxe', capacity: 2, price: 180, status: 'occupied', floor: 2, description: 'Chambre deluxe vue mer' },

  // Hôtel 2
  { roomNumber: '101', hotel: hotels[1]._id, type: 'double', capacity: 2, price: 150, status: 'available', floor: 1, description: 'Chambre double standard' },
  { roomNumber: '102', hotel: hotels[1]._id, type: 'suite', capacity: 3, price: 300, status: 'available', floor: 1, description: 'Suite présidentielle' },
  { roomNumber: '201', hotel: hotels[1]._id, type: 'deluxe', capacity: 2, price: 200, status: 'maintenance', floor: 2, description: 'Chambre deluxe avec terrasse' },

  // Hôtel 3
  { roomNumber: '101', hotel: hotels[2]._id, type: 'single', capacity: 1, price: 60, status: 'available', floor: 1, description: 'Chambre simple économique' },
  { roomNumber: '102', hotel: hotels[2]._id, type: 'double', capacity: 2, price: 100, status: 'available', floor: 1, description: 'Chambre double vue jardin' },
  { roomNumber: '201', hotel: hotels[2]._id, type: 'villa', capacity: 6, price: 400, status: 'available', floor: 0, description: 'Villa privée avec piscine' },
]);

// Créer les réservations
await Reservation.create([
  {
    reservationNumber: 'RES-001',
    client: users[1]._id,
    room: rooms[0]._id,
    hotel: hotels[0]._id,
    checkInDate: new Date('2026-04-01'),
    checkOutDate: new Date('2026-04-05'),
    numberOfGuests: 1,
    status: 'confirmed',
    totalPrice: 320,
    paymentStatus: 'completed',
    specialRequests: 'Chambre non-fumeur',
  },
  {
    reservationNumber: 'RES-002',
    client: users[2]._id,
    room: rooms[2]._id,
    hotel: hotels[0]._id,
    checkInDate: new Date('2026-04-10'),
    checkOutDate: new Date('2026-04-15'),
    numberOfGuests: 3,
    status: 'pending',
    totalPrice: 1250,
    paymentStatus: 'pending',
    specialRequests: 'Lit bébé requis',
  },
  {
    reservationNumber: 'RES-003',
    client: users[1]._id,
    room: rooms[5]._id,
    hotel: hotels[1]._id,
    checkInDate: new Date('2026-05-01'),
    checkOutDate: new Date('2026-05-03'),
    numberOfGuests: 2,
    status: 'confirmed',
    totalPrice: 600,
    paymentStatus: 'completed',
  },
  {
    reservationNumber: 'RES-004',
    client: users[2]._id,
    room: rooms[8]._id,
    hotel: hotels[2]._id,
    checkInDate: new Date('2026-03-20'),
    checkOutDate: new Date('2026-03-25'),
    numberOfGuests: 2,
    status: 'checked-out',
    totalPrice: 500,
    paymentStatus: 'completed',
  },
]);

console.log('✅ Données de test créées avec succès !');
console.log('👤 Admin:  admin@hotel.com / password');
console.log('👤 Client: client@hotel.com / password');
console.log('👤 Client: sara@hotel.com / password');
await mongoose.disconnect();