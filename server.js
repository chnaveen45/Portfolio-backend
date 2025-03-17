// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Ensure this line loads the .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://naveenchinthala.netlify.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI; // or your MongoDB Atlas URI

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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

const Form = mongoose.model("Form", FormSchema);

// Root endpoint for health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend server is running" });
});

// API Endpoint
app.post("/Form", async (req, res) => {
  try {
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

app.get("/Display", async (req, res) => {
  try {
    const submissions = await Form.find(); // Fetch all documents
    res.json(submissions); // Send the data as JSON response
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: err.message || "Error fetching data" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: "An error occurred. Please try again." });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});