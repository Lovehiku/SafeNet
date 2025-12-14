# 🛡️ SafeNet

### Cyber Shield — Hack for Change 2025

SafeNet is a digital safety platform designed to protect women and girls from online harm by detecting, preventing, and responding to **Technology-Facilitated Gender-Based Violence (TFGBV)**.

This project aligns with the 2025 global theme:

> **“UNiTE to End Digital Violence Against All Women and Girls.”**

---

## 🌍 Background & Motivation

SafeNet is a continuation of our earlier work as a team.
Previously, we developed **SaveHeaven**, a class project focused on addressing **physical violence against women**. Through that project, we studied real cases and their lasting impact.

As online spaces became a new ground for abuse, we recognized the urgent need to address **digital attacks** with the same seriousness. SafeNet was created to extend protection from the physical world into the digital space.

---

## 🌍 Problem Statement

Women and girls face increasing online harm, including:

* Online harassment and hate speech
* Cyberstalking and threats
* Online grooming and sextortion
* Fake profiles and impersonation
* Blackmail and non-consensual content sharing

Many victims:

* Cannot easily identify dangerous messages
* Lose critical digital evidence
* Do not know where to seek help

SafeNet addresses these challenges.

---

## 🎯 What SafeNet Does

> SafeNet analyzes messages, screenshots, and online profiles
> to provide early warnings, preserve evidence, and guide users toward safety.

---

## 🧭 System Flow

### 1️⃣ User Authentication

* Secure account creation and login
* User data privacy is strictly protected

---

### 2️⃣ Dashboard (Safety Control Center)

* Central access to all safety tools
* Simple, non-technical user experience

---

### 3️⃣ Text Analyzer

**Purpose:** Detect harmful messages before escalation

**User:**

1. Pastes a message
2. Clicks **Analyze**

**System:**

* Detects threats, harassment, grooming, and hate speech
* Displays risk level and confidence score
* Allows results to be saved as evidence

---

### 4️⃣ Screenshot Analyzer

**Purpose:** Analyze visual evidence and preserve proof

**User:**

1. Uploads a chat screenshot
2. Clicks **Analyze Screenshot**

**System:**

* Extracts text from the image
* Analyzes content for harmful patterns
* Saves results securely

---

### 5️⃣ Fake Profile Detector

**Purpose:** Detect impersonation and scam risks

**User:**

1. Uploads a profile image
2. Clicks **Scan Profile**

**System:**

* Identifies reused or suspicious images
* Displays risk level and confidence score
* Helps users avoid impersonation and scams

---

### 6️⃣ Alert Center

**Purpose:** Evidence and safety history

* Stores all saved analyses
* Categorizes alerts by threat type
* Supports reporting and documentation

---

### 7️⃣ Awareness & Support

**Purpose:** Education and guidance

* Online safety awareness resources
* Guidance for responding to digital threats
* Access to support information

---

### 8️⃣ Browser Extension

**Purpose:** Real-time protection during everyday browsing

* Real-time access while browsing
* Allows users to analyze messages, screenshots, and profiles directly from the browser
* Designed for quick intervention and immediate awareness

---

## 🧠 Impact

SafeNet:

* Helps prevent harm before it escalates
* Empowers users with clarity and confidence
* Preserves critical digital evidence
* Promotes safer digital spaces for women and girls

---

## 🛠️ Technology Stack

* Frontend: React + Vite
* Backend: Node.js + Express
* Database: MongoDB
* Authentication: JWT
* Security-first and privacy-focused design

---

## ⚙️ Setup & Running the Project

### 🔹 Prerequisites

Make sure you have installed:

* Node.js (v18 or higher)
* MongoDB (local or cloud)
* Git

---

### 🔹 Clone the Repository

```bash
git clone https://github.com/Lovehiku/SafeNet.git
cd safenet
```

---

### 🔹 Backend Setup

```bash
cd backend
npm install
```

Run the backend server:

```bash
npm start
# or
node server.js
```

Backend will run on:

```
http://localhost:4000
```

---

### 🔹 Frontend Setup

```bash
cd ../src
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

### 🔹 Browser Extension Setup

1. Open your browser (Chrome/Edge)
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `browser-extension` folder from the project

The extension will now be active and ready to use.

---

## 🚀 Future Enhancements

* Mobile application
* More advanced AI-driven analysis
* Direct integration with NGOs and emergency support hotlines

---

## 👥 Target Users

* Women and girls
* Students
* Digital safety organizations
* Communities vulnerable to online abuse

---

## 📄 License

MIT License



