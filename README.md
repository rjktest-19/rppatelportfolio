# Raju Patel Portfolio

A premium, immersive, and 3D animated portfolio web application built for **Raju Patel**, creative developer and designer. This project is optimized for deployment via **GitHub** and **Vercel** with integrated serverless endpoints for handling portfolio content and contact form communications.

---

## 🎨 Key Features

- **Immersive 3D Animations & Motion Graphics**: Driven by modern fluid interactive canvas background animations and standard-compliant React `motion` configurations.
- **Dynamic Identity Swapper**: Supports toggling between multiple customized profile visuals (e.g., Creator Halo and Esports Identity).
- **Admin Control Center**: Built-in secured console allowing the owner to update profile parameters, project cards, skills list, gallery exhibits, and resume credentials dynamically.
- **Firebase Firestore Integration**: Synchronizes portfolio datasets in real-time, falling back seamlessly to local `.json` configs.
- **Secure Email Transmission**: Built-in Nodemailer dispatcher proxying contact form inquiries directly to Gmail over secure SMTP, with database fallback logging.

---

## 🚀 One-Click Vercel Deployment

This repository is pre-configured with a custom `vercel.json` routing matrix allowing Vercel to compile the React client side and route backend API requests (`/api/*`) directly to a serverless Express handler (`/api/index.ts`).

### Continuous Deployment (CI/CD)

Whenever you push or merge code to your GitHub repository:
1. **GitHub** alerts Vercel.
2. **Vercel** automatically pulls the latest changes.
3. **Vercel** compiles and builds the static assets and the serverless functions.
4. **Your live website updates instantly** within seconds!

---

## ⚙️ Configuration & Environment Setup

To keep secrets secure, Vercel loads sensitive credentials via **Environment Variables**. Configure these inside your **Vercel Project Settings > Environment Variables**:

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | (Optional) API key for Gemini features if required by modules. | `AIzaSy...` |
| `SMTP_HOST` | Outgoing SMTP mail server host. | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (e.g., 587 for TLS, 465 for SSL). | `587` |
| `SMTP_USER` | The authenticated Gmail address used to transmit contact messages. | `rjk62876565@gmail.com` |
| `SMTP_PASS` | Gmail App Password (NOT your account password; generated in Google Security settings). | `xxxx xxxx xxxx xxxx` |
| `CONTACT_RECEIVER_EMAIL` | The destination inbox where you want to receive inquiries. | `rjk62876565@gmail.com` |
| `APP_URL` | The public domain of your Vercel deployment. | `https://rppatelportfolio.vercel.app` |

---

## 🛠️ Local Development Guide

To run, inspect, and customize the portfolio locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment File**:
   Copy `.env.example` to `.env` and fill in your local or staging credentials:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *The dev server automatically boots Vite and the Express proxy at `http://localhost:3000`.*

4. **Build the Application**:
   Verify everything builds correctly for production:
   ```bash
   npm run build
   ```

---

## 📁 Repository Blueprint

```text
├── api/
│   └── index.ts               # Vercel Serverless Function entry point (Express API)
├── src/
│   ├── admin/                 # Administration Suite tabs & panels
│   ├── components/            # Visual blocks: About, Gallery, Hero, Projects, Contact, custom elements
│   ├── lib/                   # Static mock fallbacks & utilities
│   ├── types.ts               # Shared TypeScript structures
│   ├── main.tsx               # Frontend root
│   └── index.css              # Custom global styles using modern Tailwind CSS
├── firebase-applet-config.json # Dynamic Firestore connectivity configuration
├── vercel.json                # Vercel Serverless routing config
└── vite.config.ts             # Vite bundling engine configuration
```

---

## 🔒 Firebase Integration

Your database uses the existing Firebase configuration defined inside `firebase-applet-config.json`.
- The frontend loads and connects to the Firestore database client-side using these credentials.
- The serverless `/api/*` endpoints connect to the same Firestore database safely on the backend, ensuring admin operations and contact form submissions are stored securely.
- If you change your Firebase project in the future, simply update the keys inside `firebase-applet-config.json`.
