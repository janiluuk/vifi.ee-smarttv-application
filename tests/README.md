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
npm test

# Run HTML validation
npm run validate
```

### CI/CD
Tests run automatically via GitHub Actions on:
- Push to main/master branches
- Push to copilot/** branches
- Pull requests to main/master

## Test Coverage

The test suite covers:
- ✅ 32 file structure and module tests
- ✅ HTML structure validation
- ✅ Configuration file validation
- ✅ Documentation presence checks

## Adding New Tests

To add new tests to `run-tests.js`:

```javascript
test('Your test description', () => {
    assert(condition, 'Error message if condition fails');
});
```

## Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed

## Notes

- Tests are lightweight and don't require external dependencies
- Tests validate structure, not runtime functionality
- For runtime testing, use Samsung TV emulator or browser testing
