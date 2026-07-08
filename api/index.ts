import express from "express";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import nodemailer from "nodemailer";

// Statically import configuration files to ensure they are compiled into the Vercel Serverless Function bundle
import firebaseAppletConfig from "../firebase-applet-config.json";
import portfolioDataFallback from "../src/lib/portfolioData.json";

const app = express();

// Use JSON parsing middleware with a generous size limit
app.use(express.json({ limit: "10mb" }));

// Initialize Firebase JS client SDK dynamically
let db: any = null;
try {
  const firebaseApp = getApps().length === 0 ? initializeApp(firebaseAppletConfig) : getApp();
  
  if (firebaseAppletConfig.firestoreDatabaseId) {
    db = getFirestore(firebaseApp, firebaseAppletConfig.firestoreDatabaseId);
  } else {
    db = getFirestore(firebaseApp);
  }
  console.log("Firebase Backend Client SDK initialized successfully with database:", firebaseAppletConfig.firestoreDatabaseId || "(default)");
} catch (error) {
  console.error("Failed to initialize Firebase Client SDK on backend:", error);
}

// API Route: Get portfolio data
app.get("/api/portfolio", async (req, res) => {
  try {
    if (db) {
      try {
        const docRef = doc(db, "portfolio", "data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return res.json(docSnap.data());
        } else if (portfolioDataFallback) {
          // Seed firestore with initial local data
          await setDoc(docRef, portfolioDataFallback);
          console.log("Seeded Firestore with local portfolioData.json");
          return res.json(portfolioDataFallback);
        }
      } catch (dbErr) {
        console.error("Error reading from Firestore, using local file backup:", dbErr);
      }
    }

    if (portfolioDataFallback) {
      return res.json(portfolioDataFallback);
    }
    return res.status(404).json({ error: "Portfolio data not found." });
  } catch (err: any) {
    console.error("Error reading portfolio data:", err);
    return res.status(500).json({ error: err.message });
  }
});

// API Route: Save/Update portfolio data
app.post("/api/portfolio", async (req, res) => {
  try {
    const newData = req.body;
    if (!newData || typeof newData !== "object") {
      return res.status(400).json({ error: "Invalid body payload" });
    }

    // 1. Save to local disk fallback if environment allows writable filesystem
    try {
      const fs = await import("fs");
      const path = await import("path");
      const jsonPath = path.join(process.cwd(), "src", "lib", "portfolioData.json");
      fs.writeFileSync(jsonPath, JSON.stringify(newData, null, 2), "utf-8");
      console.log("Successfully saved portfolio data to disk fallback");
    } catch (fsErr) {
      console.warn("Could not write local backup file (expected on read-only environments like Vercel):", fsErr);
    }

    // 2. Save to Firestore
    if (db) {
      try {
        const docRef = doc(db, "portfolio", "data");
        await setDoc(docRef, newData);
        console.log("Successfully saved portfolio data to Firestore");
      } catch (dbErr) {
        console.error("Failed to write to Firestore database:", dbErr);
      }
    }

    return res.json({ success: true, message: "Portfolio saved successfully." });
  } catch (err: any) {
    console.error("Error writing portfolio data:", err);
    return res.status(500).json({ error: err.message });
  }
});

// API Route: Contact Form Email Dispatcher & Firestore Store
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields (name, email, message)" });
    }

    let sentEmail = false;
    let emailError = "";

    // 1. Send Email via Nodemailer if SMTP is configured
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "rjk62876565@gmail.com";

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"${name} (Portfolio)" <${smtpUser}>`,
          to: receiverEmail,
          replyTo: email,
          subject: `📬 New Portfolio Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #0f0f11; color: #ffffff; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid rgba(255,255,255,0.1);">
              <h2 style="color: #ff5f00; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-top: 0;">
                New Portfolio Transmission
              </h2>
              <div style="margin: 20px 0;">
                <p style="margin: 8px 0;"><strong style="color: #ff2a2a; text-transform: uppercase; font-size: 11px;">Sender Name:</strong> ${name}</p>
                <p style="margin: 8px 0;"><strong style="color: #ff2a2a; text-transform: uppercase; font-size: 11px;">Sender Email:</strong> <a href="mailto:${email}" style="color: #ff5f00; text-decoration: none;">${email}</a></p>
              </div>
              <div style="background-color: rgba(255,255,255,0.03); padding: 15px; border-left: 3px solid #ff5f00; border-radius: 4px; margin-top: 15px;">
                <strong style="color: #ff5f00; text-transform: uppercase; font-size: 11px; display: block; margin-bottom: 8px;">Message Payload:</strong>
                <p style="white-space: pre-wrap; line-height: 1.6; margin: 0; font-size: 14px; color: #e5e5e5;">${message}</p>
              </div>
              <div style="margin-top: 30px; font-size: 10px; color: rgba(255,255,255,0.3); text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                PORTFOLIO SECURE COMMUNICATIONS CONTROL ENGINE
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        sentEmail = true;
        console.log(`Successfully sent email from ${email} to ${receiverEmail}`);
      } catch (mailErr: any) {
        console.error("Failed to dispatch email via Nodemailer:", mailErr);
        emailError = mailErr?.message || String(mailErr);
      }
    } else {
      console.warn("SMTP credentials not configured. Skipping email dispatch, will store in database.");
      emailError = "SMTP credentials not configured. Message stored in database fallback.";
    }

    // 2. Save to Firestore messages collection so it's never lost
    if (db) {
      try {
        const docId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const docRef = doc(db, "messages", docId);
        await setDoc(docRef, {
          name,
          email,
          message,
          createdAt: new Date().toISOString(),
          sentEmail,
          emailError: emailError || null
        });
        console.log(`Stored contact message in Firestore with ID: ${docId}`);
      } catch (dbErr) {
        console.error("Failed to write contact message to Firestore:", dbErr);
      }
    }

    return res.json({
      success: true,
      message: sentEmail 
        ? "Message transmitted and emailed successfully." 
        : "Message received and logged securely in database.",
      emailStatus: sentEmail ? "sent" : "stored_only"
    });
  } catch (err: any) {
    console.error("Error in /api/contact:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default app;
