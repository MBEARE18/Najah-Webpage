# ✅ Push Notifications - Testing Guide

## 🎉 Service Worker is Registered!

You're seeing:
```
Service Worker registered: ServiceWorkerRegistration {...}
```

This means everything is set up correctly! ✅

---

## 🧪 Test Push Notifications

### Step 1: Subscribe to Push Notifications

Open browser console (F12) and run:

```javascript
await pushNotificationService.subscribe()
```

**What will happen:**
1. Browser will ask for notification permission → Click **"Allow"**
2. You should see: `Successfully subscribed to push notifications`
3. A notification will appear: "Push Notifications Enabled"

### Step 2: Check Subscription Status

```javascript
await pushNotificationService.isSubscribed()
// Should return: true
```

### Step 3: Send Test Notification

```javascript
await pushNotificationService.sendTestNotification()
```

**What will happen:**
- You'll receive notifications via:
  - ✅ Email (if configured)
  - ✅ Push notification (browser notification)
  - ⚠️ WhatsApp (if Twilio configured)

---

## 🔔 Automatic Notifications

Once subscribed, you'll automatically receive push notifications when:

1. **Admin creates a live class** → All enrolled students get notified
2. **You enroll in a class** → You get a welcome notification
3. **Class is cancelled** → You get a cancellation notification

---

## 🎛️ Manage Preferences

### Check current preferences:
```javascript
// This will be available after user preferences are loaded
```

### Update preferences:
```javascript
await pushNotificationService.updatePreferences({
  email: true,      // Receive email notifications
  whatsapp: true,   // Receive WhatsApp notifications (if configured)
  push: true        // Receive push notifications
})
```

---

## 🐛 Troubleshooting

### "Push notifications not configured"
- **Fix**: Add VAPID keys to `.env` file and restart server
- See: `VAPID_KEYS_SETUP.txt`

### "Notification permission denied"
- **Fix**: 
  1. Click the lock icon in browser address bar
  2. Change notifications to "Allow"
  3. Or go to: Browser Settings → Site Settings → Notifications

### "Failed to subscribe"
- **Fix**: 
  1. Make sure you're logged in (authToken in localStorage)
  2. Check browser console for specific error
  3. Verify server is running

---

## ✅ Success Checklist

- [x] Service Worker registered
- [ ] Push subscription successful
- [ ] Test notification received
- [ ] Browser notification permission granted
- [ ] VAPID keys added to `.env` (for production)

---

## 🚀 Next Steps

1. **Add VAPID keys to `.env`** (if not done):
   ```env
   VAPID_PUBLIC_KEY=your-public-key
   VAPID_PRIVATE_KEY=your-private-key
   VAPID_SUBJECT=mailto:noreply@najahtutors.com
   ```

2. **Restart server** after adding keys

3. **Test with real class**:
   - Admin creates a live class
   - Student enrolls
   - Check for notifications

---

**Note**: The Tailwind CSS CDN warning is just a recommendation for production. It doesn't affect functionality. You can ignore it for now or set up Tailwind properly later.

