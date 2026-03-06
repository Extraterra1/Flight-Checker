# Flight Checker

React + Vite app to manage and refresh flights stored in Firebase.

## FR24 Integration (Direct Frontend Calls)

The app calls:

- `POST https://fr-24-scraper.vercel.app/api/flights/status`

Request shape:

```json
{
  "flightNumbers": ["TP1687", "U27653"],
  "date": "YYYY-MM-DD",
  "airport": "FNC"
}
```

Headers:

- `Content-Type: application/json`
- `x-api-key: <VITE_FR24_API_KEY>`

Status mapping in UI:

- `scheduled -> Scheduled`
- `departed -> Departed`
- `landed -> Arrived`
- `unknown -> Unknown`

## Environment Variables

Copy `.env.example` to `.env` and fill values.

Required FR24 variables:

- `VITE_FR24_API_BASE_URL` (default `https://fr-24-scraper.vercel.app`)
- `VITE_FR24_API_KEY`
- `VITE_FR24_AIRPORT` (default `FNC`)

Firebase variables:

- `VITE_FIREBASE_FLIGHTS_COLLECTION` (default `flights_preview`, keeps this branch isolated from production `flights`)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
