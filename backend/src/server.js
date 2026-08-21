const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// 1. Uncaught Exceptions (ከመነሳቱ በፊት የሚፈጠሩ Synchronous ኤረሮችን መያዝ)
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const envPath = path.resolve(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const app = require("./app");
const { connectDB } = require("./db");

const PORT = process.env.PORT || 4000;
let server;

async function startServer() {
  try {
    // Connect MongoDB native driver
    await connectDB();

    // Connect Mongoose for models
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookstore', {
      dbName: process.env.DB_NAME || 'bookstore',
    });
    console.log("✅ Mongoose connected successfully");

    server = app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.error("💥 Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

// 2. Unhandled Rejections (ያልተያዙ Async Promise ኤረሮችን መያዝ)
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Gracefully shutting down...");
  console.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// 3. Graceful Shutdown (ሰርቨሩ ሲዘጋ DB connections ንጽህናቸውን ጠብቀው እንዲዘጉ ማድረግ)
process.on("SIGTERM", async () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully...");
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      console.log("💥 Process terminated!");
    });
  }
});