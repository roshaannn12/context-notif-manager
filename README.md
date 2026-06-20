# 🔔 Context-Aware Notification Manager

A full-stack web app that intelligently filters and manages notifications based on your current context — Work, Leisure, Sleep, Focus, or Commute.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black) ![Node.js](https://img.shields.io/badge/Node.js-24-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8-green)

---

## 🚀 Features

- **Context Switching** — Instantly switch between Work, Leisure, Sleep, Focus, and Commute modes
- **Rule Builder** — Create custom rules to allow, mute, or snooze notifications per app per context
- **Live Dashboard** — See incoming notifications filtered in real time based on your active context
- **Analytics** — Insights into how many apps are muted, snoozed, or allowed across all contexts
- **Light & Dark Theme** — Toggle between light and dark mode with smooth transitions
- **Smooth Animations** — Powered by Framer Motion for a polished, modern feel

---

## 🛠️ Tech Stack

| Layer           | Technology                              |
| --------------- | --------------------------------------- |
| Frontend        | Next.js 16, Tailwind CSS, Framer Motion |
| Backend         | Node.js, Express.js                     |
| Database        | MongoDB, Mongoose                       |
| Package Manager | pnpm                                    |

---

## 📂 Project Structure

context-notif-manager/

├── backend/

│ ├── src/

│ │ ├── controllers/

│ │ │ ├── userController.js

│ │ │ └── ruleController.js

│ │ ├── models/

│ │ │ ├── User.js

│ │ │ └── Rule.js

│ │ ├── routes/

│ │ │ ├── userRoutes.js

│ │ │ └── ruleRoutes.js

│ │ ├── db.js

│ │ └── index.js

│ └── package.json

├── frontend/

│ ├── src/

│ │ ├── app/

│ │ │ ├── page.js

│ │ │ ├── layout.js

│ │ │ └── globals.css

│ │ └── components/

│ │ ├── Sidebar.js

│ │ ├── Dashboard.js

│ │ ├── Rules.js

│ │ └── Analytics.js

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

### 2. Run the Backend

```bash
cd backend
pnpm install
pnpm dev
```

Backend runs on `http://localhost:5000`

### 3. Run the Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs on `http://localhost:3000`

---

## 🗺️ Roadmap

- [x] Phase 1 — MVP (Manual context toggle, rule builder, dashboard)
- [ ] Phase 2 — Auto-detection (Calendar, time, location-based context switching)
- [ ] Phase 3 — AI-powered suggestions and predictive filtering
- [ ] Phase 4 — Mobile app integration

---

## 👨‍💻 Author

**Roshan** — [@roshaannn12](https://github.com/roshaannn12)
