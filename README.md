# 🔔 Context-Aware Notification Manager

A full-stack web app that intelligently filters and manages notifications based on your current context — Work, Leisure, Sleep, Focus, or Commute.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black) ![Node.js](https://img.shields.io/badge/Node.js-24-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8-green)

## 🌐 Live Demo

- **Frontend:** https://context-notif-manager.vercel.app
- **Backend API:** https://context-notif-manager-backend.onrender.com

> **Note:** The backend is hosted on Render's free tier and may take 30-60 seconds to wake up on first visit.

---

## 🚀 Features

- **Authentication** — Register/Login via Email or Phone number with JWT
- **Context Switching** — Instantly switch between Work, Leisure, Sleep, Focus, and Commute modes
- **Custom Contexts** — Create your own contexts like Gym, Study, Date Night with custom icons and colors
- **Auto Context Switching** — Automatically switch context based on time of day (e.g. Sleep at 10PM)
- **Rule Builder** — Create custom rules to allow, mute, or snooze notifications per app per context
- **Duplicate Rule Prevention** — Smart detection prevents adding the same rule twice
- **VIP Contacts** — Certain contacts always bypass mute rules (e.g. Mom on WhatsApp)
- **AI Suggestions** — Smart rule suggestions based on common notification patterns with confidence scores
- **Browser Push Notifications** — Real browser notifications filtered by your rules in real time
- **Live Dashboard** — See incoming notifications filtered in real time based on your active context
- **Analytics** — Insights into how many apps are muted, snoozed, or allowed across all contexts
- **Light & Dark Theme** — Toggle between light and dark mode with smooth transitions
- **Smooth Animations** — Powered by Framer Motion for a polished, modern feel
- **Mobile Responsive** — Works on desktop and mobile with bottom navigation

---

## 🛠️ Tech Stack

| Layer              | Technology                              |
| ------------------ | --------------------------------------- |
| Frontend           | Next.js 16, Tailwind CSS, Framer Motion |
| Backend            | Node.js, Express.js, Socket.io          |
| Database           | MongoDB Atlas, Mongoose                 |
| Auth               | JWT, bcryptjs                           |
| Push Notifications | Web Push API, VAPID, Service Workers    |
| Deployment         | Vercel (Frontend), Render (Backend)     |
| Package Manager    | pnpm                                    |

---

## 📂 Project Structure

context-notif-manager/

├── backend/

│ ├── src/

│ │ ├── controllers/

│ │ │ ├── authController.js

│ │ │ ├── userController.js

│ │ │ ├── ruleController.js

│ │ │ ├── contextController.js

│ │ │ ├── vipController.js

│ │ │ └── pushController.js

│ │ ├── models/

│ │ │ ├── Auth.js

│ │ │ ├── User.js

│ │ │ ├── Rule.js

│ │ │ ├── Context.js

│ │ │ ├── VipContact.js

│ │ │ └── PushSubscription.js

│ │ ├── routes/

│ │ │ ├── authRoutes.js

│ │ │ ├── userRoutes.js

│ │ │ ├── ruleRoutes.js

│ │ │ ├── contextRoutes.js

│ │ │ ├── vipRoutes.js

│ │ │ └── pushRoutes.js

│ │ ├── middleware/

│ │ │ └── authMiddleware.js

│ │ ├── db.js

│ │ └── index.js

│ └── package.json

├── frontend/

│ ├── public/

│ │ └── sw.js

│ ├── src/

│ │ ├── app/

│ │ │ ├── login/

│ │ │ ├── register/

│ │ │ ├── page.js

│ │ │ ├── layout.js

│ │ │ └── globals.css

│ │ └── components/

│ │ ├── Sidebar.js

│ │ ├── Dashboard.js

│ │ ├── Rules.js

│ │ ├── Analytics.js

│ │ ├── VipContacts.js

│ │ ├── PushNotifications.js

│ │ ├── AutoContext.js

│ │ ├── AiSuggestions.js

│ │ ├── CustomContextModal.js

│ │ └── AuthGuard.js

│ └── package.json

└── README.md

---

## ⚙️ How to Run Locally

### Prerequisites

- Node.js v20+
- MongoDB installed locally
- pnpm installed (`npm install -g pnpm`)

### 1. Clone the repository

```bash
git clone https://github.com/roshaannn12/context-notif-manager.git
cd context-notif-manager
```

### 2. Setup Backend

```bash
cd backend
pnpm install
```

Create a `.env` file in the backend folder:

MONGO_URI=mongodb://localhost:27017/context-notif-manager

PORT=5000

JWT_SECRET=your_jwt_secret

VAPID_PUBLIC_KEY=BNn6InO-Re0wMCTXYrwg2RDTsJO077fJGgyqYDPZvqpOCrZTiw7KZt0KZ_SBcvNk-6GMgKYYgX0eP-d3pTz1wj8

VAPID_PRIVATE_KEY=ezI7cvV_E_LpC8OEVJ-CPfpLpsaBTk_ABumaAoPayCM

Generate VAPID keys:

```bash
node -e "const webpush = require('web-push'); const keys = webpush.generateVAPIDKeys(); console.log('Public:', keys.publicKey); console.log('Private:', keys.privateKey);"
```

Run the backend:

```bash
pnpm dev
```

### 3. Setup Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs on `http://localhost:3000`

---

## 🗺️ Roadmap

- [x] Phase 1 — MVP (Manual context toggle, rule builder, dashboard)
- [x] Phase 2 — WebSockets (Live notification feed)
- [x] Phase 2.5 — Authentication (JWT, Email/Phone login)
- [x] Phase 2.5 — Extra features (Custom contexts, VIP contacts, duplicate prevention)
- [x] Phase 2.5 — Deployment (Vercel + Render + MongoDB Atlas)
- [x] Phase 3 — Browser Push Notifications (real notifications filtered by rules)
- [x] Phase 3.5 — AI Suggestions (smart rule recommendations with confidence scores)
- [x] Phase 3.5 — Auto Context Switching (time-based automatic context detection)
- [ ] Phase 4 — Android/iOS companion app for real phone notifications
- [ ] Phase 4 — GPS and calendar based auto context detection

---

## 👨‍💻 Author

**Roshan** — [@roshaannn12](https://github.com/roshaannn12)
