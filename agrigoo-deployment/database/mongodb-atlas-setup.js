// MongoDB Atlas Setup Script
// Run this script to create collections with proper indexes

db = db.getSiblingDB('agrigoo');

// Create collections
db.createCollection('users');
db.createCollection('crops');
db.createCollection('diseases');
db.createCollection('detections');
db.createCollection('outbreaks');
db.createCollection('soilTests');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.crops.createIndex({ name: 1 });
db.diseases.createIndex({ name: 1 });
db.detections.createIndex({ userId: 1, timestamp: -1 });
db.outbreaks.createIndex({ location: "2dsphere" });
db.outbreaks.createIndex({ disease: 1, timestamp: -1 });
db.soilTests.createIndex({ userId: 1, timestamp: -1 });

// Create initial admin user if not exists
if (db.users.countDocuments({ role: "admin" }) === 0) {
  db.users.insertOne({
    name: "Admin",
    email: "admin@agrigoo.com",
    password: "$2b$10$randomHashToBeReplacedWithProperHash",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

print("MongoDB Atlas setup completed successfully!");