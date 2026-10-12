# EventEasePro

College Event Registration and QR-Based Attendance System (frontend only).

## Run locally

```bash
npm install
npm run dev
```

## Backend URL

All API calls live in `src/api.js` and use `VITE_API_BASE_URL` (default `http://localhost:8081`).
Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8081
```

Restart `npm run dev` after changing it. Make sure your backend allows CORS from the frontend origin.
