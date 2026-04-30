import mongoose from 'mongoose';

const uri = "mongodb+srv://ethanjmichael03_db_user:nQWLxrRPdowkHt1I@fresha.xygpqxj.mongodb.net/?appName=fresha";

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB.");
    
    // We are looking for the businesses collection
    const db = mongoose.connection.db;
    const businesses = db.collection('businesses');
    const allBusinesses = await businesses.find({}).toArray();
    
    console.log(`Found ${allBusinesses.length} businesses.`);
    allBusinesses.forEach(b => {
      console.log(`- ID: ${b._id}, Name: ${b.name}, Status: ${b.subscriptionStatus}, Token: ${b.payfastToken ? 'Yes' : 'No'}, Expires: ${b.subscriptionExpiresAt}`);
    });
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
