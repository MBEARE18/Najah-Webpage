# ⚠️ Important: Push Notifications Setup

## ❌ Don't Open HTML Files Directly!

**The error you're seeing happens because you're opening the HTML file directly (file:// protocol).**

Service Workers and Push Notifications **require HTTP/HTTPS** - they don't work with `file://` protocol.

---

## ✅ Correct Way to Access:

### Step 1: Start Your Backend Server

```bash
cd najah-backend
npm start
```

You should see:
```
Server running in development mode on port 5000
```

### Step 2: Access via Browser

**Open your browser and go to:**

- Student Dashboard: `http://localhost:5000/student_dashboard.html`
- Live Classes: `http://localhost:5000/live_classes.html`
- Admin Dashboard: `http://localhost:5000/admin/index.html`

**NOT:** `file:///C:/Users/.../student_dashboard.html` ❌

---

## 🔍 How to Verify Server is Running:

1. Check if server is running:
   ```bash
   # In terminal, you should see server logs
   ```

2. Test server is accessible:
   - Open browser
   - Go to: `http://localhost:5000/api/health`
   - Should see: `{"success":true,"message":"Server is running"}`

3. Check if files are accessible:
   - Go to: `http://localhost:5000/push-notifications.js`
   - Should see the JavaScript code (not 404)
   - Go to: `http://localhost:5000/sw.js`
   - Should see the service worker code (not 404)

---

## 🐛 Troubleshooting:

### Error: "Failed to load resource: net::ERR_FILE_NOT_FOUND"
- **Cause**: Opening file directly or server not running
- **Fix**: Access via `http://localhost:5000/` instead

### Error: "The URL protocol of the current origin ('null') is not supported"
- **Cause**: Opening HTML file directly (file://)
- **Fix**: Access via `http://localhost:5000/` instead

### Error: "Service Worker registration failed"
- **Cause**: Server not running or wrong URL
- **Fix**: 
  1. Make sure server is running
  2. Access via `http://localhost:5000/`
  3. Check browser console for specific error

---

## ✅ Quick Test:

1. Start server: `cd najah-backend && npm start`
2. Open browser: `http://localhost:5000/student_dashboard.html`
3. Open console (F12)
4. You should see: `Service Worker registered: ...`
5. No errors about file:// or ERR_FILE_NOT_FOUND

---

## 📝 Notes:

- **Development**: Use `http://localhost:5000`
- **Production**: Use `https://yourdomain.com`
- **Never**: Use `file:///` for push notifications
- Service Workers require HTTPS in production (localhost works for development)

---

**Remember**: Always access your pages through the server, not by opening HTML files directly!

