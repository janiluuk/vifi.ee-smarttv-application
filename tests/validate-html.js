#!/usr/bin/env node

/**
 * HTML Validator for Vifi Smart TV Application
 * Performs basic HTML structure validation
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

let errors = 0;
let warnings = 0;

/**
 * Log error message
 */
function logError(message) {
    console.log(`${colors.red}✗ ERROR: ${message}${colors.reset}`);
    errors++;
}

/**
 * Log warning message
 */
function logWarning(message) {
    console.log(`${colors.yellow}⚠ WARNING: ${message}${colors.reset}`);
    warnings++;
}

/**
 * Log success message
 */
function logSuccess(message) {
    console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

/**
 * Validate HTML file
 */
function validateHTML(filePath) {
    console.log(`\n${colors.blue}Validating ${filePath}...${colors.reset}`);
    
    if (!fs.existsSync(filePath)) {
        logError(`File not found: ${filePath}`);
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check DOCTYPE
    if (!content.match(/<!DOCTYPE\s+html>/i)) {
        logWarning(`${filePath}: Missing or invalid DOCTYPE declaration`);
    } else {
        logSuccess('DOCTYPE declaration found');
    }
    
    // Check HTML tag
    if (!content.match(/<html[^>]*>/i)) {
        logError(`${filePath}: Missing <html> tag`);
    } else {
        logSuccess('HTML tag found');
    }
    
    // Check head tag
    if (!content.match(/<head[^>]*>/i)) {
        logError(`${filePath}: Missing <head> tag`);
    } else {
        logSuccess('Head tag found');
    }
    
    // Check body tag
    if (!content.match(/<body[^>]*>/i)) {
        logError(`${filePath}: Missing <body> tag`);
    } else {
        logSuccess('Body tag found');
    }
    
    // Check charset
    if (!content.match(/<meta[^>]*charset[^>]*>/i)) {
        logWarning(`${filePath}: Missing charset declaration`);
    } else {
        logSuccess('Charset declaration found');
    }
    
    // Check title
    if (!content.match(/<title[^>]*>.*<\/title>/i)) {
        logWarning(`${filePath}: Missing or empty <title> tag`);
    } else {
        logSuccess('Title tag found');
    }
    
    // Check for script tags
    const scriptTags = content.match(/<script[^>]*>/gi);
    if (scriptTags) {
        logSuccess(`Found ${scriptTags.length} script tags`);
        
        // Validate script paths
        scriptTags.forEach((tag, index) => {
            const srcMatch = tag.match(/src=["']([^"']+)["']/i);
            if (srcMatch) {
                const src = srcMatch[1];
                // Check if it's a local file (not external URL or Samsung API)
                if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('$MANAGER_WIDGET')) {
                    const scriptPath = path.join(path.dirname(filePath), src);
                    if (!fs.existsSync(scriptPath)) {
                        logError(`Script not found: ${src}`);
                    }
                }
            }
        });
    }
    
    // Check for CSS links
    const linkTags = content.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi);
    if (linkTags) {
        logSuccess(`Found ${linkTags.length} stylesheet links`);
        
        // Validate CSS paths
        linkTags.forEach(tag => {
            const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
            if (hrefMatch) {
                const href = hrefMatch[1];
                // Check if it's a local file (not external URL)
                if (!href.startsWith('http') && !href.startsWith('//')) {
                    const cssPath = path.join(path.dirname(filePath), href);
                    if (!fs.existsSync(cssPath)) {
                        logError(`Stylesheet not found: ${href}`);
                    }
                }
            }
        });
    }
    
    // Check for unclosed tags (basic check)
    const openDivs = (content.match(/<div[^>]*>/gi) || []).length;
    const closeDivs = (content.match(/<\/div>/gi) || []).length;
    if (openDivs !== closeDivs) {
        logWarning(`${filePath}: Mismatched <div> tags (${openDivs} open, ${closeDivs} close)`);
    }
}

/**
 * Validate config.xml
 */
function validateConfigXML() {
    console.log(`\n${colors.blue}Validating config.xml...${colors.reset}`);
    
    const filePath = 'config.xml';
    if (!fs.existsSync(filePath)) {
        logError('config.xml not found');
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check XML declaration
    if (!content.match(/<\?xml[^>]*\?>/i)) {
        logWarning('Missing XML declaration');
    } else {
        logSuccess('XML declaration found');
    }
    
    // Check widget tag
    if (!content.match(/<widget[^>]*>/i)) {
        logError('Missing <widget> tag');
    } else {
        logSuccess('Widget tag found');
    }
    
    // Check required Samsung widget elements
    const requiredElements = ['widgetname', 'ver', 'mgrver'];
    requiredElements.forEach(element => {
        if (!content.match(new RegExp(`<${element}[^>]*>`, 'i'))) {
            logError(`Missing required element: <${element}>`);
        } else {
            logSuccess(`Required element found: <${element}>`);
        }
    });
}

// Main execution
console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.blue}Vifi Smart TV Application - HTML Validation${colors.reset}`);
console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);

// Validate HTML files
validateHTML('index.html');
validateHTML('mobile.html');

// Validate config.xml
validateConfigXML();

// Print summary
console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.blue}Validation Summary${colors.reset}`);
console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.red}Errors: ${errors}${colors.reset}`);
console.log(`${colors.yellow}Warnings: ${warnings}${colors.reset}`);

if (errors > 0) {
    console.log(`\n${colors.red}Validation failed with ${errors} error(s)!${colors.reset}`);
    process.exit(1);
} else if (warnings > 0) {
    console.log(`\n${colors.green}Validation passed with ${warnings} warning(s).${colors.reset}`);
    process.exit(0);
} else {
    console.log(`\n${colors.green}All validation checks passed!${colors.reset}`);
    process.exit(0);
}
