# Vifi.ee Smart TV Application

A Samsung Smart TV application for streaming movies from Vifi.ee, Estonia's video streaming platform.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Technologies](#technologies)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application provides a Smart TV interface for the Vifi.ee video streaming service. It's designed specifically for Samsung Smart TV platforms and includes support for various screen resolutions and video playback methods including Flash-based Flowplayer and Samsung's native media player.

## Features

- **Movie Browsing**: Browse and search through the Vifi.ee movie catalog
- **Video Playback**: Stream movies with subtitle support
- **User Authentication**: Login and profile management
- **Payment Integration**: SmartPay payment gateway integration
- **Multi-Resolution Support**: Optimized layouts for 1280x720, 1920x1080, and 1920x1200
- **Remote Control Navigation**: TV remote-friendly navigation
- **Queue Management**: Manage watchlist and viewing queue
- **Real-time Updates**: Pusher integration for real-time events
- **Mobile Remote**: Companion mobile.html for smartphone remote control

## Architecture

The application follows a modular architecture built on Backbone.js:

```
┌─────────────────────────────────────────┐
│           Vifi Engine (Core)            │
├─────────────────────────────────────────┤
│  Views    Models    Collections         │
├─────────────────────────────────────────┤
│  Platform Layer (Samsung/Browser/Flash) │
├─────────────────────────────────────────┤
│  Backend API Communication              │
└─────────────────────────────────────────┘
```

### Core Modules

- **vifi_engine.js** - Core application engine and module loader
- **vifi_backend.js** - Backend API communication layer
- **vifi_app.js** - Main application views and controllers
- **vifi_player.js** - Video player controller
- **vifi_navigation.js** - TV remote navigation handler
- **vifi_films.js** - Movie browsing and detail views
- **vifi_user.js** - User authentication and profile management
- **vifi_platform.js** - Platform detection and adaptation
- **vifi_mediaplayer_*.js** - Platform-specific media player implementations

## Project Structure

```
vifi.ee-smarttv-application/
├── app/
│   ├── javascript/          # JavaScript source files
│   │   ├── vifi_*.js       # Custom Vifi application modules
│   │   ├── vendor.js       # Vendor library bundle
│   │   ├── jquery-*.js     # jQuery and plugins
│   │   ├── backbone-min.js # Backbone.js framework
│   │   ├── underscore-min.js # Underscore.js utility library
│   │   ├── flowplayer/     # Flowplayer video player
│   │   └── tv-ui-compiled.js # TV UI library
│   ├── stylesheets/
│   │   ├── style.css       # Main styles
│   │   ├── player.css      # Video player styles
│   │   ├── resolutions/    # Resolution-specific styles
│   │   │   ├── 1280x720.css
│   │   │   ├── 1920x1080.css
│   │   │   └── 1920x1200.css
│   │   └── platforms/      # Platform-specific styles
│   │       ├── samsung.css
│   │       └── flash.css
│   └── swf/                # Flash/Flowplayer SWF files
├── icon/                   # Application icons
├── config.xml              # Samsung widget configuration
├── widget.info             # Widget display settings
├── index.html              # Main application entry point
└── mobile.html             # Mobile remote control interface
```

## Getting Started

### Prerequisites

- Samsung Smart TV SDK (for development and testing)
- Web server (for local testing)
- Modern web browser (for desktop testing)
- Node.js 14+ (for running tests and build tools)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/janiluuk/vifi.ee-smarttv-application.git
   cd vifi.ee-smarttv-application
   ```

2. Install dependencies (optional, for testing):
   ```bash
   npm install
   ```

3. Serve the application using a local web server:
   ```bash
   # Using npm script (recommended)
   npm start
   
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js http-server
   npx http-server -p 8000
   ```

3. Access the application:
   - **Desktop Browser**: http://localhost:8000/index.html
   - **Mobile Remote**: http://localhost:8000/mobile.html
   - **Samsung TV**: Deploy to TV using Samsung Smart TV SDK

## Development

### Testing

The project includes comprehensive automated tests to validate structure, functionality, and code quality:

```bash
# Run all tests (structure + unit tests)
npm run test:all

# Run structure tests only
npm test

# Run unit tests only
npm run test:unit

# Validate HTML structure
npm run validate

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

#### Test Coverage

Tests validate:
- **File Structure** (32 tests): Project organization and required files
- **Unit Tests** (28 tests): Module structure and code quality
- **HTML Validation**: Markup structure and validity
- **Code Quality**: ESLint rules and JSDoc documentation
- **Module Dependencies**: Proper library usage
- **Navigation System**: TV remote handling
- **Player System**: Media player implementations
- **Technical Debt**: Tracking TODOs and improvements

See [docs/TESTING.md](docs/TESTING.md) for comprehensive testing documentation.

### Code Quality

