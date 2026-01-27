# 🚀 Vercel Deployment Guide

Follow these steps to deploy your application as three separate projects (Backend, Frontend, Admin).

---

## 1️⃣ Deploy the Backend (DO THIS FIRST)
**Why?** You need the Backend URL to configure the Frontend and Admin.

1. **In Vercel**: Import your repository.
2. **Root Directory**: Select `Backend` and click **Continue**.
3. **Build Settings**: Leave as default.
4. **Environment Variables**:
   You need to copy these from your `Backend/.env` file, **BUT** you must use a real MongoDB URL (not localhost).

   | Variable Name | Value |
   |--------------|-------|
   | `MONGODB_URI` | 🔴 **MUST BE A CLOUD URL** (e.g., from MongoDB Atlas). `mongodb://localhost...` WILL NOT WORK. |
   | `JWT_SECRET` | `supersecretkeylearning` (or generate a new one) |
   | `JWT_EXPIRES_IN` | `90d` |
   | `CLOUDINARY_CLOUD_NAME` | `dttb9lvfl` |
   | `CLOUDINARY_API_KEY` | `168275564519655` |
   | `CLOUDINARY_API_SECRET` | `ZY6CLwCK64k7C7xcxeH0rdpMIiA` |
   | `GOOGLE_CLIENT_ID` | `<YOUR_GOOGLE_CLIENT_ID_FROM_ENV>` |
   | `GOOGLE_CLIENT_SECRET` | `<YOUR_GOOGLE_CLIENT_SECRET_FROM_ENV>` |

5. Click **Deploy**.
6. **SUCCESS?** Copy the deployment URL (e.g., `https://glam-icon-backend.vercel.app`).

---

## 2️⃣ Deploy the Frontend
1. Go to Vercel Dashboard -> **Add New Project**.
2. Select the **SAME** repository again.
3. **Root Directory**: Select `Frontend` and click **Continue**.
4. **Environment Variables**:

   | Variable Name | Value |
   |--------------|-------|
   | `VITE_API_URL` | The Backend URL from Step 1 (e.g., `https://...vercel.app`) ❌ **NO TRAILING SLASH** |
   | `VITE_GOOGLE_CLIENT_ID` | `<YOUR_GOOGLE_CLIENT_ID_FROM_ENV>` |

5. Click **Deploy**.

---

## 3️⃣ Deploy the Admin Panel
1. Go to Vercel Dashboard -> **Add New Project**.
2. Select the **SAME** repository again.
3. **Root Directory**: Select `Admin` and click **Continue**.
4. **Environment Variables**:

   | Variable Name | Value |
   |--------------|-------|
   | `VITE_API_URL` | The Backend URL from Step 1 |

5. Click **Deploy**.
