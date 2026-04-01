import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelmanager';

// Real Hotels in Tunisia with photos
const hotelsData = [
  {
    name: 'Laico Tunis Hotel',
    description: 'Hôtel 5 étoiles situé au cœur de Tunis, offrant une vue imprenable sur le lac. Luxe et confort avec des chambres spacieuses et des équipements de premier ordre.',
    address: {
      street: 'Avenue Mohamed V',
      city: 'Tunis',
      country: 'Tunisie',
      zipCode: '1002'
    },
    phone: '+216 71 102 000',
    email: 'contact@laicotunis.com',
    website: 'www.laico-tunis.com',
    amenities: ['wifi', 'restaurant', 'parking', 'gym', 'spa', 'pool'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    totalRooms: 250,
    starRating: 5,
    isActive: true
  },
  {
    name: 'Dar Hayet Resort & Spa',
    description: 'Resort de luxe à Hammamet avec plage privée, piscines à débordement et spa de classe mondiale. Parfait pour des vacances inoubliables en bord de mer.',
    address: {
      street: 'Zone Touristique',
      city: 'Hammamet',
      country: 'Tunisie',
      zipCode: '8050'
    },
    phone: '+216 72 280 044',
    email: 'info@darhayet.com',
    website: 'www.darhayet-resort.com',
    amenities: ['wifi', 'restaurant', 'parking', 'gym', 'spa', 'pool'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
    totalRooms: 180,
    starRating: 5,
    isActive: true
  },
  {
    name: 'Sahara Palace Tozeur',
    description: 'Hôtel de charme au cœur du désert tunisien. Architecture traditionnelle, oasis de paix avec piscines et jardins luxuriants.',
    address: {
      street: 'Avenue Abou El Kacem Chebbi',
      city: 'Tozeur',
      country: 'Tunisie',
      zipCode: '2200'
    },
    phone: '+216 76 452 888',
    email: 'reservation@saharapalace.tn',
    website: 'www.sahara-palace.com',
    amenities: ['wifi', 'restaurant', 'parking', 'pool', 'spa'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    totalRooms: 120,
    starRating: 4,
    isActive: true
  },
  {
    name: 'Monastir Beach Hotel',
    description: 'Hôtel balnéaire face à la mer avec plage privée de sable fin. Idéal pour les familles et les couples en quête de détente.',
    address: {
      street: 'Boulevard de l\'Environnement',
      city: 'Monastir',
      country: 'Tunisie',
      zipCode: '5000'
    },
    phone: '+216 73 520 500',
    email: 'contact@monastirbeach.tn',
    website: 'www.monastir-beach.com',
    amenities: ['wifi', 'restaurant', 'parking', 'pool', 'gym'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    totalRooms: 85,
    starRating: 4,
    isActive: true
  },
  {
    name: 'The Residence Tunis',
    description: 'Palais de luxe inspiré des demeures andalouses. Suites somptueuses, golf 18 trous, et service 5 étoiles exceptionnel.',
    address: {
      street: 'Les Côtes de Carthage',
      city: 'Tunis',
      country: 'Tunisie',
      zipCode: '1000'
    },
    phone: '+216 71 910 101',
    email: 'residence@the-residence.com',
    website: 'www.the-residence.com',
    amenities: ['wifi', 'restaurant', 'parking', 'gym', 'spa', 'pool'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
    totalRooms: 143,
    starRating: 5,
    isActive: true
  },
  {
    name: 'Mövenpick Resort Sousse',
    description: 'Resort tout compris avec vue panoramique sur la Méditerranée. Piscines, restaurants gastronomiques et animations pour toute la famille.',
    address: {
      street: 'Boulevard 7 Novembre',
      city: 'Sousse',
      country: 'Tunisie',
      zipCode: '4000'
    },
    phone: '+216 73 242 000',
    email: 'info.sousse@movenpick.com',
    website: 'www.movenpick-sousse.com',
    amenities: ['wifi', 'restaurant', 'parking', 'gym', 'spa', 'pool'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
    totalRooms: 200,
    starRating: 5,
    isActive: true
  },
  {
    name: 'Hasdrubal Prestige Djerba',
    description: 'Hôtel de prestige sur l\'île de Djerba. Architecture punique, thalassothérapie et plages de sable blanc.',
    address: {
      street: 'Zone Touristique de Mezraya',
      city: 'Djerba',
      country: 'Tunisie',
      zipCode: '4180'
    },
    phone: '+216 75 650 000',
    email: 'prestige@hasdrubal-djerba.com',
    website: 'www.hasdrubal-djerba.com',
    amenities: ['wifi', 'restaurant', 'parking', 'gym', 'spa', 'pool'],
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop',
    totalRooms: 165,
    starRating: 5,
    isActive: true
  },
  {
    name: 'Iberostar Kantaoui Bay',
    description: 'Complexe hôtelier moderne à Port El Kantaoui. Golf, marina, et toutes les commodités pour des vacances réussies.',
    address: {
      street: 'Port El Kantaoui',
      city: 'Sousse',
      country: 'Tunisie',
      zipCode: '4089'
    },
    phone: '+216 73 348 600',
    email: 'kantaoui@iberostar.com',
    website: 'www.iberostar-kantaoui.com',
    amenities: ['wifi', 'restaurant', 'parking', 'gym', 'pool'],
    image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&auto=format&fit=crop',
    totalRooms: 294,
    starRating: 4,
    isActive: true
  },
  {
    name: 'Royal Jinene Sousse',
    description: 'Hôtel 4 étoiles avec accès direct à la plage. Chambres confortables, restaurants variés et centre de bien-être.',
    address: {
      street: 'Boulevard 14 Janvier',
      city: 'Sousse',
      country: 'Tunisie',
      zipCode: '4000'
    },
    phone: '+216 73 242 700',
    email: 'info@royaljinene.com',
    website: 'www.royal-jinene.com',
    amenities: ['wifi', 'restaurant', 'parking', 'pool', 'spa'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    totalRooms: 178,
    starRating: 4,
    isActive: true
  },
  {
    name: 'El Mouradi Cap Mahdia',
    description: 'Village vacances en bord de mer avec piscine à vagues, toboggans et animations. Parfait pour les familles.',
    address: {
      street: 'Route de la Corniche',
      city: 'Mahdia',
      country: 'Tunisie',
      zipCode: '5100'
    },
    phone: '+216 73 680 000',
    email: 'capmahdia@elmouradi.com',
    website: 'www.elmouradi-capmahdia.com',
    amenities: ['wifi', 'restaurant', 'parking', 'pool', 'gym'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
    totalRooms: 420,
    starRating: 4,
    isActive: true
  },
  {
    name: 'Golden Tulip Carthage Tunis',
    description: 'Hôtel moderne proche des sites archéologiques de Carthage. Vue sur la mer, rooftop et centre de conférences.',
    address: {
      street: 'Avenue de la République',
      city: 'Carthage',
      country: 'Tunisie',
      zipCode: '2016'
    },
    phone: '+216 71 733 000',
    email: 'carthage@goldentulip.com',
    website: 'www.goldentulip-carthage.com',
    amenities: ['wifi', 'restaurant', 'parking', 'gym', 'pool'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    totalRooms: 150,
    starRating: 4,
    isActive: true
  },
  {
    name: 'Radisson Blu Palace Djerba',
    description: 'Palace exceptionnel sur l\'île aux rêves. Jardins méditerranéens, spa Baliné et plages privées.',
    address: {
      street: 'Zone Touristique',
      city: 'Djerba',
      country: 'Tunisie',
      zipCode: '4180'
    },
    phone: '+216 75 650 555',
    email: 'info.djerba@radissonblu.com',
    website: 'www.radissonblu-djerba.com',
    amenities: ['wifi', 'restaurant', 'parking', 'gym', 'spa', 'pool'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    totalRooms: 209,
    starRating: 5,
    isActive: true
  }
];

// Sample Rooms for each hotel
const generateRooms = (hotelId, hotelName) => {
  const roomTypes = [
    { type: 'standard', capacity: 2, priceRange: [150, 250] },
    { type: 'deluxe', capacity: 2, priceRange: [250, 400] },
    { type: 'suite', capacity: 3, priceRange: [400, 700] },
    { type: 'presidential', capacity: 4, priceRange: [800, 1500] },
  ];

  const rooms = [];
  const totalRooms = Math.floor(Math.random() * 20) + 10; // 10-30 rooms per hotel for demo

  for (let i = 1; i <= totalRooms; i++) {
    const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    const price = Math.floor(Math.random() * (roomType.priceRange[1] - roomType.priceRange[0]) + roomType.priceRange[0]);
    
    rooms.push({
      roomNumber: `${100 + i}`,
      hotel: hotelId,
      type: roomType.type,
      capacity: roomType.capacity,
      price: price,
      amenities: ['wifi', 'tv', 'minibar', 'ac'],
      images: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop',
      ],
      status: Math.random() > 0.2 ? 'available' : 'occupied', // 80% available
      description: `Chambre ${roomType.type} avec vue${roomType.type === 'suite' ? ' panoramique' : ''}, équipée de tous les confort modernes.`,
      floor: Math.floor(Math.random() * 5) + 1,
    });
  }

  return rooms;
};

// Sample Users (Clients)
const usersData = [
  {
    name: 'Ahmed Ben Ali',
    email: 'ahmed.benali@email.tn',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // "password" hashed
    role: 'client',
    phone: '+216 20 123 456',
    isActive: true
  },
  {
    name: 'Fatma Gharbi',
    email: 'fatma.gharbi@email.tn',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    role: 'client',
    phone: '+216 21 234 567',
    isActive: true
  },
  {
    name: 'Mohamed Trabelsi',
    email: 'mohamed.trabelsi@email.tn',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    role: 'client',
    phone: '+216 22 345 678',
    isActive: true
  },
  {
    name: 'Amira Ben Salah',
    email: 'amira.bensalah@email.tn',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    role: 'client',
    phone: '+216 23 456 789',
    isActive: true
  },
  {
    name: 'Admin Hotel',
    email: 'admin@hotel.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    role: 'admin',
    phone: '+216 70 000 000',
    isActive: true
  },
  {
    name: 'Client Demo',
    email: 'client@hotel.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    role: 'client',
    phone: '+216 24 567 890',
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Base de données effacée');

    // Create collections
    const usersCollection = mongoose.connection.collection('users');
    const hotelsCollection = mongoose.connection.collection('hotels');
    const roomsCollection = mongoose.connection.collection('rooms');
    const reservationsCollection = mongoose.connection.collection('reservations');

    // Insert users
    const users = await usersCollection.insertMany(usersData);
    console.log(`✅ ${users.insertedCount} utilisateurs créés`);

    // Insert hotels
    const hotels = await hotelsCollection.insertMany(hotelsData);
    console.log(`✅ ${hotels.insertedCount} hôtels créés`);

    // Generate and insert rooms for each hotel
    let totalRooms = 0;
    for (let i = 0; i < hotelsData.length; i++) {
      const hotelId = hotels.insertedIds[i];
      const rooms = generateRooms(hotelId, hotelsData[i].name);
      const insertedRooms = await roomsCollection.insertMany(rooms);
      totalRooms += insertedRooms.insertedCount;
    }
    console.log(`✅ ${totalRooms} chambres créées`);

    // Generate sample reservations
    const clientIds = Object.values(users.insertedIds);
    const hotelIds = Object.values(hotels.insertedIds);
    const allRooms = await roomsCollection.find().toArray();
    
    const reservations = [];
    const statuses = ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'];
    const paymentStatuses = ['pending', 'completed', 'refunded'];

    // Create 20 sample reservations
    for (let i = 0; i < 20; i++) {
      const randomClient = clientIds[Math.floor(Math.random() * clientIds.length)];
      const randomHotel = hotelIds[Math.floor(Math.random() * hotelIds.length)];
      const hotelRooms = allRooms.filter(r => r.hotel && r.hotel.toString() === randomHotel.toString());
      const randomRoom = hotelRooms.length > 0 ? hotelRooms[0] : null;
      
      if (!randomRoom || !randomClient) continue;

      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30));
      
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);

      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * randomRoom.price;

      reservations.push({
        reservationNumber: `RES-${Date.now()}-${i + 1}`,
        client: randomClient,
        room: randomRoom._id,
        hotel: randomHotel,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        numberOfGuests: Math.floor(Math.random() * randomRoom.capacity) + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        totalPrice: totalPrice,
        specialRequests: Math.random() > 0.5 ? 'Chambre avec vue, lit king size' : '',
        paymentMethod: ['card', 'cash', 'transfer'][Math.floor(Math.random() * 3)],
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const insertedReservations = await reservationsCollection.insertMany(reservations);
    console.log(`✅ ${insertedReservations.insertedCount} réservations créées`);

    // Create indexes
    await hotelsCollection.createIndex({ name: 'text', 'address.city': 'text' });
    await roomsCollection.createIndex({ hotel: 1, status: 1 });
    await reservationsCollection.createIndex({ client: 1, hotel: 1, status: 1 });
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    console.log('\n🎉 Base de données initialisée avec succès!');
    console.log('\n📊 Récapitulatif:');
    console.log(`   - ${users.insertedCount} utilisateurs`);
    console.log(`   - ${hotels.insertedCount} hôtels réels en Tunisie`);
    console.log(`   - ${totalRooms} chambres`);
    console.log(`   - ${insertedReservations.insertedCount} réservations`);
    
    console.log('\n🏨 Hôtels ajoutés:');
    hotelsData.forEach((h, i) => {
      console.log(`   ${i + 1}. ${h.name} (${h.address.city}) - ${h.starRating}★`);
    });

    console.log('\n👤 Comptes de démonstration:');
    console.log('   Admin: admin@hotel.com / password');
    console.log('   Client: client@hotel.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedDatabase();
