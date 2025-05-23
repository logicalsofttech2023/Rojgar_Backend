import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";


// 🔹 Your Firebase Config (Replace with actual Firebase project config)
const firebaseConfig = {
    apiKey: "AIzaSyAzOgSB03UIFTFHRZLUPQuy-5EayAHpAbU",
    authDomain: "rojgar-bf4e9.firebaseapp.com",
    projectId: "rojgar-bf4e9",
    storageBucket: "rojgar-bf4e9.firebasestorage.app",
    messagingSenderId: "931879175662",
    appId: "1:931879175662:web:e90d6fc5edeb78d81f7aff",
    measurementId: "G-3WJ7DSFV8T"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

// 🔹 Setup Recaptcha
const setupRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });
};

// 🔹 Send OTP Function
const sendOTP = async (phoneNumber) => {
  try {
    setupRecaptcha();
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    console.log("OTP Sent Successfully");
  } catch (error) {
    console.error("Error Sending OTP:", error);
  }
};

// Export Functions
export { sendOTP, auth };
