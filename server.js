require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const validAadhaarDB = { "123456789009": "+919876543210" }; // Aadhaar-to-mobile mapping
let storedOTP = null;
let otpExpiration = null;

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

app.post("/send-otp", async (req, res) => {
    const { aadhaarNumber } = req.body;

    if (!validAadhaarDB[aadhaarNumber]) {
        return res.json({ success: false, message: "Aadhaar number not registered!" });
    }

    storedOTP = Math.floor(100000 + Math.random() * 900000);
    otpExpiration = Date.now() + 30000; // OTP expires in 30 seconds

    try {
        await twilioClient.messages.create({
            body: `Your OTP is ${storedOTP}. It expires in 30 seconds.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: validAadhaarDB[aadhaarNumber]
        });

        res.json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        res.json({ success: false, message: "Failed to send OTP. Try again!" });
    }
});

app.post("/verify-otp", (req, res) => {
    const { otp } = req.body;

    if (!storedOTP || Date.now() > otpExpiration) {
        return res.json({ success: false, message: "OTP expired. Request a new one." });
    }

    if (otp == storedOTP) {
        storedOTP = null; // Reset OTP after successful verification
        res.json({ success: true, message: "OTP verified successfully!" });
    } else {
        res.json({ success: false, message: "Invalid OTP. Try again!" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));

