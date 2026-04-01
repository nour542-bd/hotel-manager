import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelmanager';

console.log('🔍 Testing MongoDB connection...\n');
console.log('URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'));
console.log('');

async function testConnection() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB connected successfully!\n');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Database Statistics:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const hotelsCount = await db.collection('hotels').countDocuments();
    const roomsCount = await db.collection('rooms').countDocuments();
    const usersCount = await db.collection('users').countDocuments();
    const reservationsCount = await db.collection('reservations').countDocuments();
    
    console.log(`🏨 Hotels:        ${hotelsCount}`);
    console.log(`🛏️  Rooms:         ${roomsCount}`);
    console.log(`👥 Users:         ${usersCount}`);
    console.log(`📅 Reservations:  ${reservationsCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 Total:         ${hotelsCount + roomsCount + usersCount + reservationsCount} documents\n`);
    
    if (hotelsCount > 0) {
      console.log('🏨 Sample Hotels:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      const sampleHotels = await db.collection('hotels').find().limit(5).toArray();
      sampleHotels.forEach((hotel, i) => {
        console.log(`${i + 1}. ${hotel.name} (${hotel.address?.city}) - ${hotel.starRating}★`);
      });
      console.log('');
    }
    
    console.log('✅ Everything is working perfectly!\n');
    console.log('🚀 You can now start the server:');
    console.log('   cd backend && npm run dev\n');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed!\n');
    console.error('Error:', error.message);
    console.error('\n📝 Solutions:\n');
    console.error('1️⃣  MongoDB Local:');
    console.error('   - Vérifiez que MongoDB est installé');
    console.error('   - Démarrez le service: "net start MongoDB"');
    console.error('   - Ou lancez: "mongod --dbpath C:\\data\\db"\n');
    console.error('2️⃣  MongoDB Atlas (Cloud):');
    console.error('   - Créez un compte sur https://www.mongodb.com/cloud/atlas');
    console.error('   - Créez un cluster gratuit M0');
    console.error('   - Mettez à jour MONGODB_URI dans backend/.env\n');
    console.error('3️⃣  Vérifiez votre fichier .env:');
    console.error('   - backend/.env doit exister');
    console.error('   - MONGODB_URI doit être correct\n');
    
    process.exit(1);
  }
}

testConnection();
