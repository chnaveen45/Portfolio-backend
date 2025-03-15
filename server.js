// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Ensure this line loads the .env file

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI; // or your MongoDB Atlas URI

// Create a connection function that can be called for each request
let cachedDb = null;
const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  
  try {
    const client = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = client;
    console.log('Connected to MongoDB');
    return client;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Mongoose Schema and Model
const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  dateTime: {
    type: String, // Store formatted date and time as a single string
    default: () => {
      const istFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // 12-hour format with AM/PM
      });

      return istFormatter.format(new Date());
    },
  },
});

const Form = mongoose.models.Form || mongoose.model("Form", FormSchema);

// Root endpoint for health check
app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Backend server is running" });
  } catch (error) {
    console.error('Error in root endpoint:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// API Endpoint
app.post("/Form", async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const { name, email, message } = req.body;
    console.log("Received form data:", { name, email, message });

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newFormSubmission = new Form({ name, email, message });
    await newFormSubmission.save();

    res.status(200).json({ message: "Form submitted successfully." });
  } catch (error) {
    console.error("Error saving form submission:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: "An error occurred. Please try again." });
});

// Start the Server only in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;