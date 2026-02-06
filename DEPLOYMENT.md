# 🚀 Deployment Guide - Divya News

Complete step-by-step guide to deploy Divya News to Vercel and make it production-ready for public use.

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Vercel account created (free tier works)
- [ ] MongoDB Atlas account set up
- [ ] Cloudinary account configured
- [ ] All local tests passing

---

## 🔧 Step 1: Prepare MongoDB Atlas

### 1.1 Create Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 Sandbox)
3. Database name: `divya-news`
4. Collections will be auto-created: `news`, `admins`, `breakingnews`

### 1.2 Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
3. This allows Vercel to connect

### 1.3 Create Database User
1. Go to **Database Access** → **Add New Database User**
2. Username: `divyanews24` (or your choice)
3. Password: Create a strong password
4. Database User Privileges: **Read and write to any database**

### 1.4 Get Connection String
1. Click **Connect** → **Connect your application**
2. Copy the connection string
3. Replace `<password>` with your actual password
4. Example: `mongodb+srv://divyanews24:PASSWORD@cluster.mongodb.net/divya-news?retryWrites=true&w=majority`

---

## ☁️ Step 2: Configure Cloudinary

### 2.1 Create Account
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account

### 2.2 Get Credentials
1. Go to **Dashboard**
2. Copy these values:
   - Cloud Name
   - API Key
   - API Secret

---

## 📦 Step 3: Push to GitHub

### 3.1 Initialize Git (if not done)
```bash
cd d:\Divya_News
git init
```

### 3.2 Create .gitignore (already created)
Verify `.gitignore` excludes:
- `node_modules/`
- `.env`
- `.vercel/`

### 3.3 Commit All Files
```bash
git add .
git commit -m "Initial commit - Production ready Divya News"
```

### 3.4 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click **New Repository**
3. Name: `divya-news`
4. Visibility: Public or Private
5. **DO NOT** initialize with README (we already have one)
6. Click **Create Repository**

### 3.5 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/divya-news.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 4: Deploy to Vercel

### 4.1 Import Project
1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click **Add New** → **Project**
4. Import your `divya-news` repository

### 4.2 Configure Project
- **Framework Preset**: Other
- **Root Directory**: `./` (leave as is)
- **Build Command**: Leave empty
- **Output Directory**: Leave empty
- **Install Command**: `cd backend && npm install`

### 4.3 Add Environment Variables

Click **Environment Variables** and add these:

| Name | Value | Notes |
|------|-------|-------|
| `MONGODB_URI` | Your MongoDB connection string | From Step 1.4 |
| `JWT_SECRET` | Random 32+ character string | Generate with: `openssl rand -hex 32` |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | From Step 2.2 |
| `CLOUDINARY_API_KEY` | Your API key | From Step 2.2 |
| `CLOUDINARY_API_SECRET` | Your API secret | From Step 2.2 |
| `NODE_ENV` | `production` | Exactly as shown |
| `FRONTEND_URL` | Leave empty for now | Will update after deployment |

**Important**: Add these to **Production**, **Preview**, and **Development** environments.

### 4.4 Deploy
1. Click **Deploy**
2. Wait 2-3 minutes for deployment
3. You'll get two URLs:
   - **Backend**: `https://divya-news-xxx.vercel.app`
   - **Frontend**: Same URL (both served together)

---

## 🔄 Step 5: Update Production URLs

### 5.1 Update Frontend API Configuration

1. **Edit** `frontend/js/config.js`:
```javascript
production: {
    baseURL: 'https://YOUR-ACTUAL-VERCEL-URL.vercel.app/api'
}
```

Replace `YOUR-ACTUAL-VERCEL-URL` with your Vercel deployment URL.

### 5.2 Update Backend CORS

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Edit `FRONTEND_URL`:
   - Value: `https://YOUR-ACTUAL-VERCEL-URL.vercel.app`

### 5.3 Commit and Redeploy
```bash
git add frontend/js/config.js
git commit -m "Update production API URL"
git push
```

Vercel will automatically redeploy.

---

## ✅ Step 6: Verify Deployment

### 6.1 Test Backend API
Visit: `https://YOUR-URL.vercel.app/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "Divya News API is running",
  "timestamp": "2026-02-05T..."
}
```

### 6.2 Test Frontend
1. Visit: `https://YOUR-URL.vercel.app`
2. Homepage should load
3. Open browser console (F12)
4. Should see: `🌐 Environment: production`
5. Should see: `🔗 API URL: https://YOUR-URL.vercel.app/api`

