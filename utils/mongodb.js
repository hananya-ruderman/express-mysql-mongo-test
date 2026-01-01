import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:password123@localhost:27017/users_db?authSource=admin";
const DB_NAME = "users_db";
const COLLECTION_NAME = "users"

let mongocClient = null;
let mongoConn = null;

export async function initMongoDb() {
  try {
    mongocClient = new MongoClient(MONGO_URL);
    await mongocClient.connect();
    mongoConn = mongocClient.db(DB_NAME);
    
    const productsCollection = mongoConn.collection(COLLECTION_NAME);

    await productsCollection.createIndex({ username: 1 }, { unique: true });
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export async function getMongoConn() {
  if (!mongoConn) {
    if (!mongocClient) {
      mongocClient = new MongoClient(MONGO_URL);
      await mongocClient.connect();
    }
    mongoConn = mongocClient.db(DB_NAME);
  }
  return mongoConn;
}

export async function closeConnection() {
  if (mongocClient) {
    await mongocClient.close();
    mongocClient = null;
    mongoConn = null;
  }
}

