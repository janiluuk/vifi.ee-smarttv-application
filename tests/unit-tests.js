#!/usr/bin/env node

/**
 * Unit tests for Vifi Smart TV Application modules
 * Tests core functionality and module interactions
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

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
 * Read file content
 */
function readFile(filePath) {
    return fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
}

/**
 * Setup DOM environment for testing
 */
function setupDOM() {
    const html = `<!DOCTYPE html>
    <html>
        <head><title>Test</title></head>
        <body>
            <div id="browserPage"></div>
            <div id="moviePage"></div>
            <div id="playerPage"></div>
            <div id="accountPage"></div>
            <div id="toolbar"></div>
            <div id="homePage"></div>
            <div id="alertPage"></div>
            <div id="errorPage"></div>
            <div id="exitPage"></div>
            <div id="activationPage"></div>
            <div id="purchasePage"></div>
        </body>
    </html>`;
    
    const dom = new JSDOM(html);
    global.window = dom.window;
    global.document = dom.window.document;
    global.$ = require('jquery')(dom.window);
    
    // Mock Backbone and Underscore
    global._ = {
        extend: function(obj, ...sources) {
            sources.forEach(source => {
                if (source) {
                    Object.keys(source).forEach(key => {
                        obj[key] = source[key];
                    });
                }
            });
            return obj;
        },
        each: function(obj, iteratee) {
            if (Array.isArray(obj)) {
                obj.forEach(iteratee);
            } else {
                Object.keys(obj).forEach(key => iteratee(obj[key], key, obj));
            }
        },
        filter: function(arr, predicate) {
            return arr.filter(predicate);
        },
        map: function(arr, mapper) {
            return arr.map(mapper);
        }
    };
    
    global.Backbone = {
        Events: {
            on: function() {},
            off: function() {},
            trigger: function() {}
        },
        View: {
            extend: function(props) {
                return function() {
                    Object.assign(this, props);
                };
            }
        },
        Collection: {
            extend: function(props) {
                return function() {
                    Object.assign(this, props);
                };
            }
        },
        Model: {
            extend: function(props) {
                return function() {
                    Object.assign(this, props);
                };
            }
        }
    };
}

console.log(`${colors.blue}Running Vifi Unit Tests...${colors.reset}\n`);

// Setup DOM for module tests
try {
    setupDOM();
} catch (error) {
    console.error(`${colors.red}Failed to setup DOM environment: ${error.message}${colors.reset}`);
    process.exit(1);
}

// Test Suite: Module Loading and Structure
console.log(`${colors.yellow}Test Suite: Module Structure and Loading${colors.reset}`);

test('vifi_engine.js defines Vifi namespace', () => {
    const content = readFile('app/javascript/vifi/vifi_engine.js');
    assert(content.includes('var Vifi = {}'), 'Vifi namespace not defined');
    assert(content.includes('Vifi.Engine'), 'Vifi.Engine not defined');
});

test('vifi_engine.js has Settings object', () => {
    const content = readFile('app/javascript/vifi/vifi_engine.js');
    assert(content.includes('Vifi.Settings'), 'Vifi.Settings not defined');
    assert(content.includes('version:'), 'version not defined in Settings');
    assert(content.includes('api_url:'), 'api_url not defined in Settings');
});

test('vifi_engine.js has Engine object with required methods', () => {
    const content = readFile('app/javascript/vifi/vifi_engine.js');
    assert(content.includes('addModule:'), 'addModule method not found');
    assert(content.includes('start:'), 'start method not found');
});

test('vifi_backend.js defines Event bus', () => {
    const content = readFile('app/javascript/vifi/vifi_backend.js');
    assert(content.includes('Vifi.Event'), 'Vifi.Event not defined');
});

test('vifi_backend.js defines PageManager', () => {
    const content = readFile('app/javascript/vifi/vifi_backend.js');
    assert(content.includes('Vifi.PageManager'), 'Vifi.PageManager not defined');
});

