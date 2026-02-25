# ☁️ Cloudflare Deployment Guide (Full Stack)

This guide explains how to deploy the **Glam Icon India** project using Cloudflare's ecosystem for maximum performance, security, and scalability.

---

## 🛠 Project Architecture for Cloudflare
*   **Frontend**: Cloudflare Pages (Static + Fast Global CDN)
*   **Admin Panel**: Cloudflare Pages (Static + Fast Global CDN)
*   **Backend**: Cloudflare Proxy + [Render/Vercel/DigitalOcean] (Standard Node.js)
*   **Domain & DNS**: Cloudflare Registrar/DNS
*   **Load Balancing**: Cloudflare Traffic Management

---

## 1️⃣ Deploy Frontend & Admin (Cloudflare Pages)

Cloudflare Pages is the best place for Vite projects.

### Step-by-Step:
1.  Push your code to **GitHub**.
2.  Open [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages**.
3.  Click **Create application** -> **Pages** -> **Connect to Git**.
4.  **For Frontend**:
    *   **Project Name**: `glam-icon-frontend`
    *   **Root Directory**: `/Frontend`
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
    *   **Environment Variables**:
        *   `VITE_API_URL`: `https://api.yourdomain.com` (Your backend URL)
5.  **For Admin**:
    *   Repeat steps, but set **Root Directory** to `/Admin/vite-project`.
    *   **Project Name**: `glam-icon-admin`

---

## 2️⃣ Deploy the Backend (Standard Node.js)

Cloudflare Workers (the "native" serverless) has limited support for Node.js modules like `sharp`, `exceljs`, and `multer`. 

**Option A: Proxy via Cloudflare (Recommended)**
1.  Deploy your `Backend` folder to **Render.com** or **Railway.app** (Simple) or a **VPS** (Advanced).
2.  Once deployed (e.g., `glam-backend.onrender.com`), go to Cloudflare **DNS**.
3.  Add a `CNAME` record:
    *   **Type**: `CNAME`
    *   **Name**: `api` (Result: `api.yourdomain.com`)
    *   **Target**: `glam-backend.onrender.com`
    *   **Proxy Status**: 🟠 **Proxied** (This enables Cloudflare security).

---

## 3️⃣ Adding Your Domain

1.  In Cloudflare Dashboard, click **Add a Site**.
2.  Enter your domain (e.g., `glamiconindia.com`).
3.  Cloudflare will give you two **Nameservers** (e.g., `nicole.ns.cloudflare.com`).
4.  Go to your domain registrar (Hostinger, GoDaddy, etc.) and replace their nameservers with Cloudflare's.
5.  Wait 5-30 mins for propagation.

---

## 4️⃣ Load Balancing (High Availability)

> 💡 **Note**: Cloudflare Load Balancing is a paid add-on ($5+/mo). It is used to distribute traffic between multiple backend servers.

### How to set it up:
1.  **Traffic** -> **Load Balancing** -> **Create Load Balancer**.
2.  **Hostname**: `api.yourdomain.com`.
3.  **Origin Pools**:
    *   Create a pool (e.g., "Primary-Servers").
    *   Add your backend origins (e.g., Server 1 IP, Server 2 IP).
4.  **Health Checks**:
    *   Configure a monitor to ping `/api/health` or `/` every 60 seconds.
    *   If one server goes down, Cloudflare automatically routes traffic to the healthy one.
5.  **Traffic Steering**: Choose "Proximity" or "Random".

---

## 5️⃣ Cloudflare SSL/TLS & Security

1.  Go to **SSL/TLS** -> **Overview**.
2.  Set mode to **Full (Strict)**.
3.  Go to **Security** -> **WAF**.
4.  Enable "Cloudflare Managed Ruleset" to block SQL injection and common attacks.

---

## 🏁 Final Configuration Checklist
- [ ] Backend is live and `MONGODB_URI` is connected.
- [ ] `VITE_API_URL` in Cloudflare Pages points to `https://api.yourdomain.com`.
- [ ] DNS records for `www`, `admin`, and `api` are set to 🟠 **Proxied**.
- [ ] CORS in `Backend/server.js` allows your Cloudflare Pages URLs.
