const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function importData() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('contacts');

    // Read the JSON file
    const data = JSON.parse(fs.readFileSync('./contacts-data.json', 'utf8'));

    // Check if collection is empty before importing
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log('Collection already has data. Skipping import.');
      return;
    }

    // Insert the data
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

importData();
