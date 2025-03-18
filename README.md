# Trio Game Clone

A web-based clone of the board game **Trio**, built with **Bun** for the backend and **Vite React** for the frontend.

## 🎯 Game Rules

- Players aim to form **three pairs of cards** to win.
- Cards can be taken from the **center** or **other players' hands**.

---

## 🚀 Docker Setup

To build and run both the backend and frontend with Docker Compose:

```bash
docker compose up --build
```

---

## 🛠️ Manual Setup

### Backend (Bun server):

```bash
cd backend
bun install
bun run dev
```

### Frontend (Vite React app):

```bash
cd trio_frontend
npm install
npm run dev
```

---

## 🌱 Environment Setup

### For the Vite React App (`.env`):

```env
VITE_API_BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
```

---

## ✅ Features

- Real-time gameplay with Bun API.
- React-based dynamic UI.
- Dockerized environment for easy deployment.

---
