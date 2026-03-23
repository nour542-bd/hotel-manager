import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const users = await User.find({}).select('+password');
console.log('Utilisateurs dans la DB:');
console.log(JSON.stringify(users, null, 2));

await mongoose.disconnect();