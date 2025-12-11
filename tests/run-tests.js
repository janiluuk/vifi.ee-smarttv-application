#!/usr/bin/env node

/**
 * Basic test runner for Vifi Smart TV Application
 * Validates file structure and module dependencies
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

let passedTests = 0;
let failedTests = 0;

/**
 * Test helper function
 */
function test(description, testFn) {
    try {
        testFn();
        console.log(`${colors.green}✓${colors.reset} ${description}`);
        passedTests++;
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} ${description}`);
        console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
        failedTests++;
    }
}

/**
 * Assert helper
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
    return fs.existsSync(path.join(process.cwd(), filePath));
}

/**
 * Check if directory exists
 */
function dirExists(dirPath) {
    const fullPath = path.join(process.cwd(), dirPath);
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

/**
 * Read file content
 */
function readFile(filePath) {
    return fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
}

console.log(`${colors.blue}Running Vifi Smart TV Application Tests...${colors.reset}\n`);

// Test Suite: File Structure
console.log(`${colors.yellow}Test Suite: File Structure${colors.reset}`);

test('index.html exists', () => {
    assert(fileExists('index.html'), 'index.html not found');
});

test('mobile.html exists', () => {
    assert(fileExists('mobile.html'), 'mobile.html not found');
});

test('config.xml exists', () => {
    assert(fileExists('config.xml'), 'config.xml not found');
});

test('widget.info exists', () => {
    assert(fileExists('widget.info'), 'widget.info not found');
});

test('app/javascript/vifi directory exists', () => {
    assert(dirExists('app/javascript/vifi'), 'vifi directory not found');
});

test('app/javascript/lib directory exists', () => {
    assert(dirExists('app/javascript/lib'), 'lib directory not found');
});

test('app/stylesheets directory exists', () => {
    assert(dirExists('app/stylesheets'), 'stylesheets directory not found');
});

// Test Suite: Core JavaScript Modules
console.log(`\n${colors.yellow}Test Suite: Core JavaScript Modules${colors.reset}`);

const coreModules = [
    'vifi_engine.js',
    'vifi_backend.js',
    'vifi_player.js',
    'vifi_navigation.js',
    'vifi_films.js',
    'vifi_user.js',
    'vifi_platform.js',
    'vifi_mediaplayer.js',
    'vifi_app.js'
];

coreModules.forEach(module => {
    test(`${module} exists`, () => {
        const modulePath = `app/javascript/vifi/${module}`;
        assert(fileExists(modulePath), `${module} not found at ${modulePath}`);
    });
});

// Test Suite: Vendor Libraries
console.log(`\n${colors.yellow}Test Suite: Vendor Libraries${colors.reset}`);

const vendorLibs = [
    'jquery-2.1.0.min.js',
    'backbone-min.js',
    'underscore-min.js',
    'vendor.js'
];

vendorLibs.forEach(lib => {
    test(`${lib} exists`, () => {
        const libPath = `app/javascript/lib/${lib}`;
        assert(fileExists(libPath), `${lib} not found at ${libPath}`);
    });
});

// Test Suite: HTML Structure
console.log(`\n${colors.yellow}Test Suite: HTML Structure${colors.reset}`);

test('index.html contains DOCTYPE', () => {
    const content = readFile('index.html');
    assert(content.includes('<!DOCTYPE html>'), 'DOCTYPE declaration missing');
});

test('index.html loads vendor.js from lib/', () => {
    const content = readFile('index.html');
    assert(content.includes('app/javascript/lib/vendor.js'), 'vendor.js path incorrect');
});

test('index.html loads vifi_engine.js from vifi/', () => {
    const content = readFile('index.html');
    assert(content.includes('app/javascript/vifi/vifi_engine.js'), 'vifi_engine.js path incorrect');
});

test('mobile.html contains jQuery from lib/', () => {
    const content = readFile('mobile.html');
    assert(content.includes('app/javascript/lib/jquery'), 'jQuery path incorrect in mobile.html');
});

// Test Suite: Configuration Files
console.log(`\n${colors.yellow}Test Suite: Configuration Files${colors.reset}`);

test('config.xml is valid XML', () => {
    const content = readFile('config.xml');
    assert(content.includes('<?xml'), 'config.xml missing XML declaration');
    assert(content.includes('<widget'), 'config.xml missing widget tag');
});

test('config.xml contains widget name', () => {
    const content = readFile('config.xml');
    assert(content.includes('<widgetname>'), 'config.xml missing widgetname');
});

// Test Suite: Documentation
console.log(`\n${colors.yellow}Test Suite: Documentation${colors.reset}`);

test('README.md exists', () => {
    assert(fileExists('README.md'), 'README.md not found');
});

test('CONTRIBUTING.md exists', () => {
    assert(fileExists('CONTRIBUTING.md'), 'CONTRIBUTING.md not found');
});

test('LICENSE exists', () => {
    assert(fileExists('LICENSE'), 'LICENSE not found');
});

test('docs/API.md exists', () => {
    assert(fileExists('docs/API.md'), 'docs/API.md not found');
});

test('docs/ARCHITECTURE.md exists', () => {
    assert(fileExists('docs/ARCHITECTURE.md'), 'docs/ARCHITECTURE.md not found');
});

test('docs/DEPLOYMENT.md exists', () => {
    assert(fileExists('docs/DEPLOYMENT.md'), 'docs/DEPLOYMENT.md not found');
});

// Print summary
console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.blue}Test Summary${colors.reset}`);
console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
console.log(`Total: ${passedTests + failedTests}`);

if (failedTests > 0) {
    console.log(`\n${colors.red}Tests failed!${colors.reset}`);
    process.exit(1);
} else {
    console.log(`\n${colors.green}All tests passed!${colors.reset}`);
    process.exit(0);
}
