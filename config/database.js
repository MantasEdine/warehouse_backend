// I wrote this code and it could be changed at any moment
// I'm leaving the following comments to explain every step I took and why:

// import mongoose
import mongoose from "mongoose";
// import dotenv
import dotenv from "dotenv";

// config dotenv to load env variables into global nodeJs process env so they become accessible 
dotenv.config();

// assigning the connection object to "connect" variable to make it easily accessible
const connect = mongoose.connection;

// assigning promise library of mongoose to global promise library
// why? This is important for handling asynchronous operations consistently
mongoose.Promise = global.Promise;

// forcing mongoose to follow strict queries forced by schema I make and only focus on important queries
mongoose.set("strictQuery", true);

// Starting connection to Database
export const connectDB = async () => {
  // url env variable
  const url = process.env.DB_STRING;

  // #Case1 connection established
  connect.on("connected", () => {
    console.log("✅ Connected to Database");
  });

  // #Case2 reconnection established
  connect.on("reconnected", () => {
    console.log("♻️ Connection to Database Reestablished");
  });

  // #Case3 database disconnected
  connect.on("disconnected", () => {
    console.log("⚠️ Disconnected from Database");
    console.log("Trying to reconnect...");

    // Trying to reestablish a connection with a delay using setTimeout()
    setTimeout(() => {
      mongoose.connect(url, {
           // keep TCP connection alive with MongoDB
        socketTimeoutMS: 3000,    // time interval before killing inactive socket
        connectTimeoutMS: 3000,   // waiting interval before throwing error
      });
    }, 3000);
  });

  // #Case4 connection closed
  connect.on("close", () => {
    console.log("🔒 Database Connection Closed");
  });

  // #Case5 error occurred
  connect.on("error", (error) => {
    console.error("❌ Error with Database Connection:", error);
  });

  // Initial connection
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.error("❌ Error connecting to Database:", error);
  }

  // Graceful shutdown on process termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🛑 MongoDB disconnected on app termination");
    process.exit(0);
  });
};
