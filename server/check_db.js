import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
   const count = await mongoose.connection.collection('appointments').countDocuments();
   console.log('Appts count: ' + count);
   process.exit(0);
});
