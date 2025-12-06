# Deployment Guide

This app is split into two parts: **Client (Frontend)** and **Server (Backend)**. You need to deploy them separately.

> [!WARNING]
> **Data Persistence Issue**: This app currently uses a local `submissions.json` file for storage.
> On most cloud platforms (like Render or Vercel), the filesystem is **temporary**.
> **Your data will disappear** every time the server restarts or redeploys.
> **Solution**: For a real production app, you should switch `server.js` to use a database (like MongoDB Atlas) instead of a JSON file.

## Part 1: Deploy Backend (Render.com)

1.  Push your code to **GitHub**.
2.  Go to [Render.com](https://render.com) and create a new **Web Service**.
3.  Connect your GitHub repo.
4.  **Settings**:
    *   **Root Directory**: `task-2/server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Environment Variables**:
        *   `GEMINI_API_KEY`: (Your Google Gemini Key)
        *   `PORT`: `5000` (Render might auto-set this, but good to have)
5.  Deploy. Render will give you a URL (e.g., `https://fynd-task-backend.onrender.com`).

## Part 2: Deploy Frontend (Vercel)

1.  Go to [Vercel.com](https://vercel.com) and add a new **Project**.
2.  Connect the same GitHub repo.
3.  **Settings**:
    *   **Root Directory**: `task-2/client`
    *   **Framework Preset**: Vite
    *   **Environment Variables**:
        *   `VITE_API_URL`: The URL from Part 1 (e.g., `https://fynd-task-backend.onrender.com` - **no trailing slash**)
4.  Deploy. Vercel will give you a frontend URL.

## Part 3: Final Config

1.  Once the frontend is live, you might need to update the backend's `cors` configuration in `server.js` to explicitly allow your Vercel domain, although the current setup allows all origins (`app.use(cors())`), so it should work out of the box.
