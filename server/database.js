require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
const connectToMongoDB = async () => {
  if (!client) {
    try {
      console.log("Attempting to connect to MongoDB...");
      client = await MongoClient.connect(uri, options);
      console.log("Successfully connected to MongoDB.");
      
      // Test the connection
      await client.db().admin().ping();
      console.log("Database ping successful.");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      if (error.message.includes("tls")) {
        console.error("TLS Connection Error Details:", {
          uri: uri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'),
          options
        });
      }
      throw error;
    }
  }
  return client;
};

const getConnectedClient = () => {
  if (!client) {
    throw new Error("MongoDB client not initialized. Call connectToMongoDB first.");
  }
  return client;
};

module.exports = { connectToMongoDB, getConnectedClient };