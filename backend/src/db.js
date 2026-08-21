const path = require("path");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

// Load .env from backend/.env
const envPath = path.resolve(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "bookstore";

let client;
let db;

async function connectDB() {
  if (db) {
    return db;
  }

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  try {
    console.log("📡 Connecting to MongoDB...");
    console.log(`   Using: ${uri.replace(/\/\/.*@/, "//***:***@")}`);
    
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 10000,
      retryWrites: true,
    });

    await client.connect();

    // Verify MongoDB connection
    await client.db("admin").command({ ping: 1 });

    db = client.db(dbName);

    console.log("✅ MongoDB connected successfully");
    console.log(`📚 Database: ${dbName}`);

    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error("Reason:", error.message);
    console.error("\n⚠️  Make sure MongoDB is running locally!");
    console.error("   Windows: Install MongoDB Community or use Docker");
    console.error("   Command: docker run -d -p 27017:27017 --name mongodb mongo:latest");
    console.error("\n   Or install from: https://www.mongodb.com/try/download/community");

    if (client) {
      await client.close().catch(() => {});
    }

    client = null;
    db = null;

    throw error;
  }
}

async function getDB() {
  if (!db) {
    await connectDB();
  }

  return db;
}

async function closeDB() {
  if (client) {
    await client.close();

    client = null;
    db = null;

    console.log("MongoDB connection closed");
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB,
};