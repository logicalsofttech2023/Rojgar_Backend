// utils/sendMail.js
import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text, html, headers }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Rojgar Team" <${process.env.EMAIL}>`, // Optional: more professional sender name
      to,
      subject,
      text,
      html, // ✅ Include the HTML version
      headers, // ✅ Add custom headers if provided
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