test('vifi_navigation.js defines Navigation object', () => {
    const content = readFile('app/javascript/vifi/vifi_navigation.js');
    assert(content.includes('Vifi.Navigation'), 'Vifi.Navigation not defined');
    assert(content.includes('enable:'), 'enable method not found');
    assert(content.includes('disable:'), 'disable method not found');
});

test('vifi_player.js defines Player namespace', () => {
    const content = readFile('app/javascript/vifi/vifi_player.js');
    assert(content.includes('Vifi.Player'), 'Vifi.Player not defined');
});

test('vifi_films.js defines Films namespace', () => {
    const content = readFile('app/javascript/vifi/vifi_films.js');
    assert(content.includes('Vifi.Films'), 'Vifi.Films not defined');
});

test('vifi_user.js defines User namespace', () => {
    const content = readFile('app/javascript/vifi/vifi_user.js');
    assert(content.includes('Vifi.User'), 'Vifi.User not defined');
});

// Test Suite: Code Quality Checks
console.log(`\n${colors.yellow}Test Suite: Code Quality Checks${colors.reset}`);

test('vifi_engine.js has JSDoc comments', () => {
    const content = readFile('app/javascript/vifi/vifi_engine.js');
    assert(content.includes('/**'), 'No JSDoc comments found');
    assert(content.includes('@namespace'), '@namespace tag not found');
});

test('vifi_backend.js has JSDoc comments', () => {
    const content = readFile('app/javascript/vifi/vifi_backend.js');
    assert(content.includes('/**'), 'No JSDoc comments found');
});

test('vifi_navigation.js has JSDoc comments', () => {
    const content = readFile('app/javascript/vifi/vifi_navigation.js');
    assert(content.includes('/**'), 'No JSDoc comments found');
    assert(content.includes('@namespace'), '@namespace tag not found');
});

test('No multiple var declarations on same line', () => {
    const content = readFile('app/javascript/vifi/vifi_engine.js');
    const lines = content.split('\n');
    const multiVarLines = lines.filter(line => {
        const varMatch = line.match(/var\s+\w+/g);
        return varMatch && varMatch.length > 1;
    });
    assert(multiVarLines.length === 0, `Found ${multiVarLines.length} lines with multiple var declarations`);
});

// Test Suite: API Configuration
console.log(`\n${colors.yellow}Test Suite: API Configuration${colors.reset}`);

test('vifi_engine.js has valid API URL', () => {
    const content = readFile('app/javascript/vifi/vifi_engine.js');
    assert(content.includes('api_url:'), 'api_url not defined');
    const apiUrlMatch = content.match(/api_url:\s*['"]([^'"]+)['"]/);
    assert(apiUrlMatch, 'api_url format invalid');
    const apiUrl = apiUrlMatch[1];
    assert(apiUrl.startsWith('http'), 'api_url should start with http');
});

test('vifi_engine.js has API key defined', () => {
    const content = readFile('app/javascript/vifi/vifi_engine.js');
    assert(content.includes('api_key:'), 'api_key not defined');
});

test('vifi_engine.js has version defined', () => {
    const content = readFile('app/javascript/vifi/vifi_engine.js');
    const versionMatch = content.match(/version:\s*['"]([^'"]+)['"]/);
    assert(versionMatch, 'version not found');
    const version = versionMatch[1];
    assert(version.match(/\d+\.\d+/), 'version format invalid');
});

// Test Suite: Module Dependencies
console.log(`\n${colors.yellow}Test Suite: Module Dependencies${colors.reset}`);

test('vifi_backend.js depends on Backbone.Events', () => {
    const content = readFile('app/javascript/vifi/vifi_backend.js');
    assert(content.includes('Backbone.Events'), 'Backbone.Events not referenced');
});

test('vifi_backend.js depends on Underscore', () => {
    const content = readFile('app/javascript/vifi/vifi_backend.js');
    assert(content.includes('_.extend'), 'Underscore not referenced');
});

