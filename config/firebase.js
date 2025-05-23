import admin from "firebase-admin";
import serviceAccount from "./rojgar-bf4e9-firebase-adminsdk-fbsvc-2bd8f6d624.json" assert { type: "json" };

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
