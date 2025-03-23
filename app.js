const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock database of registered users (Replace with actual database)
const users = {
    "123456789": { name: "John Doe", fingerprint: "abcd1234xyz" } // Example user
};

// **Capture & Verify Fingerprint**
app.post("/verify-biometric", async (req, res) => {
    try {
        const { aadhaarNumber, fingerprintData } = req.body;

        // Check if Aadhaar number exists
        if (!users[aadhaarNumber]) {
            return res.status(404).json({ success: false, message: "Aadhaar not found" });
        }

        // Simulate API call to fingerprint verification service
        const response = await axios.post("https://biometric-api.example.com/verify", {
            aadhaarNumber: aadhaarNumber,
            fingerprintData: fingerprintData
        });

        if (response.data.match) {
            res.json({ success: true, message: "Biometric verified successfully" });
        } else {
            res.status(401).json({ success: false, message: "Fingerprint mismatch" });
        }
    } catch (error) {
        console.error("Error in biometric verification:", error);
        res.status(500).json({ success: false, message: "Biometric verification failed" });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
