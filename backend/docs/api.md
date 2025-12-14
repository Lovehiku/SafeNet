# SafeNet Guardian API Reference

Base URL (local): `http://localhost:4000/api`

## Auth
- `POST /auth/register`  
  Body: `{ "email": "user@example.com", "password": "Passw0rd!", "name": "Alex" }`  
  Sample: `{ "success": true, "user": { "id": "...", "email": "user@example.com", "name": "Alex" }, "token": "JWT" }`

- `POST /auth/login`  
  Body: `{ "email": "user@example.com", "password": "Passw0rd!" }`  
  Sample: `{ "success": true, "user": { "id": "...", "email": "user@example.com", "name": "Alex" }, "token": "JWT" }`

Use the returned token as `Authorization: Bearer <token>` for the protected routes below.

## Text Analyzer (hate speech, grooming, threats)
- `POST /text/analyze` (protected)  
  Body: `{ "text": "I will attack you", "createAlert": true }`  
  Sample response:
  `{ "success": true, "data": { "hateSpeech": { "confidence": 0.6, "matches": ["attack"], "label": "medium" }, "grooming": {...}, "threats": {...}, "overallRisk": "medium" } }`

## Image Checker (NSFW, morphing, impersonation)
- `POST /image/analyze` (protected)  
  Body: `{ "imageUrl": "https://example.com/photo.jpg", "notes": "possible deepfake", "createAlert": true }`  
  Sample: `{ "success": true, "data": { "nsfw": { "confidence": 0.08, "label": "clean" }, "morphing": { "confidence": 0.55, "label": "medium" }, "impersonation": {...}, "overallRisk": "medium" } }`

## Screenshot Analyzer
- `POST /screenshot/analyze` (protected)  
  Body: `{ "text": "Here is my password 1234", "createAlert": true }`  
  Sample: `{ "success": true, "data": { "sensitiveFindings": ["password"], "confidence": 0.4, "label": "medium", "recommendations": "Mask sensitive information before sharing screenshots." } }`

## Fake Profile Detection (similar faces)
- `POST /fake-profiles/detect` (protected)  
  Body: `{ "imageUrl": "https://example.com/avatar.png", "createAlert": true }`  
  Sample: `{ "success": true, "data": { "matches": [ { "id": "a1b2c3d4", "similarity": 0.71, "source": "public-web", "note": "Possible reused avatar" } ], "risk": "medium", "topScore": 0.71 } }`

## Alert Management
- `GET /alerts` (protected)  
  Response: `{ "success": true, "data": [ { "id": "...", "title": "...", "severity": "high" } ] }`

- `POST /alerts` (protected)  
  Body: `{ "title": "Manual alert", "severity": "high", "message": "something happened", "type": "text" }`  
  Response: `{ "success": true, "data": { ... } }`

- `DELETE /alerts/:id` (protected)  
  Response: `{ "success": true, "message": "Deleted" }`

## Health
- `GET /health`  
  Response: `{ "status": "ok", "service": "SafeNet Guardian API" }`

### Notes
- `createAlert: true` on analyzer endpoints will store an alert for the authenticated user.
- MongoDB models are provided; if MongoDB is unavailable the service falls back to an in-memory store so tests continue to work.