The project uses ESLint for code quality enforcement:

- **Configuration**: `.eslintrc.json` with Smart TV-specific globals
- **Style Guide**: Consistent code formatting with `.editorconfig`
- **JSDoc**: Comprehensive inline documentation
- **Best Practices**: Enforced through linting rules

### Continuous Integration

GitHub Actions automatically runs tests on:
- Push to main/master branches
- Pull requests
- Push to feature branches (copilot/**)

The CI pipeline includes:
1. Install dependencies
2. Run ESLint for code quality
3. Run structure tests
4. Run unit tests
5. Validate HTML structure
6. Verify file structure and modules
7. Check documentation completeness

### Local Development

For local development without a Samsung TV:

1. Open `index.html` in a modern web browser
2. Use browser developer tools for debugging
3. The application will run in browser compatibility mode

### Samsung TV Development

1. Install Samsung Smart TV SDK
2. Package the application as a Samsung widget
3. Deploy to Samsung TV emulator or physical device
4. Use Samsung TV debugging tools

### Testing on Different Resolutions

The application supports multiple resolutions. Test using browser window sizes:
- 1280x720 (HD Ready)
- 1920x1080 (Full HD)
- 1920x1200 (WUXGA)

### Code Style

- Use meaningful variable names
- Follow existing code patterns
- Add JSDoc comments for functions and modules
- Test on multiple resolutions
- Follow ESLint rules (run `npm run lint`)
- Use `.editorconfig` for consistent formatting

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Deployment

### Samsung Smart TV Widget

1. Ensure all files are in place and tested
2. Update version in `config.xml`
3. Package application following Samsung widget guidelines
4. Submit to Samsung Apps Store or deploy internally

### Configuration Files

- **config.xml**: Samsung widget metadata and settings
- **widget.info**: Display resolution and alpha blending settings

## Technologies

### Core Libraries

- **Backbone.js** - MVC framework
- **jQuery 2.1.0** - DOM manipulation and utilities
- **Underscore.js** - Utility functions
- **ICanHaz.js** - Templating engine

### Video Playback

- **Flowplayer** - Flash-based video player
- **Samsung SEF API** - Native Samsung TV media player
- **Custom Media Player** - Browser fallback implementation

### Additional Libraries

- **jQuery LazyLoad** - Lazy loading images
- **jQuery ScrollTo** - Smooth scrolling
- **jQuery waitForImages** - Image loading detection

### Backend Integration

- **Vifi Backend API** - RESTful API at `backend.vifi.ee`
- **Pusher** - Real-time event streaming
- **SmartPay Gateway** - Payment processing

## Configuration

### API Settings

Located in `vifi_engine.js`:

```javascript
Vifi.Settings = {
    version: "0.99.101214",
    debug: false,
    api_url: 'http://backend.vifi.ee/api/',
    api_key: '27ah12A3d76f32',
    // ... other settings
}
```

### Display Settings

In `widget.info`:
```
Screen Resolution = 1280x720
Use Alpha Blending? = Yes
```

## Browser Support

- **Primary**: Samsung Smart TV Browser (Webkit-based)
- **Testing**: Modern desktop browsers (Chrome, Firefox, Safari)
- **Mobile**: WebKit-based mobile browsers for remote control

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the code style guidelines
4. Run tests: `npm run test:all`
5. Run linting: `npm run lint`
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

Please ensure:
- Code follows existing style conventions and ESLint rules
- All tests pass (structure + unit tests)
- Add tests for new functionality
- Update documentation as needed
- Test on Samsung TV emulator or browser

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Documentation

- **[README.md](README.md)** - Project overview and getting started
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[docs/API.md](docs/API.md)** - Backend API documentation
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guide
- **[docs/TESTING.md](docs/TESTING.md)** - Testing guide
- **[docs/OPTIMIZATION.md](docs/OPTIMIZATION.md)** - Performance optimization
- **[tests/README.md](tests/README.md)** - Test infrastructure details

## License

Copyright (c) Vificom OÜ. All rights reserved.

Contact: tugi@vifi.ee

---

## Troubleshooting

### Common Issues

**Application not loading on TV:**
- Check that all Samsung API scripts are accessible
- Verify widget.info settings match TV capabilities
- Check network connectivity to backend.vifi.ee

**Video playback issues:**
- Ensure correct media player is selected for platform
- Check video URL accessibility
- Verify subtitle file formats

**Navigation not working:**
- Verify TV remote key mappings in vifi_keyhandler.js
- Check that Samsung TVKeyValue API is loaded
- Test focus management in vifi_navigation.js

## Support

For support and questions:
- Email: tugi@vifi.ee
- Website: http://www.vifi.ee

## Acknowledgments

- Samsung Smart TV SDK
- Flowplayer team
- Backbone.js community
- jQuery team
