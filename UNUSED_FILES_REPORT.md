# Unused Files Report

## Summary
This report identifies files that are not actively being used in the current implementation of the Najah project.

---

## 🔴 Potentially Unused Files

### 1. **`najah-backend/models/Course.js`** ⚠️ PARTIALLY UNUSED
- **Status**: Model exists and is referenced, but **no actual Course records are being created**
- **Used in**:
  - `adminController.js` - Only for counting courses in stats (line 14-15)
  - `enrollmentController.js` - References Course but enrollments use MarketingEnrollment instead
  - `liveClassController.js` - Course is optional (required: false) in LiveClass model
- **Issue**: 
  - Frontend uses `/api/public/enroll` which creates MarketingEnrollment, not Enrollment with Course
  - LiveClass model has `course` field as optional and system works without it
  - No frontend calls `/api/courses` endpoints
  - Admin dashboard doesn't create/manage Course records

### 2. **`najah-backend/controllers/courseController.js`** ⚠️ UNUSED
- **Status**: Controller exists but **never called from frontend**
- **Routes**: `/api/courses` (GET, POST, PUT, DELETE)
- **Issue**: 
  - No references in `admin.js` or `live_classes.html`
  - Routes are registered in `server.js` but never accessed
  - Admin dashboard doesn't have Course management UI

### 3. **`najah-backend/routes/courses.js`** ⚠️ UNUSED
- **Status**: Route file exists but endpoints are **never called**
- **Issue**: Registered in `server.js` but no frontend makes requests to `/api/courses`

### 4. **`tmp.txt`** ❌ TEMPORARY FILE
- **Status**: Temporary file, can be deleted
- **Location**: Root directory
- **Content**: Just contains "tmp"

---

## ✅ Files That ARE Being Used

### Models
- ✅ `User.js` - Used extensively (students, teachers, admin)
- ✅ `Subject.js` - Used for subject management
- ✅ `LiveClass.js` - Used for live class management
- ✅ `Enrollment.js` - Referenced but may have no actual records (uses MarketingEnrollment instead)
- ✅ `MarketingEnrollment.js` - Used for public enrollments

### Controllers
- ✅ `adminController.js` - Used for admin dashboard
- ✅ `authController.js` - Used for authentication
- ✅ `studentController.js` - Used for student management
- ✅ `subjectController.js` - Used for subject management
- ✅ `liveClassController.js` - Used for live class management
- ✅ `enrollmentController.js` - Called from admin but may return empty results
- ✅ `marketingEnrollmentController.js` - Used for public enrollments

### Routes
- ✅ All routes except `courses.js` are actively used

### Utilities
- ✅ `emailService.js` - Used in authController and marketingEnrollmentController

---

## 📋 Recommendations

### Safe to Remove:
1. **`tmp.txt`** - Temporary file, safe to delete

### Consider Removing (After Verification):
1. **`najah-backend/controllers/courseController.js`** - If Course management is not needed
2. **`najah-backend/routes/courses.js`** - If Course management is not needed
3. **`najah-backend/models/Course.js`** - Only if you're sure Course model won't be needed

### Keep But Review:
1. **`najah-backend/models/Course.js`** - Keep if you plan to use Course-based enrollments in future
2. **`najah-backend/controllers/enrollmentController.js`** - Keep if regular enrollments (with Course) will be used

---

## 🔍 Verification Steps

Before removing Course-related files, verify:
1. Check database for any Course records: `db.courses.find()`
2. Check database for Enrollment records that reference Course: `db.enrollments.find({ course: { $exists: true } })`
3. If both are empty, Course model/controller/routes can be safely removed

---

## Notes

- The system currently uses **MarketingEnrollment** for all enrollments from the frontend
- **LiveClass** works independently without Course (course field is optional)
- Admin dashboard shows Course count in stats, but no Course management UI exists
- Enrollment model references Course, but actual enrollments use MarketingEnrollment

