const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_123";

async function registerUserService({ name, email, password, role = "user" }) {
  const db = await getDB();
  
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(newUser);
  return { id: result.insertedId, name, email, role };
}

async function loginUserService({ email, password }) {
  const db = await getDB();

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
}

module.exports = {
  registerUserService,
  loginUserService,
};