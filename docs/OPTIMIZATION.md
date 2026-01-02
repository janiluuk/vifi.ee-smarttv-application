# Optimization Guide

This document describes optimization strategies, performance considerations, and best practices for the Vifi Smart TV Application.

## Table of Contents

- [Performance Overview](#performance-overview)
- [Loading Optimization](#loading-optimization)
- [Memory Management](#memory-management)
- [Network Optimization](#network-optimization)
- [Rendering Performance](#rendering-performance)
- [Video Playback Optimization](#video-playback-optimization)
- [Code Optimization](#code-optimization)
- [Platform-Specific Optimizations](#platform-specific-optimizations)
- [Monitoring and Profiling](#monitoring-and-profiling)

## Performance Overview

### Current Performance Characteristics

The Vifi Smart TV Application is optimized for Smart TV environments with:
- Limited CPU and memory resources
- Network bandwidth constraints
- TV-optimized UI rendering
- Remote control input latency considerations

### Key Performance Metrics

- **Initial Load Time**: Target < 3 seconds
- **Page Transition**: Target < 500ms
- **Video Start Time**: Target < 2 seconds
- **Memory Usage**: Target < 100MB baseline
- **API Response Time**: Target < 1 second

## Loading Optimization

### Script Loading Strategy

The application uses a modular loading approach:

```javascript
// Core libraries loaded first (vendor.js)
// - jQuery 2.1.0
// - Backbone.js
// - Underscore.js
// - ICanHaz.js (templating)

// Application modules loaded sequentially
// - vifi_engine.js (core)
// - vifi_backend.js (API layer)
// - vifi_navigation.js (UI navigation)
// - Other modules as needed
```

### Optimization Strategies

1. **Minified Libraries**: All vendor libraries are minified
2. **Script Concatenation**: Related scripts bundled together
3. **Lazy Loading**: Non-critical modules loaded on-demand
4. **Asset Preloading**: Critical images and fonts preloaded

### Recommendations

- Consider implementing service workers for offline capability
- Use HTTP/2 for multiplexed requests
- Implement resource hints (preconnect, prefetch, preload)
- Consider code splitting for large modules

## Memory Management

### Current Memory Usage

- **Baseline**: ~50-80MB for application shell
- **With Content**: ~100-150MB with movie listings
- **Video Playback**: +50-100MB during playback

### Memory Optimization Techniques

#### 1. Event Listener Cleanup

Always unbind event listeners when views are destroyed:

```javascript
// Good - cleanup in remove
remove: function() {
    this.model.off('change', this.render, this);
    Vifi.Event.off('page:change', this.handlePageChange, this);
    Backbone.View.prototype.remove.call(this);
}
```

#### 2. Collection Management

Remove models from collections when no longer needed:

```javascript
// Clear collection when switching views
this.collection.reset();

// Remove individual models
this.collection.remove(model);
```

#### 3. DOM Element Cleanup

Properly cleanup DOM elements to prevent memory leaks:

```javascript
// Good - empty containers before re-rendering
this.$el.empty();
this.render();

// Bad - appending without cleanup causes memory leaks
this.$el.append(newContent); // without clearing first
```

#### 4. Navigation History Limits

The navigation history stack has a maximum size to prevent unbounded growth:

```javascript
History: {
    maxStackLength: 50,  // Prevents memory growth
    // ... rest of implementation
}
```

### Memory Leak Prevention

Common causes and solutions:

| Cause | Solution |
|-------|----------|
| Unbound event listeners | Use `off()` in cleanup |
| Circular references | Use weak references or manual cleanup |
| Cached DOM elements | Clear references when done |
| Global variables | Minimize use, cleanup when possible |
| Timers/intervals | Clear with `clearInterval()`/`clearTimeout()` |

## Network Optimization

### API Request Optimization

#### 1. JSONP for Cross-Domain Requests

The application uses JSONP to avoid CORS issues:

```javascript
// Efficient JSONP implementation
this.url = this.baseUrl + '&api_key=' + Vifi.Settings.api_key + '&jsoncallback=?';
```

#### 2. Request Batching

Group related API calls to reduce round trips:

```javascript
// Good - single request for multiple items
/api/films/?ids=1,2,3,4,5

// Bad - multiple requests
/api/films/1, /api/films/2, ...
```

#### 3. Response Caching

Cache API responses appropriately:

```javascript
// Backbone.Collection automatically caches
var cachedModel = this.collection.get(id);
if (cachedModel) {
    return cachedModel; // Use cache
}
```

#### 4. Image Optimization

- Use lazy loading for images: `jquery.lazyload.min.js`
- Load appropriate image sizes for TV resolutions
- Implement progressive image loading

### Network Best Practices

1. **Minimize API Calls**: Cache results, batch requests
2. **Compress Responses**: Use gzip compression on server
3. **CDN Usage**: Serve static assets from CDN
4. **Connection Pooling**: Reuse HTTP connections
5. **Timeout Handling**: Set appropriate request timeouts

## Rendering Performance

### DOM Manipulation Optimization

#### 1. Batch DOM Updates

```javascript
// Good - batch updates
var fragment = document.createDocumentFragment();
items.forEach(function(item) {
    fragment.appendChild(createItemElement(item));
});
container.appendChild(fragment);

// Bad - multiple reflows
items.forEach(function(item) {
    container.appendChild(createItemElement(item));
});
```

#### 2. Minimize Reflows

Avoid layout thrashing:

```javascript
// Bad - causes multiple reflows
element.style.width = '100px';
var height = element.offsetHeight;
element.style.height = '200px';

// Good - read then write
var height = element.offsetHeight;
element.style.width = '100px';
element.style.height = '200px';
```

#### 3. Use CSS Transforms

For animations, prefer CSS transforms over position changes:

```javascript
// Good - GPU accelerated
element.style.transform = 'translateX(100px)';

// Bad - causes reflow
element.style.left = '100px';
```

### Rendering Best Practices

1. **Debounce Scroll Events**: Use debouncing for scroll handlers
2. **RequestAnimationFrame**: Use for smooth animations
3. **Virtual Scrolling**: For long lists, render only visible items
4. **CSS Animations**: Prefer CSS over JavaScript for animations
5. **Hardware Acceleration**: Use `transform: translateZ(0)` when needed

## Video Playback Optimization

### Adaptive Bitrate Streaming

The application supports multiple video profiles:

```javascript
videos: [{
    'mp4': 'url-to-video',
    'profile': 'high',  // High quality for good connections
    'code': 'h264'
}, {
    'mp4': 'url-to-video',
    'profile': 'low',   // Low quality for slow connections
    'code': 'h264'
}]
```

### Playback Optimization Strategies

1. **Preloading**: Preload next episode/content
2. **Buffering**: Implement smart buffering strategies
3. **Quality Selection**: Auto-select based on bandwidth
4. **Resume Position**: Save and restore playback position
5. **Subtitle Optimization**: Load subtitles asynchronously

### Samsung TV Optimizations

```javascript
// Use native Samsung player when available
if (Vifi.Platform.isSamsung()) {
    // Native player is more efficient
    Vifi.MediaPlayer.useSamsungPlayer();
}
```

## Code Optimization

### JavaScript Performance

#### 1. Avoid Global Lookups

```javascript
// Good - cache global references
var settings = Vifi.Settings;
var apiUrl = settings.api_url;

// Bad - repeated global lookups
Vifi.Settings.api_url
Vifi.Settings.api_url
```

#### 2. Use Native Methods

```javascript
// Good - native methods are faster
Array.prototype.forEach.call(elements, callback);

// Bad - slower iteration
for (var i = 0; i < elements.length; i++) {
    callback(elements[i]);
}
```

#### 3. Minimize Closures

Closures have memory overhead:

```javascript
// Good - reuse functions
MyView.prototype.handleClick = function() { /*...*/ };

// Bad - creates new function each time
initialize: function() {
    this.on('click', function() { /*...*/ });
}
```

### Code Splitting Opportunities

Consider splitting these modules for lazy loading:

1. **Payment Module**: Load only when needed
2. **Subtitle Engine**: Load only for subtitle-enabled content
3. **Search Module**: Load on first search
4. **User Profile**: Load after authentication

## Platform-Specific Optimizations

### Samsung Smart TV

- **Use Native APIs**: Prefer Samsung SEF APIs over polyfills
- **Hardware Decoding**: Enable hardware video decoding
- **Key Handling**: Use TVKeyValue for efficient key processing
- **Memory Management**: More aggressive cleanup on Samsung

### Browser (Desktop Testing)

- **Service Workers**: Cache for offline capability
- **IndexedDB**: Store larger datasets locally
- **Web Workers**: Offload heavy processing
- **LocalStorage**: Cache user preferences

### Flash Player (Legacy)

- **FlowPlayer**: Optimized configuration
- **Stage Quality**: Reduce quality for performance
- **Memory Limits**: More conservative memory usage

## Monitoring and Profiling

### Performance Monitoring

Enable debug mode for performance tracking:

```javascript
Vifi.Settings.debug = true;
```

### Browser DevTools

Use Chrome DevTools for profiling:

1. **Timeline**: Record page rendering
2. **Memory**: Take heap snapshots
3. **Network**: Analyze request timing
4. **Performance**: CPU profiling

### Custom Metrics

Add custom performance markers:

```javascript
performance.mark('app-start');
// ... application code
performance.mark('app-ready');
performance.measure('app-load', 'app-start', 'app-ready');
```

### Key Metrics to Monitor

- **Time to Interactive (TTI)**
- **First Contentful Paint (FCP)**
- **Memory Usage Over Time**
- **Network Request Count/Size**
- **JavaScript Execution Time**
- **Frame Rate (FPS)**

## Optimization Checklist

### Development Phase

- [ ] Enable debug logging for performance tracking
- [ ] Profile memory usage during development
- [ ] Test on actual Samsung TV hardware
- [ ] Verify network usage in various conditions
- [ ] Check for memory leaks with heap snapshots

### Pre-Production

- [ ] Minify and compress all assets
- [ ] Optimize images (compress, proper formats)
- [ ] Enable gzip compression on server
- [ ] Configure CDN for static assets
- [ ] Review and optimize API endpoints

### Production

- [ ] Monitor real-world performance metrics
- [ ] Set up error tracking and reporting
- [ ] Configure cache headers appropriately
- [ ] Implement rate limiting on API
- [ ] Regular performance audits

## Best Practices Summary

### Do's ✅

- Cache API responses when appropriate
- Clean up event listeners and DOM elements
- Use hardware acceleration for animations
- Batch DOM updates
- Lazy load non-critical resources
- Monitor memory usage
- Test on real hardware

### Don'ts ❌

- Don't create memory leaks with unbound events
- Don't block the main thread
- Don't make unnecessary API requests
- Don't manipulate DOM in loops
- Don't use global variables excessively
- Don't ignore browser warnings
- Don't skip testing on actual TVs

## Future Optimization Opportunities

### Short Term

1. Implement service workers for offline support
2. Add more aggressive image lazy loading
3. Optimize API response payloads
4. Implement request debouncing/throttling
5. Add performance budgets to CI

### Long Term

1. Migrate to modern JavaScript (ES6+)
2. Implement module bundling (Webpack)
3. Add code splitting and lazy loading
4. Implement virtual scrolling for lists
5. Consider Progressive Web App (PWA) features
6. Implement HTTP/2 server push
7. Add WebAssembly for critical paths

## Resources

- [Samsung Smart TV SDK Documentation](https://developer.samsung.com/smarttv)
- [Web Performance Best Practices](https://web.dev/performance/)
- [JavaScript Performance Tips](https://developers.google.com/web/fundamentals/performance)
- [Memory Management in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

## Support

For performance questions or issues:
- Review this documentation
- Profile using browser DevTools
- Test on actual hardware
- Contact: tugi@vifi.ee

---

Last Updated: 2026-01-02