### 6.3 Register First Admin
1. Visit: `https://YOUR-URL.vercel.app/admin/register.html`
2. Fill in details:
   - Username
   - Email
   - Password (strong password)
3. Click **Register**
4. First admin becomes super-admin

### 6.4 Login and Publish
1. Visit: `https://YOUR-URL.vercel.app/admin/login.html`
2. Login with credentials
3. You'll be redirected to dashboard
4. Publish a test news article
5. Visit homepage to verify it appears

---

## 🔒 Step 7: Security Hardening

### 7.1 Secure JWT Secret
- Use a strong, random 32+ character string
- Never commit to Git
- Rotate periodically

### 7.2 Strong Admin Passwords
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't share credentials

### 7.3 MongoDB Security
- ✅ IP whitelist configured (0.0.0.0/0 for Vercel)
- ✅ Strong database user password
- ✅ Connection string in environment variables only

### 7.4 Cloudinary Security
- ✅ API credentials in environment variables
- ✅ Upload signing enabled
- ✅ Folder organization for assets

### 7.5 CORS Configuration
- Backend automatically allows your frontend URL
- No wildcard (*) in production

---

## 🎯 Step 8: Custom Domain (Optional)

### 8.1 Add Domain in Vercel
1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **Add**
3. Enter your domain: `divyanews.com`

### 8.2 Configure DNS
Add these records at your domain registrar:

**For root domain (divyanews.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

### 8.3 Wait for DNS Propagation
- Usually takes 5-30 minutes
- Check status in Vercel dashboard
- SSL certificate auto-generated

### 8.4 Update URLs
After domain is active:
1. Update `frontend/js/config.js` with your domain
2. Update `FRONTEND_URL` in Vercel environment variables
3. Redeploy

---

## 📊 Step 9: Monitoring & Maintenance

### 9.1 Vercel Analytics
- Go to **Analytics** tab in Vercel
- Monitor traffic, performance, errors

### 9.2 MongoDB Metrics
- MongoDB Atlas → **Metrics**
- Monitor connections, operations, storage

### 9.3 Cloudinary Usage
- Cloudinary Dashboard → **Usage**
- Track bandwidth, transformations, storage

### 9.4 Regular Backups
- MongoDB Atlas has automatic backups
- Download important data periodically

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" errors

**Solution:**
1. Check `frontend/js/config.js` has correct production URL
2. Verify `FRONTEND_URL` in Vercel environment variables
3. Check browser console for CORS errors
4. Redeploy after changes

### Issue: MongoDB connection timeout

**Solution:**
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string in Vercel environment variables
3. Ensure password doesn't have special characters (URL encode if needed)
4. Test connection string locally first

### Issue: Images not uploading

**Solution:**
1. Verify Cloudinary credentials in Vercel
2. Check Cloudinary dashboard for errors
3. Ensure file size under limits (10MB for free tier)
4. Check browser console for upload errors

### Issue: Admin registration not working

**Solution:**
1. Check if 2 admins already registered (limit reached)
2. Verify MongoDB connection
3. Check backend logs in Vercel
4. Ensure JWT_SECRET is set

### Issue: Breaking news not showing

**Solution:**
1. Verify breaking news is marked as "active" in admin panel
2. Check API endpoint: `/api/breaking-news`
3. Clear browser cache
4. Check browser console for errors

---

## 📈 Performance Optimization

### Frontend
- ✅ Images lazy-loaded
- ✅ Minified CSS/JS (Vercel auto-optimizes)
- ✅ Cloudinary auto-optimizes images
- ✅ Responsive images with srcset

### Backend
- ✅ MongoDB indexes on frequently queried fields
- ✅ Pagination for news listing
- ✅ Caching headers set
- ✅ Serverless functions auto-scale

---

## 🎉 Going Live Checklist

- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Production URLs updated
- [ ] MongoDB Atlas connected
- [ ] Cloudinary configured
- [ ] First admin registered
- [ ] Test news published
- [ ] Breaking news tested
- [ ] All pages loading correctly
- [ ] Mobile responsiveness verified
- [ ] Language toggle working
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics set up
- [ ] Backup strategy in place

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Check browser console (F12)
4. Review this guide again
5. Contact: divyanews010@gmail.com

---

## 🚀 You're Live!

Congratulations! Your Divya News website is now:
- ✅ Deployed to Vercel
- ✅ Connected to MongoDB
- ✅ Using Cloudinary for media
- ✅ Secure and production-ready
- ✅ Accessible to the public

**Share your URL and start publishing news!** 🎊

---

**सत्यको साथ, जनताको आवाज** 🇳🇵
