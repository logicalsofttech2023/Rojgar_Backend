import admin from "./firebase.js";
import { getAuth } from "firebase-admin/auth";

export const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body; // 📌 User's Mobile Number (with country code)

  if (!phoneNumber) {
    return res.status(400).json({ status: "false", error: "Phone number required" });
  }

  try {
    const userRecord = await getAuth().getUserByPhoneNumber(phoneNumber);
    
    if (!userRecord) {
      await getAuth().createUser({ phoneNumber });
    }

    const verification = await getAuth().generateSignInWithEmailLink(phoneNumber, {
      url: "https://your-app.com/verify-otp",
      handleCodeInApp: true,
    });

    res.status(200).json({ status: "true", message: "OTP sent successfully", verification });
  } catch (error) {
    res.status(500).json({ status: "false", error: error.message });
  }
};
