# Two-Dashboard AI Feedback System (Vite + Express)

## Structure
-   `client/`: Frontend (Vite + React + Tailwind)
-   `server/`: Backend (Express + Gemini)

## Setup
### 1. Backend (Server)
1.  Navigate to server: `cd server`
2.  Install dependencies: `npm install`
3.  Set API Key: Create `.env` file with `GEMINI_API_KEY=your_key`
4.  Start server: `npm start` (Runs on port 5000)

### 2. Frontend (Client)
1.  Navigate to client: `cd client`
2.  Install dependencies: `npm install`
3.  Start dev server: `npm run dev` (Runs on port 5173)

## Access
-   **User Dashboard**: [http://localhost:5173](http://localhost:5173)
-   **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)

## Verification
Run the python script to test the backend API:
```bash
python test_api.py
```