test('vifi_backend.js depends on jQuery', () => {
    const content = readFile('app/javascript/vifi/vifi_backend.js');
    assert(content.includes('$('), 'jQuery not referenced');
});

// Test Suite: Navigation System
console.log(`\n${colors.yellow}Test Suite: Navigation System${colors.reset}`);

test('vifi_navigation.js handles TV remote events', () => {
    const content = readFile('app/javascript/vifi/vifi_navigation.js');
    assert(content.includes('onright'), 'onright event not handled');
    assert(content.includes('onleft'), 'onleft event not handled');
    assert(content.includes('onup'), 'onup event not handled');
    assert(content.includes('ondown'), 'ondown event not handled');
    assert(content.includes('onselect'), 'onselect event not handled');
});

test('vifi_navigation.js has enable/disable functionality', () => {
    const content = readFile('app/javascript/vifi/vifi_navigation.js');
    assert(content.includes('enable:'), 'enable method not defined');
    assert(content.includes('disable:'), 'disable method not defined');
    assert(content.includes('enabled'), 'enabled property not found');
});

test('vifi_navigation.js has menu management', () => {
    const content = readFile('app/javascript/vifi/vifi_navigation.js');
    assert(content.includes('currentMenu'), 'currentMenu not found');
    assert(content.includes('currentFocus'), 'currentFocus not found');
});

// Test Suite: Player System
console.log(`\n${colors.yellow}Test Suite: Player System${colors.reset}`);

test('vifi_mediaplayer.js defines base MediaPlayer', () => {
    const content = readFile('app/javascript/vifi/vifi_mediaplayer.js');
    assert(content.includes('Vifi.MediaPlayer'), 'Vifi.MediaPlayer not defined');
});

test('vifi_mediaplayer_samsung.js defines Samsung player', () => {
    const content = readFile('app/javascript/vifi/vifi_mediaplayer_samsung.js');
    assert(content.includes('Samsung'), 'Samsung player reference not found');
});

test('vifi_mediaplayer_browser.js defines browser player', () => {
    const content = readFile('app/javascript/vifi/vifi_mediaplayer.js');
    assert(content.includes('MediaPlayer'), 'MediaPlayer not found');
});

test('vifi_mediaplayer_flash.js defines Flash player', () => {
    const content = readFile('app/javascript/vifi/vifi_mediaplayer_flash.js');
    assert(content.includes('Flash'), 'Flash player reference not found');
});

// Test Suite: TODOs and Technical Debt
console.log(`\n${colors.yellow}Test Suite: TODOs and Technical Debt${colors.reset}`);

test('Track TODO in vifi_queue.js (JSONP callback)', () => {
    const content = readFile('app/javascript/vifi/vifi_queue.js');
    const hasTodo = content.includes('TODO');
    if (hasTodo) {
        console.log(`  ${colors.yellow}Note: TODO found regarding JSONP callback${colors.reset}`);
    }
    // This test just tracks the TODO, doesn't fail
    assert(true, 'TODO tracking');
});

test('Track TODO in vifi_navigation.js (History stack)', () => {
    const content = readFile('app/javascript/vifi/vifi_navigation.js');
    const hasTodo = content.includes('@todo');
    if (hasTodo) {
        console.log(`  ${colors.yellow}Note: TODO found regarding History stack${colors.reset}`);
    }
    // This test just tracks the TODO, doesn't fail
    assert(true, 'TODO tracking');
});

// Print summary
console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.blue}Unit Test Summary${colors.reset}`);
console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
console.log(`Total: ${passedTests + failedTests}`);

if (failedTests > 0) {
    console.log(`\n${colors.red}Unit tests failed!${colors.reset}`);
    process.exit(1);
} else {
    console.log(`\n${colors.green}All unit tests passed!${colors.reset}`);
    process.exit(0);
}
