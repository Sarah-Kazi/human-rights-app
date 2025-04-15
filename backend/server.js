// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Read JSON data

// Connect to MongoDB (database)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.log("Error:", err));

// Create a "Complaint" model (like a table)
const complaintSchema = new mongoose.Schema({
  name: String,
  email: String,
  complaint: String,
  date: { type: Date, default: Date.now }
});
const Complaint = mongoose.model('Complaint', complaintSchema);

// Save complaints to the database
app.post('/api/complaints', async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    await newComplaint.save();
    res.status(201).json({ message: "Complaint saved!" });
  } catch (error) {
    res.status(500).json({ error: "Oops! Something broke." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

const dialogflow = require('@google-cloud/dialogflow');

// Detect violated rights using AI
async function detectViolation(text) {
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: 'dialogflow-key.json' // Download from Google Cloud
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    'rightschecker-lsiy', // Replace with your actual ID
    'unique-session-id'
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: { text, languageCode: 'en' },
    },
  };

  const [response] = await sessionClient.detectIntent(request);
  return response.queryResult;
}

// New API endpoint for AI analysis
app.post('/api/check-violation', async (req, res) => {
    const { text } = req.body;
    try {
      const result = await detectViolation(text);
      
      // Prioritize Dialogflow's response
      if (result.fulfillmentText) {
        res.json({ message: result.fulfillmentText });
      } else {
        res.json({ message: "Sorry, I didn’t understand. Please describe your issue in simple terms." });
      }
    } catch (error) {
      res.status(500).json({ message: "AI service unavailable. Try again later." });
    }
  });
  const twilio = require('twilio');

// Initialize Twilio client with test credentials
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Emergency endpoint for SMS
app.post('/api/emergency', async (req, res) => {
  const { lat, long } = req.body;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;

  try {
    // Send SMS
    await client.messages.create({
      body: `🚨 EMERGENCY! Location: ${googleMapsLink}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+918369282400' // Verified number (replace with yours)
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMS Error:", error);
    res.status(500).json({ success: false });
  }
});
