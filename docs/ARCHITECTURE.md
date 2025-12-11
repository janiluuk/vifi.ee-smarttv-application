# Architecture Overview

This document provides a detailed overview of the Vifi.ee Smart TV application architecture.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Views     │  │  Templates  │  │     CSS     │ │
│  │ (Backbone)  │  │ (ICanHaz.js)│  │   Styles    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│                  Application Layer                   │
│  ┌──────────────────────────────────────────────┐  │
│  │           Vifi Engine (Core Module)          │  │
│  │  - Module Management                         │  │
│  │  - Event Bus                                 │  │
│  │  - Page Management                           │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  Films   │ │   User   │ │  Player  │           │
│  │  Module  │ │  Module  │ │  Module  │           │
│  └──────────┘ └──────────┘ └──────────┘           │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Navigation│ │  Search  │ │  Queue   │           │
│  │  Module  │ │  Module  │ │  Module  │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│                   Platform Layer                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │   Samsung    │  │   Browser    │               │
│  │ Media Player │  │ Media Player │               │
│  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐               │
│  │    Flash     │  │  Key Handler │               │
│  │ Media Player │  │   (Remote)   │               │
│  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│                    Data Layer                        │
│  ┌──────────────────────────────────────────────┐  │
│  │             Backend Connector                │  │
│  │  - REST API Communication                    │  │
│  │  - Data Caching                              │  │
│  │  - Session Management                        │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐               │
│  │    Models    │  │ Collections  │               │
│  │  (Backbone)  │  │  (Backbone)  │               │
│  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│               External Services                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │ Vifi Backend│ │   Pusher    │ │  SmartPay   │  │
│  │     API     │ │  Real-time  │ │   Payment   │  │
│  └─────────────┘ └─────────────┘ └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Core Components

### 1. Vifi Engine (`vifi_engine.js`)

The central module that manages the entire application lifecycle.

**Responsibilities:**
- Module registration and initialization
- Dependency management
- Event bus coordination
- Global settings management

**Key Methods:**
- `addModule(name, module, config)` - Register a new module
- `start()` - Initialize all modules
- `getModule(name)` - Retrieve a registered module

### 2. Page Manager (`vifi_backend.js`)

Manages page navigation and transitions.

**Responsibilities:**
- Page lifecycle management
- Navigation history
- Focus management for TV remote
- Page transitions and animations

**Key Pages:**
- Home Page - Featured content
- Browser Page - Movie browsing/search
- Movie Page - Movie details
- Player Page - Video playback
- Account Page - User profile
- Activation Page - Device activation

### 3. Navigation System (`vifi_navigation.js`)

Handles TV remote control input and UI navigation.

**Components:**
- Key handler for Samsung TV remote buttons
- Focus management using Google Closure TV UI
- Directional navigation (up, down, left, right)
- Context-aware navigation

**Key Events:**
- `page:up` - Navigate up
- `page:down` - Navigate down
- `page:focus` - Set focus on element
- `page:back` - Go to previous page

### 4. Media Player System

Multi-platform video playback implementation.

#### Player Controller (`vifi_player.js`)
Central player management and state control.

#### Platform Implementations:
- **Samsung Player** (`vifi_mediaplayer_samsung.js`)
  - Native Samsung SEF API
  - Best performance on Samsung TVs
  
- **Flash Player** (`vifi_mediaplayer_flash.js`)
  - Flowplayer-based
  - Fallback for older browsers
  
- **Browser Player** (`vifi_mediaplayer_browser.js`)
  - HTML5 video
  - Desktop browser support

- **Subtitles** (`vifi_mediaplayer_subtitles.js`)
  - Subtitle track management
  - Multiple language support
  - Timing synchronization

### 5. Backend Communication (`vifi_backend.js`)

Handles all communication with the Vifi backend API.

**Features:**
- RESTful API client
- Request/response handling
- Error management
- Data caching
- Session management

**Main Functions:**
- `loadFilms()` - Fetch movie catalog
- `loadFilmDetails(id)` - Get movie details
- `authenticate(credentials)` - User login
- `searchFilms(query)` - Search movies

### 6. User Management (`vifi_user.js`)

