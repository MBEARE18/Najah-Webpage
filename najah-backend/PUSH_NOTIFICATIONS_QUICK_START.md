# Push Notifications - Quick Start Guide

## ✅ Step 1: Add VAPID Keys to .env

Add these lines to your `najah-backend/.env` file:

```env
VAPID_PUBLIC_KEY=BANIrSJ8XUjYJZiXa4X1TLPZ68pAblrQ0QRTf6k0OFkAzz__kF3NiwleSZr5oukKNBnJW-KSf3dGM7bBxG1en9Y
VAPID_PRIVATE_KEY=3RPrrJY4bbzaVYRGLunLUEARXpWq4EHCWPqwMvtF_rg
VAPID_SUBJECT=mailto:noreply@najahtutors.com
```

**Important:** Replace `mailto:noreply@najahtutors.com` with your actual email or website URL.

---

## ✅ Step 2: Install Dependencies

```bash
cd najah-backend
npm install
```

This will install `web-push` package.

---

## ✅ Step 3: Restart Your Server

After adding the VAPID keys to `.env`, restart your backend server:

```bash
npm start
# or
npm run dev
```

---

## ✅ Step 4: Test Push Notifications

### Option A: Test from Student Dashboard

1. Open `http://localhost:5000/student_dashboard.html` (or your student dashboard URL)
2. Log in as a student
3. Open browser console (F12)
4. Run this command:
   ```javascript
   pushNotificationService.subscribe()
   ```
5. When prompted, click "Allow" to enable notifications
6. You should see: "Successfully subscribed to push notifications"

### Option B: Test via API

1. Log in as a student and get your auth token
2. Send a test notification:
   ```bash
   POST http://localhost:5000/api/notifications/test
   Authorization: Bearer <your-token>
   ```

---

## ✅ Step 5: Verify It Works

### Check Subscription Status:
```javascript
// In browser console
await pushNotificationService.isSubscribed()
// Should return: true
```

### Send Test Notification:
```javascript
// In browser console
await pushNotificationService.sendTestNotification()
```

You should receive a push notification!

---

## 🔧 Troubleshooting

### Service Worker Not Registering
- **Issue**: Service worker fails to register
- **Solution**: 
  - Make sure you're accessing via `http://localhost` (not `file://`)
  - Check browser console for errors
  - Ensure `sw.js` file is accessible at `/sw.js`

### Push Notifications Not Working
- **Issue**: No notifications received
- **Solution**:
  - Check browser notification permissions (Settings → Notifications)
  - Verify VAPID keys are correct in `.env`
  - Check server logs for errors
  - Ensure HTTPS in production (localhost works for development)

### "Push notifications not configured"
- **Issue**: API returns this error
- **Solution**:
  - Verify VAPID keys are in `.env` file
  - Restart server after adding keys
  - Check `.env` file syntax (no quotes, no spaces)

---

## 📱 Browser Support

Push notifications work in:
- ✅ Chrome/Edge (Windows, Mac, Android)
- ✅ Firefox (Windows, Mac, Android)
- ✅ Safari (Mac, iOS 16.4+)
- ❌ Internet Explorer (not supported)

---

## 🎯 Next Steps

Once push notifications are working:

1. **Automatic Notifications**: They'll be sent automatically when:
   - A live class is created
   - A student enrolls in a class
   - A class is cancelled

2. **Manual Notifications**: Admin can send notifications via:
   ```
   POST /api/notifications/class/:classId
   ```

3. **User Preferences**: Students can manage preferences via:
   ```javascript
   await pushNotificationService.updatePreferences({
     email: true,
     whatsapp: true,
     push: true
   })
   ```

---

## 🔐 Security Notes

- VAPID keys are safe to expose (public key is sent to browser)
- Private key must stay secret (never commit to git)
- Use HTTPS in production for security

---

## ✅ Checklist

- [ ] VAPID keys added to `.env`
- [ ] Dependencies installed (`npm install`)
- [ ] Server restarted
- [ ] Service worker registered (check browser console)
- [ ] Push subscription successful
- [ ] Test notification received

---

**Need Help?** Check `NOTIFICATION_SETUP.md` for detailed documentation.

