# Contributing to Vifi.ee Smart TV Application

Thank you for your interest in contributing to the Vifi.ee Smart TV Application! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

- Be respectful and professional
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- Git installed
- A local web server (Python's SimpleHTTPServer, Node.js http-server, etc.)
- Samsung Smart TV SDK (optional but recommended)
- A modern web browser for testing

### Setting Up Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vifi.ee-smarttv-application.git
   cd vifi.ee-smarttv-application
   ```

3. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Start a local development server:
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx http-server -p 8000
   ```

5. Open your browser to http://localhost:8000

## Development Workflow

### Branch Naming Convention

Use descriptive branch names:
- `feature/` - New features (e.g., `feature/add-watchlist`)
- `bugfix/` - Bug fixes (e.g., `bugfix/player-crash`)
- `hotfix/` - Urgent production fixes (e.g., `hotfix/security-patch`)
- `refactor/` - Code refactoring (e.g., `refactor/player-module`)
- `docs/` - Documentation updates (e.g., `docs/api-guide`)

### Making Changes

1. Make your changes in your feature branch
2. Test thoroughly on multiple resolutions
3. Ensure code follows the project's style guidelines
4. Commit your changes with clear, descriptive messages

### Commit Message Guidelines

Write clear and descriptive commit messages:

```
Short summary (50 chars or less)

More detailed explanation if needed. Wrap at 72 characters.
Explain what changed and why, not how.

- Bullet points are acceptable
- Use present tense ("Add feature" not "Added feature")
- Reference issues: "Fixes #123" or "Related to #456"
```

Examples:
- `Add subtitle support for Estonian language`
- `Fix video player crash on Samsung TV Series 5`
- `Refactor navigation module for better performance`
- `Update API endpoint for movie search`

## Coding Standards

### JavaScript

- **Indentation**: 4 spaces (no tabs)
- **Semicolons**: Use semicolons at the end of statements
- **Quotes**: Single quotes for strings (except when avoiding escaping)
- **Variable naming**: camelCase for variables and functions, PascalCase for constructors
- **Comments**: Use JSDoc format for function documentation

Example:
```javascript
/**
 * Loads movie data from the API
 * @param {string} movieId - The unique identifier for the movie
 * @param {Function} callback - Callback function on success
 * @returns {void}
 */
function loadMovie(movieId, callback) {
    var apiUrl = Vifi.Settings.api_url + 'movies/' + movieId;
    
    $.ajax({
        url: apiUrl,
        success: function(data) {
            callback(data);
        }
    });
}
```

### CSS

- **Indentation**: 4 spaces
- **Property order**: Alphabetical within blocks
- **Class naming**: Use lowercase with hyphens (kebab-case)
- **Comments**: Use for section breaks and complex selectors

### HTML

- **Indentation**: 4 spaces
- **Attributes**: Use double quotes
- **Semantic markup**: Use appropriate HTML5 elements

## Project Structure

Understand the project layout before making changes:

```
app/
├── javascript/
│   ├── lib/              # Third-party libraries (don't modify)
│   │   ├── jquery-2.1.0.min.js
│   │   ├── backbone-min.js
│   │   └── vendor.js
│   ├── vifi/             # Vifi application modules
│   │   ├── vifi_engine.js       # Core engine
│   │   ├── vifi_backend.js      # API communication
│   │   ├── vifi_player.js       # Video player
│   │   └── ...
│   └── flowplayer/       # Flowplayer video library
├── stylesheets/
│   ├── style.css         # Main styles
│   ├── player.css        # Video player styles
│   ├── resolutions/      # Resolution-specific styles
│   └── platforms/        # Platform-specific styles
└── swf/                  # Flash files for video playback
```

### Key Modules

- **vifi_engine.js**: Application initialization and module management
- **vifi_backend.js**: All API interactions with backend.vifi.ee
- **vifi_player.js**: Video player controller
- **vifi_navigation.js**: TV remote navigation handling
- **vifi_films.js**: Movie browsing and display
- **vifi_user.js**: User authentication and profile

## Testing Guidelines

### Browser Testing

Test your changes on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)

### Resolution Testing

Test on multiple resolutions:
- 1280x720 (HD Ready)
- 1920x1080 (Full HD)
- 1920x1200 (WUXGA)

You can simulate resolutions by resizing your browser window.

### Samsung TV Testing

If possible, test on:
- Samsung TV Emulator (from Samsung SDK)
- Physical Samsung Smart TV (various series)

### What to Test

- Navigation with keyboard (arrow keys, Enter, Backspace)
- Video playback and controls
- User login and logout
- Search functionality
- Movie browsing and filtering
- Different screen orientations (if applicable)

## Submitting Changes

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Changes have been tested on multiple browsers
- [ ] Changes work on different resolutions
- [ ] No console errors or warnings
- [ ] Commit messages are clear and descriptive
- [ ] Documentation updated (if needed)

### Pull Request Process

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the original repository on GitHub

3. Click "New Pull Request"

4. Select your fork and branch

5. Fill in the pull request template:
   - **Title**: Clear, concise description
   - **Description**: What changed and why
   - **Testing**: How you tested the changes
   - **Screenshots**: If UI changes, include before/after screenshots

6. Submit the pull request

### Pull Request Review

- Maintainers will review your code
- Address any requested changes
- Keep the discussion professional and constructive
- Once approved, your changes will be merged

## Reporting Issues

### Before Reporting

- Check if the issue already exists
- Try to reproduce the issue
- Gather relevant information (browser, TV model, etc.)

### Issue Template

When reporting issues, include:

1. **Description**: Clear description of the problem
2. **Steps to Reproduce**:
   1. Step one
   2. Step two
   3. Expected result
   4. Actual result
3. **Environment**:
   - Browser/TV model
   - Version
   - Screen resolution
4. **Screenshots/Videos**: If applicable
5. **Console Errors**: Any JavaScript errors

### Issue Labels

Use appropriate labels:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `question` - Further information requested
- `help wanted` - Extra attention needed

## Additional Resources

- [README.md](README.md) - Project overview and setup
- [Samsung Smart TV SDK Documentation](https://developer.samsung.com/smarttv)
- [Backbone.js Documentation](https://backbonejs.org/)
- [jQuery Documentation](https://jquery.com/)

## Questions?

If you have questions:
- Open an issue with the `question` label
- Contact: tugi@vifi.ee

---

Thank you for contributing to Vifi.ee Smart TV Application! 🎉
