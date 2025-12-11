# Deployment Guide

This guide covers deploying the Vifi.ee Smart TV application to Samsung Smart TVs and web servers.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Samsung Smart TV Deployment](#samsung-smart-tv-deployment)
- [Web Server Deployment](#web-server-deployment)
- [Configuration](#configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- **Samsung Smart TV SDK** (for TV deployment)
- **Text editor** for configuration
- **Web server** (Apache, Nginx, or similar)
- **FTP/SSH access** to deployment server

### Required Files

Ensure all required files are present:
- `index.html` - Main application
- `mobile.html` - Mobile remote interface
- `config.xml` - Samsung widget configuration
- `widget.info` - Widget display settings
- `app/` - Application assets
- `icon/` - Application icons

## Samsung Smart TV Deployment

### Step 1: Install Samsung Smart TV SDK

1. Download the Samsung Smart TV SDK from [Samsung Developer Portal](https://developer.samsung.com/smarttv)
2. Install the SDK following Samsung's instructions
3. Configure the SDK with your developer account

### Step 2: Prepare the Application

1. **Update Version Number**

   Edit `config.xml`:
   ```xml
   <ver>1.0</ver>
   ```
   
   Increment version for each release.

2. **Update Widget Information**

   Edit `config.xml` metadata:
   ```xml
   <widgetname>Vifi</widgetname>
   <description>Stream movies!</description>
   <cpname>Vifi</cpname>
   ```

3. **Verify Icon Files**

   Ensure all icons are present in `icon/` directory:
   - `logo.png` - Main application icon

4. **Check Display Settings**

   Edit `widget.info` if needed:
   ```
   Screen Resolution = 1280x720
   Use Alpha Blending? = Yes
   ```

### Step 3: Package the Application

Using Samsung Smart TV SDK:

1. **Create Widget Package**
   ```bash
   # In Samsung SDK
   Project → Package Application
   ```

2. **Output Format**
   - Creates a `.wgt` file (widget package)
   - Includes all application files
   - Signed with your developer certificate

3. **Verify Package**
   - Check package size (should be < 50MB)
   - Verify all assets are included
   - Test on emulator first

### Step 4: Deploy to Samsung TV

#### Option A: Developer Mode (Testing)

1. **Enable Developer Mode on TV**
   - Go to TV Settings → About
   - Enter developer mode code
   - Restart TV

2. **Configure TV IP**
   - Note the TV's IP address
   - Configure in SDK

3. **Upload Widget**
   ```bash
   # In Samsung SDK
   Run → Run on Device
   Select TV → Upload
   ```

4. **Test on TV**
   - Widget appears in Apps
   - Launch and test functionality

#### Option B: Samsung Apps Store (Production)

1. **Register as Seller**
   - Complete Samsung Seller Office registration
   - Agree to terms and conditions
   - Provide tax information

2. **Submit Application**
   - Upload `.wgt` file
   - Provide app metadata
   - Upload screenshots
   - Submit for review

3. **Review Process**
   - Samsung reviews app (1-2 weeks)
   - Address any issues
   - Approval notification

4. **Publication**
   - Set release date
   - Choose regions
   - Publish to store

### Step 5: Post-Deployment Verification

Test the deployed application:
- [ ] Launch application
- [ ] User login works
- [ ] Movie browsing works
- [ ] Video playback works
- [ ] Navigation responds to remote
- [ ] No console errors
- [ ] Performance is acceptable

## Web Server Deployment

For browser-based access and mobile remote.

### Step 1: Prepare Web Server

1. **Choose Web Server**
   - Apache
   - Nginx
   - Node.js + Express
   - Python SimpleHTTPServer (development only)

2. **Configure Server**

   **Apache (.htaccess)**
   ```apache
   # Enable CORS if needed
   Header set Access-Control-Allow-Origin "*"
   
   # Enable compression
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
   </IfModule>
   
   # Cache static assets
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType image/png "access plus 1 month"
       ExpiresByType text/css "access plus 1 week"
       ExpiresByType application/javascript "access plus 1 week"
   </IfModule>
   ```

   **Nginx (nginx.conf)**
   ```nginx
   server {
       listen 80;
       server_name smarttv.vifi.ee;
       root /var/www/vifi-smarttv;
       index index.html;
       
       # Gzip compression
       gzip on;
       gzip_types text/css application/javascript;
       
       # Cache static files
       location ~* \.(png|jpg|css|js)$ {
           expires 30d;
           add_header Cache-Control "public, immutable";
       }
       
       # CORS headers (if needed)
       add_header Access-Control-Allow-Origin *;
   }
   ```

### Step 2: Upload Files

1. **Via FTP**
   ```bash
   ftp ftp.yourserver.com
   # Upload entire directory
   ```

2. **Via SSH/SCP**
   ```bash
   scp -r vifi.ee-smarttv-application/ user@server:/var/www/vifi-smarttv/
   ```

3. **Via Git**
   ```bash
   # On server
   cd /var/www
   git clone https://github.com/janiluuk/vifi.ee-smarttv-application.git vifi-smarttv
   ```

### Step 3: Set Permissions

```bash
# On server
cd /var/www/vifi-smarttv
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

### Step 4: Configure DNS

Point your domain to the server:
```
smarttv.vifi.ee → 123.456.789.0
```

### Step 5: Enable HTTPS (Recommended)

Using Let's Encrypt:
```bash
sudo certbot --nginx -d smarttv.vifi.ee
```

### Step 6: Test Deployment

Access the application:
- **Desktop**: https://smarttv.vifi.ee/index.html
- **Mobile Remote**: https://smarttv.vifi.ee/mobile.html

## Configuration

### Environment-Specific Configuration

Edit `app/javascript/vifi/vifi_engine.js`:

```javascript
Vifi.Settings = {
    version: "1.0.0",
    debug: false,  // Set to true for development
    api_url: 'https://backend.vifi.ee/api/',
    api_key: 'YOUR_API_KEY',
    // ... other settings
}
```

### Production Settings

```javascript
debug: false,  // Disable debug logging
api_url: 'https://backend.vifi.ee/api/',  // Use HTTPS
```

### Development Settings

```javascript
debug: true,  // Enable debug logging
api_url: 'http://backend.vifi.ee/api/',  // Can use HTTP
```

## Testing

### Pre-Deployment Testing

1. **Local Testing**
   ```bash
   python3 -m http.server 8000
   # Test at http://localhost:8000
   ```

2. **Browser Testing**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)

3. **Resolution Testing**
   - 1280x720
   - 1920x1080
   - 1920x1200

4. **Functionality Testing**
   - [ ] Application loads
   - [ ] User can login
   - [ ] Movies display
   - [ ] Search works
   - [ ] Video plays
   - [ ] Navigation works

### Post-Deployment Testing

1. **Access from TV**
   - Navigate to URL
   - Test all features
   - Check performance

2. **Mobile Remote Testing**
   - Open mobile.html on phone
   - Test remote controls
   - Verify Pusher connection

3. **API Testing**
   - Verify backend connectivity
   - Check API response times
   - Monitor error rates

## Monitoring

### Application Monitoring

1. **Error Logging**
   - Monitor browser console errors
   - Set up error tracking (e.g., Sentry)

2. **Performance Monitoring**
   - Track page load times
   - Monitor API response times
   - Check video buffering

3. **Usage Analytics**
   - User sessions
   - Popular content
   - Error rates

### Server Monitoring

```bash
# Check server logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Common Issues

#### 1. Application Won't Load on TV

**Symptoms**: Black screen or error message

**Solutions**:
- Check TV internet connection
- Verify Samsung API scripts are accessible
- Check widget.info settings
- Review TV console logs

#### 2. Videos Won't Play

**Symptoms**: Player shows error or infinite loading

**Solutions**:
- Verify video URL is accessible
- Check media player implementation
- Test with different video formats
- Review player console logs

#### 3. API Errors

**Symptoms**: Data not loading, login fails

**Solutions**:
- Check API endpoint URL
- Verify API key
- Test API directly with curl/Postman
- Check CORS settings

#### 4. Remote Control Not Working

**Symptoms**: TV remote buttons don't respond

**Solutions**:
- Verify Samsung TVKeyValue API loaded
- Check key handler configuration
- Test with keyboard in browser
- Review navigation code

#### 5. Layout Issues

**Symptoms**: Content misaligned or cut off

**Solutions**:
- Check resolution detection
- Verify CSS for target resolution
- Test on actual TV resolution
- Review responsive design

### Debug Mode

Enable debug mode for troubleshooting:

```javascript
// In vifi_engine.js
Vifi.Settings = {
    debug: true,  // Enable debugging
    // ...
}
```

This enables:
- Console logging
- Error details
- Performance metrics

## Rollback Procedure

If deployment fails:

1. **Samsung TV**
   - Upload previous .wgt version
   - Or remove widget and reinstall

2. **Web Server**
   ```bash
   # Restore from backup
   cd /var/www
   mv vifi-smarttv vifi-smarttv-failed
   mv vifi-smarttv-backup vifi-smarttv
   ```

3. **Git-based**
   ```bash
   git log  # Find working commit
   git checkout <commit-hash>
   ```

## Update Procedure

For application updates:

1. Test new version thoroughly
2. Backup current version
3. Deploy new version
4. Test in production
5. Monitor for issues
6. Keep backup available for 48 hours

## Support

For deployment issues:
- Email: tugi@vifi.ee
- Include: error logs, TV model, version number
