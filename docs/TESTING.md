# Testing Guide

This document describes the testing infrastructure for the Vifi Smart TV Application.

## Table of Contents

- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Continuous Integration](#continuous-integration)
- [Code Coverage](#code-coverage)
- [Best Practices](#best-practices)

## Test Types

### 1. Structure Tests (run-tests.js)

These tests validate the project structure and file organization:

- **File Structure**: Checks for required files and directories
- **Core Modules**: Validates all JavaScript modules exist
- **Vendor Libraries**: Ensures third-party dependencies are present
- **HTML Structure**: Validates HTML file structure and script paths
- **Configuration**: Checks config.xml and widget.info validity
- **Documentation**: Verifies documentation files exist

### 2. Unit Tests (unit-tests.js)

These tests validate the functionality and structure of individual modules:

- **Module Structure**: Checks namespace definitions and module exports
- **Code Quality**: Validates JSDoc comments and code style
- **API Configuration**: Verifies settings and configuration
- **Module Dependencies**: Checks proper dependency usage
- **Navigation System**: Tests navigation functionality
- **Player System**: Validates media player implementations
- **Technical Debt**: Tracks TODOs and areas for improvement

### 3. HTML Validation (validate-html.js)

Validates HTML structure using the W3C HTML validator:

- Checks DOCTYPE declarations
- Validates HTML syntax
- Ensures proper tag nesting
- Verifies attribute usage

## Running Tests

### Run All Tests

```bash
npm run test:all
```

This runs both structure tests and unit tests.

### Run Structure Tests Only

```bash
npm test
```

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run HTML Validation

```bash
npm run validate
```

### Run Linting

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

## Test Structure

### Directory Layout

```
tests/
├── README.md           # Testing documentation
├── run-tests.js        # Structure tests
├── unit-tests.js       # Unit tests
└── validate-html.js    # HTML validation
```

### Test Framework

The tests use a minimal custom test framework with:

- `test(description, testFn)` - Define a test
- `assert(condition, message)` - Assert a condition
- Color-coded output for pass/fail
- Exit codes for CI integration

### DOM Environment

Unit tests use JSDOM to simulate a browser environment:

- jQuery is available for DOM manipulation
- Basic Backbone.js mocks are provided
- Underscore.js utility functions are mocked

## Writing Tests

### Structure Test Example

```javascript
test('vifi_engine.js exists', () => {
    const modulePath = 'app/javascript/vifi/vifi_engine.js';
    assert(fileExists(modulePath), `${module} not found at ${modulePath}`);
});
```

### Unit Test Example

```javascript
test('vifi_engine.js has Settings object', () => {
    const content = readFile('app/javascript/vifi/vifi_engine.js');
    assert(content.includes('Vifi.Settings'), 'Vifi.Settings not defined');
    assert(content.includes('version:'), 'version not defined in Settings');
});
```

### Testing Best Practices

1. **Keep Tests Simple**: Each test should verify one thing
2. **Clear Descriptions**: Use descriptive test names
3. **Meaningful Assertions**: Include helpful error messages
4. **Independent Tests**: Tests should not depend on each other
5. **Fast Execution**: Tests should run quickly

## Continuous Integration

GitHub Actions automatically runs tests on:

- Push to main/master branches
- Pull requests
- Push to feature branches (copilot/**)

### CI Workflow

The CI workflow (.github/workflows/ci.yml) runs:

1. Install dependencies
2. Run structure tests
3. Run unit tests
4. Validate HTML
5. Check file structure
6. Verify JavaScript modules
7. Run ESLint (optional)

### CI Requirements

All tests must pass before merging:

- ✅ Structure tests: 32 tests pass
- ✅ Unit tests: 28 tests pass
- ✅ HTML validation: Valid markup
- ✅ Linting: No errors

## Code Coverage

Currently, the test suite provides:

- **File Structure Coverage**: 100% of required files
- **Module Presence**: All modules tested
- **Configuration Validation**: All config files validated
- **Documentation**: All docs checked

### Future Coverage Goals

- Add functional testing for key user flows
- Add integration tests for API interactions
- Add performance testing for video playback
- Add accessibility testing
- Implement code coverage metrics (Istanbul/NYC)

## Test Categories

### Critical Tests (Must Pass)

These tests validate core functionality:

- ✅ All required files exist
- ✅ Module namespaces defined
- ✅ API configuration valid
- ✅ Core dependencies present

### Quality Tests (Should Pass)

These tests ensure code quality:

- ⚠️ JSDoc comments present
- ⚠️ Code style consistent
- ⚠️ No duplicate declarations

### Tracking Tests (Informational)

These tests track technical debt:

- 📝 TODO items tracked
- 📝 FIXME items documented
- 📝 Incomplete implementations noted

## Best Practices

### When to Write Tests

- **Before fixing bugs**: Write a test that reproduces the bug
- **When adding features**: Write tests for new functionality
- **During refactoring**: Ensure tests still pass after changes
- **For documentation**: Tests serve as usage examples

### Test Naming Conventions

- Use descriptive names: `test('user can login with valid credentials')`
- Start with the subject: `vifi_engine.js has Settings object`
- Be specific: `vifi_navigation.js handles TV remote events`

### Test Organization

Group related tests into test suites:

```javascript
console.log('Test Suite: Navigation System');

test('vifi_navigation.js handles TV remote events', () => {
    // test implementation
});

test('vifi_navigation.js has enable/disable functionality', () => {
    // test implementation
});
```

### Assertion Messages

Always provide helpful error messages:

```javascript
// Good
assert(content.includes('Vifi.Settings'), 'Vifi.Settings not defined');

// Bad
assert(content.includes('Vifi.Settings'));
```

## Debugging Tests

### Running Individual Test Suites

Edit the test file to comment out other test suites:

```javascript
// console.log('Test Suite: File Structure');
// ... tests ...

console.log('Test Suite: Unit Tests');
// Focus on this suite only
```

### Adding Debug Output

Add console.log statements for debugging:

```javascript
test('module loads correctly', () => {
    const content = readFile('path/to/module.js');
    console.log('Content length:', content.length);
    assert(content.includes('expected'), 'message');
});
```

### Using Node Debugger

```bash
node inspect tests/unit-tests.js
```

## Known Issues and Limitations

### Current Limitations

1. **No functional tests**: Tests check structure but not runtime behavior
2. **No browser testing**: Tests run in JSDOM, not real browsers
3. **No integration tests**: API and backend interactions not tested
4. **No performance tests**: No benchmarking or load testing
5. **No E2E tests**: Complete user flows not tested

### Future Improvements

- Add Playwright/Puppeteer for browser testing
- Add API mocking with nock or msw
- Add performance monitoring
- Add visual regression testing
- Add accessibility testing with axe-core
- Implement test coverage reporting

## Troubleshooting

### Tests Fail After Dependency Update

1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Run tests: `npm run test:all`

### JSDOM Errors

If you see JSDOM-related errors:

1. Check that jQuery is installed: `npm list jquery`
2. Verify jsdom version: `npm list jsdom`
3. Update if needed: `npm update jsdom`

### ESLint Errors

If linting fails:

1. Check .eslintrc.json configuration
2. Review .eslintignore patterns
3. Run with --debug flag: `eslint --debug app/javascript/vifi/*.js`

## Contributing Tests

When contributing tests:

1. Follow existing test patterns
2. Use descriptive test names
3. Include clear assertions
4. Update this documentation if needed
5. Ensure all tests pass before submitting PR

## Resources

- [JSDOM Documentation](https://github.com/jsdom/jsdom)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Node.js Assert Module](https://nodejs.org/api/assert.html)
- [Testing Best Practices](https://testingjavascript.com/)

## Support

For testing questions or issues:

- Check existing test files for examples
- Review this documentation
- Open an issue on GitHub
- Contact: tugi@vifi.ee

---

Last Updated: 2026-01-02