User authentication, profile, and session management.

**Components:**
- Login/Logout views
- Profile management
- Subscription status
- Device activation

**Models:**
- Session - Current session state
- Profile - User profile data

## Data Flow

### Application Initialization

```
1. HTML loads → vendor.js (libraries)
2. Load Samsung TV APIs
3. Load Vifi modules in order
4. Vifi.Engine.start()
5. Initialize Page Manager
6. Initialize Navigation System
7. Load initial data (featured films)
8. Render home page
9. Set up event listeners
10. Ready for user interaction
```

### Movie Browsing Flow

```
User Input → Key Handler → Navigation System
                                  ↓
                            Page Manager
                                  ↓
                            Films Module
                                  ↓
                          Backend API Call
                                  ↓
                         Update Collection
                                  ↓
                           Re-render View
                                  ↓
                         Update UI Focus
```

### Video Playback Flow

```
User Selects Movie → Film Detail View
                            ↓
                    Check Permissions
                            ↓
                    Player Controller
                            ↓
              Detect Platform (Samsung/Flash/Browser)
                            ↓
              Initialize Platform Player
                            ↓
              Load Video Stream
                            ↓
              Load Subtitles (if available)
                            ↓
              Start Playback
                            ↓
              Handle Player Events
```

## Design Patterns

### 1. Module Pattern

Each Vifi module follows the module pattern:
```javascript
Vifi.ModuleName = {
    // Private variables
    _privateVar: null,
    
    // Public methods
    init: function() { },
    publicMethod: function() { }
};
```

### 2. MVC with Backbone.js

- **Models**: Data entities (Film, User, Session)
- **Collections**: Groups of models (Films, Queue)
- **Views**: UI components and rendering

### 3. Event-Driven Architecture

Central event bus using Backbone.Events:
```javascript
Vifi.Event.on('event:name', handler);
Vifi.Event.trigger('event:name', data);
```

### 4. Observer Pattern

Models and Collections emit change events:
```javascript
model.on('change', function() {
    // Update view
});
```

## State Management

### Application State

Managed by Vifi.Engine:
- Current page
- Active components
- Global settings
- Device information

### Session State

Managed by Session model:
- User authentication status
- Session token
- User profile
- Subscription status

### Player State

Managed by Player controller:
- Playing/Paused/Stopped
- Current time
- Duration
- Volume
- Subtitle track

## Platform Adaptation

### Samsung TV Specific

- Uses Samsung SEF API for media playback
- TV remote key mappings
- Resolution detection
- Hardware acceleration

### Browser Fallback

- HTML5 video element
- Keyboard event mapping
- Mouse/touch support (limited)
- Console logging for debugging

### Platform Detection

```javascript
Vifi.Platform = {
    isSamsung: function() { },
    supportsFlash: function() { },
    getResolution: function() { }
};
```

## Performance Considerations

### Lazy Loading

- Images loaded on demand using LazyLoad
- Movies loaded in batches
- On-demand module initialization

### Caching

- API responses cached locally
- Image caching via browser
- Session data persisted

### Memory Management

- Clean up views on page change
- Unbind event listeners
- Release player resources

## Security

### API Security

- API key authentication
- HTTPS for sensitive data (when available)
- Session token management

### Input Validation

- Sanitize user input
- Validate API responses
- Error boundary handling

## Scalability

### Modular Architecture

- Independent modules
- Loose coupling via events
- Easy to add new features

### Platform Extensibility

- Easy to add new player implementations
- Platform detection abstraction
- Adapter pattern for platform-specific code

## Error Handling

### Levels

1. **Module Level**: Try-catch in critical sections
2. **API Level**: Error callbacks and promises
3. **Global Level**: Window error handler
4. **User Level**: Error page display

### Logging

Centralized logging via `vifi_logger.js`:
```javascript
Vifi.Logger.log(message, level);
Vifi.Logger.error(error);
```

## Future Improvements

Potential architectural enhancements:
- Migrate to modern framework (React, Vue)
- Implement proper state management (Redux, Vuex)
- TypeScript for type safety
- Build system (Webpack, Rollup)
- Unit and integration tests
- Progressive Web App features
