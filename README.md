# A Link Shortener

An API-only link shortener protected by Auth0. Uses Postgres as the underlying database. API routes are CORS-protected and intended for use by an admin console.

## Shorten

`POST /api/shorten`

### Body

```json
{
  "longUrl": "https://www.google.com",
  "customCode": "aBc123"
}
```

_customCode is optional_

### Response

```json
{
  "shortUrl": "https://nswu.co/aBc123"
}
```

## Show

`GET /api/get-urls`

### Response

```json
{
  "urls": [
    {
      "shortCode": "aBc123",
      "longUrl": "https://www.google.com",
      "createdAt": "2024-12-31T23:59:59.000"
    }
  ]
}
```

## CORS

Add comma-separated origins to the environment variable `CORS_ALLOWED_ORIGINS`.
