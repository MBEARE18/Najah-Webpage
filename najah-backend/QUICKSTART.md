# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally, or MongoDB Atlas connection string

## Setup Steps

1. **Install Dependencies**
   ```bash
   cd najah-backend
   npm install
   ```

2. **Create Environment File**
   Create a `.env` file in the `najah-backend` directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/najah_tutors
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system. If using local MongoDB:
   ```bash
   # On Windows (if MongoDB is installed as a service, it should start automatically)
   # On Mac/Linux
   sudo systemctl start mongod
   # Or
   mongod
   ```

4. **Create Admin User**
   ```bash
   npm run create-admin
   ```
   This creates an admin user with:
   - Email: admin@najah.com
   - Password: admin123

5. **Start the Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

6. **Access Admin Dashboard**
   - Open your browser and go to: `http://localhost:5000/admin/index.html`
   - Login with: admin@najah.com / admin123

## API Testing

Test the API using:
- **Postman**
- **curl**
- **Browser** (for GET requests)

Example API calls:
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@najah.com","password":"admin123"}'

# Get courses (no auth required)
curl http://localhost:5000/api/courses
```

## Next Steps

1. Connect your frontend to the API endpoints
2. Customize the admin dashboard as needed
3. Add more features like file uploads, notifications, etc.
4. Set up proper production environment variables

## Troubleshooting

- **MongoDB Connection Error**: Make sure MongoDB is running and the connection string is correct
- **Port Already in Use**: Change the PORT in .env file
- **Admin User Already Exists**: The script will skip creation if admin exists

