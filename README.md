# Divya News - दिव्य न्यूज

> **सत्यको साथ, जनताको आवाज** 🇳🇵

A modern, bilingual (Nepali/English) news portal with real-time publishing, MongoDB backend, and Cloudinary media storage.

---

## ✨ Features

- 📰 **Real-time News Publishing** - Admin panel for instant news updates
- 🌍 **Bilingual Support** - Seamless Nepali ↔ English language toggle
- 📅 **Bikram Sambat Calendar** - Automatic B.S. date conversion
- 🔴 **Dynamic Breaking News** - Admin-controlled marquee ticker
- 📖 **Read More** - Expandable news articles with full details
- 🗄️ **MongoDB Database** - Scalable cloud database
- ☁️ **Cloudinary Storage** - Optimized image & video hosting
- 🔐 **Secure Authentication** - JWT-based admin access (max 2 admins)
- 📱 **Fully Responsive** - Mobile-first design
- 🎨 **Modern UI** - Smooth animations and gradients

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/divya-news.git
cd divya-news
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**

Create `backend/.env`:
```env
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
NODE_ENV=development
```

4. **Start the backend server**
```bash
npm run dev
```

5. **Open the frontend**
```bash
# Open in browser:
frontend/index.html
```

---

## 📁 Project Structure

```
Divya_News/
├── frontend/              # Frontend application
│   ├── index.html        # Homepage
│   ├── news.html         # News listing
│   ├── about.html        # About page
│   ├── contact.html      # Contact page
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── admin/            # Admin panel
│   └── assets/           # Images and media
│
└── backend/               # Backend API
    ├── server.js         # Express server
    ├── models/           # MongoDB schemas
    ├── routes/           # API endpoints
    └── middleware/       # Authentication
```

---

## 🔐 Admin Access

### First-time Setup

1. **Register Admin** (max 2 admins allowed)
   - Navigate to: `frontend/admin/register.html`
   - First admin becomes super-admin

2. **Login**
   - Navigate to: `frontend/admin/login.html`
   - Use your credentials

3. **Access Dashboard**
   - Navigate to: `frontend/admin/dashboard.html`
   - Publish news with 3 upload options:
     - File upload
     - Image URL
     - Cloudinary URL

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin (max 2)
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current admin info

### News
- `GET /api/news` - Get all news
- `GET /api/news/featured` - Get featured news
- `GET /api/news/:id` - Get single news
- `POST /api/news` - Create news (protected)
- `PUT /api/news/:id` - Update news (protected)
- `DELETE /api/news/:id` - Delete news (protected)

### Breaking News
- `GET /api/breaking-news` - Get active breaking news
- `POST /api/breaking-news` - Create breaking news (protected)
- `PUT /api/breaking-news/:id` - Update breaking news (protected)
- `DELETE /api/breaking-news/:id` - Delete breaking news (protected)

### Upload
- `POST /api/upload/image` - Upload image to Cloudinary (protected)
- `POST /api/upload/video` - Upload video to Cloudinary (protected)

---

## 🛠️ Technologies

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with CSS Grid & Flexbox
- B.S. calendar integration

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcrypt password hashing

**Cloud Services:**
- MongoDB Atlas (Database)
- Cloudinary (Media storage)
- Vercel (Deployment)

---

## 📄 License

MIT License © 2026 Divya News

---

## 📞 Contact

- 📧 Email: divyanews010@gmail.com
- 📍 Location: Bhairahawa, Nepal
- 📱 Phone: +977-9713251903, +977-9713251957
- 🌐 Facebook: [Divya News](https://www.facebook.com/share/17PP6CAA9P/)
- 📺 YouTube: [@divyanews99](https://www.youtube.com/@divyanews99)
- 🎵 TikTok: [@divyanews](https://www.tiktok.com/@divyanews)

---

**For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**
