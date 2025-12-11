# API Documentation

This document describes the Vifi Backend API used by the Smart TV application.

## Base URL

```
http://backend.vifi.ee/api/
```

## Authentication

The API uses API key authentication. All requests must include the API key.

**API Key**: `27ah12A3d76f32`

Include in requests as:
```javascript
{
    api_key: '27ah12A3d76f32'
}
```

## Endpoints

### Movies

#### Get Featured Movies

Get a list of featured/promoted movies for the home page.

```
GET /api/featured
```

**Response:**
```json
{
    "films": [
        {
            "id": 123,
            "title": "Movie Title",
            "poster_url": "http://...",
            "running_time_text": "120 min",
            "description": "Movie description...",
            "seo_friendly_url": "/movies/movie-title",
            "rating": 8.5,
            "year": 2023
        }
    ]
}
```

#### Get Movie Details

Get detailed information about a specific movie.

```
GET /api/movies/:id
```

**Parameters:**
- `id` (required): Movie ID

**Response:**
```json
{
    "film": {
        "id": 123,
        "title": "Movie Title",
        "description": "Full description...",
        "poster_url": "http://...",
        "backdrop_url": "http://...",
        "running_time": 120,
        "running_time_text": "2h 00min",
        "year": 2023,
        "rating": 8.5,
        "genres": ["Action", "Drama"],
        "director": "Director Name",
        "cast": ["Actor 1", "Actor 2"],
        "video_url": "http://stream.vifi.ee/...",
        "subtitle_tracks": [
            {
                "language": "et",
                "label": "Estonian",
                "url": "http://..."
            }
        ]
    }
}
```

#### Search Movies

Search for movies by title, genre, or other criteria.

```
GET /api/search
```

**Parameters:**
- `q` (required): Search query
- `genre` (optional): Genre filter
- `year` (optional): Year filter
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset

**Response:**
```json
{
    "results": [...],
    "total": 150,
    "limit": 20,
    "offset": 0
}
```

#### Browse Movies by Genre

Get movies filtered by genre.

```
GET /api/genres/:genre/movies
```

**Parameters:**
- `genre` (required): Genre slug (e.g., "action", "drama", "comedy")
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset

### User

#### Login

Authenticate a user and create a session.

```
POST /api/auth/login
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "device_id": "samsung-tv-abc123"
}
```

**Response:**
```json
{
    "success": true,
    "session_token": "abc123...",
    "user": {
        "id": 456,
        "email": "user@example.com",
        "name": "User Name",
        "subscription": {
            "active": true,
            "expires_at": "2024-12-31"
        }
    }
}
```

#### Get User Profile

Get the current user's profile information.

```
GET /api/user/profile
```

**Headers:**
- `Authorization`: Session token

**Response:**
```json
{
    "user": {
        "id": 456,
        "email": "user@example.com",
        "name": "User Name",
        "avatar_url": "http://...",
        "subscription": {
            "plan": "premium",
            "active": true,
            "expires_at": "2024-12-31"
        },
        "watchlist": [123, 456, 789]
    }
}
```

#### Logout

End the current session.

```
POST /api/auth/logout
```

**Headers:**
- `Authorization`: Session token

### Queue/Watchlist

#### Get User Queue

Get the user's watchlist/queue.

```
GET /api/user/queue
```

**Headers:**
- `Authorization`: Session token

**Response:**
```json
{
    "queue": [
        {
            "id": 123,
            "title": "Movie Title",
            "poster_url": "http://...",
            "added_at": "2023-12-01T10:00:00Z"
        }
    ]
}
```

#### Add to Queue

Add a movie to the user's queue.

```
POST /api/user/queue
```

**Headers:**
- `Authorization`: Session token

**Request Body:**
```json
{
    "movie_id": 123
}
```

#### Remove from Queue

Remove a movie from the user's queue.

```
DELETE /api/user/queue/:movie_id
```

**Headers:**
- `Authorization`: Session token

### Activation

#### Activate Device

Activate a device using an activation code.

```
POST /api/device/activate
```

**Request Body:**
```json
{
    "code": "ABC123",
    "device_id": "samsung-tv-abc123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Device activated successfully"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
    "error": true,
    "message": "Error description",
    "code": "ERROR_CODE"
}
```

### Common Error Codes

- `UNAUTHORIZED` - Invalid or missing authentication
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request parameters
- `SERVER_ERROR` - Internal server error
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Rate Limiting

The API implements rate limiting:
- **Limit**: 100 requests per minute per device
- **Headers**: Rate limit info included in response headers
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Real-time Events (Pusher)

The application uses Pusher for real-time communication.

**Pusher Key**: `4c4fbbdf6a43d69d8a95`
**Auth Endpoint**: `http://backend.vifi.ee/auth/`

### Channels

#### Private Channel

User-specific events and remote control.

```javascript
var channel = pusher.subscribe('private-channel');
```

### Events

#### Media Player Events

```javascript
channel.bind('client-mediaplayer-event', function(data) {
    // Handle: play, pause, stop, forward, rewind, etc.
});
```

#### Navigation Events

```javascript
channel.bind('client-event', function(data) {
    // Handle: page:up, page:down, etc.
});
```

## Data Formats

### Date/Time

All dates are in ISO 8601 format:
```
2023-12-01T10:00:00Z
```

### Video URLs

Video URLs are provided as:
- Direct HLS/HDS streams
- RTMP streams (for Flash)
- Progressive download URLs

Format depends on the player implementation being used.

### Image URLs

Image URLs are served through a CDN with resizing support:
```
http://gonzales.vifi.ee/files/images/image.php?src=...&w=191&h=281
```

Parameters:
- `src`: Original image path
- `w`: Width in pixels
- `h`: Height in pixels

## Notes

- All API responses are in JSON format
- Use UTF-8 encoding for all requests
- Keep the API key secure - don't expose in public repositories
- Implement proper error handling for all API calls
- Cache responses where appropriate to reduce API load
