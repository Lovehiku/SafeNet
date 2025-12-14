# SafeNet Guardian Backend (Express + JWT)

APIs that power SafeNet Guardian: authentication, text/image/screenshot analysis, fake profile checks, and alert management. Built with Express and MongoDB models; falls back to in-memory storage if MongoDB is unavailable so you can exercise endpoints quickly with Postman/Thunder Client.

## Quick start
1) Copy `.env.example` to `.env` (or set env vars):  
```
PORT=4000
JWT_SECRET=change-me
MONGO_URI=mongodb://localhost:27017/safenet_guardian
```
2) Install deps from this folder: `npm install`  
3) Run dev server: `npm run dev` (default http://localhost:4000)  
4) Health check: `GET /api/health`

## Project layout
```
backend/
  src/
    app.js               // Express app + routes
    server.js            // bootstrap + DB connect
    controllers/         // request handlers
    services/            // business logic / stubs for AI calls
    routes/              // express routers
    middleware/          // auth + error handling
    models/              // Mongoose schemas (User, Alert)
    utils/               // config + db connect
  docs/api.md            // endpoint reference + samples
```

## Testing with Postman / Thunder Client
- Register then login to obtain the `Bearer <token>` used for protected endpoints.
- Set `Content-Type: application/json` on POSTs.
- Optional `createAlert: true` in analyzer payloads will persist an alert for the current user.

## Notes on AI/vision stubs
The analyzer services are lightweight heuristics to make the API testable offline. Swap `services/*` implementations with calls to your ML/vision provider (OpenAI, AWS Rekognition, Azure Face, Hive, etc.) when ready.

