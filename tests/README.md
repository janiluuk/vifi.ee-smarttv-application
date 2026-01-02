# Tests

This directory contains automated tests for the Vifi Smart TV Application.

## Test Files

### run-tests.js
Main test suite that validates:
- File structure and organization
- Core JavaScript modules presence
- Vendor library availability
- HTML structure and script paths
- Configuration files
- Documentation completeness

**Usage:**
```bash
npm test
# or
node tests/run-tests.js
```

### unit-tests.js
Unit test suite that validates:
- Module structure and namespace definitions
- Code quality and JSDoc comments
- API configuration settings
- Module dependencies and interactions
- Navigation system functionality
- Player system implementations
- Technical debt tracking (TODOs)

**Usage:**
```bash
npm run test:unit
# or
node tests/unit-tests.js
```

### validate-html.js
HTML validation script that checks:
- DOCTYPE declarations
- HTML structure (html, head, body tags)
- Charset and title tags
- Script and stylesheet paths
- Tag matching
- config.xml structure

**Usage:**
```bash
npm run validate
# or
node tests/validate-html.js
```

## Running Tests

### Locally

```bash
# Install dependencies (if needed)
npm install

# Run all tests
npm run test:all

# Run structure tests only
npm test

# Run unit tests only
npm run test:unit

# Run HTML validation
npm run validate

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### CI/CD
Tests run automatically via GitHub Actions on:
- Push to main/master branches
- Push to copilot/** branches
- Pull requests to main/master

## Test Coverage

The test suite covers:
- ✅ 32 file structure and module tests
- ✅ 28 unit tests for core modules
- ✅ HTML structure validation
- ✅ Configuration file validation
- ✅ Documentation presence checks
- ✅ ESLint code quality checks

## Adding New Tests

### Structure Tests (run-tests.js)

```javascript
test('Your test description', () => {
    assert(condition, 'Error message if condition fails');
});
```

### Unit Tests (unit-tests.js)

```javascript
test('Module has expected functionality', () => {
    const content = readFile('path/to/module.js');
    assert(content.includes('expectedText'), 'Expected text not found');
});
```

## Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed

## Test Development

For detailed testing documentation, see [docs/TESTING.md](../docs/TESTING.md).

Topics covered:
- Test types and structure
- Writing new tests
- Debugging tests
- Best practices
- CI integration
- Code coverage

## Notes

- Structure tests validate file presence and organization
- Unit tests check module structure and code patterns
- Tests don't execute JavaScript code directly (no runtime testing)
- For runtime testing, use Samsung TV emulator or browser testing
- All tests run in Node.js environment using JSDOM for DOM simulation
