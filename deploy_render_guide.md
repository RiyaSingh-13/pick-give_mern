# Render Deployment Guide: Pick&Give MERN Stack

This guide details the step-by-step process to deploy your **ngo-connect-v2** application on Render.

---

## 🚀 Step 1: Get a MongoDB Atlas Connection String (Database)

If you already have a MongoDB connection string, you can skip this. If not, follow these steps:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Create a new project and build a **Free Cluster (Shared M0)**.
3. In **Database Access**, create a database user with a username and password. (Keep these handy).
4. In **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`) so Render's servers can connect to it.
5. In **Database/Clusters**, click **Connect** -> **Drivers** and copy your connection string. It will look like:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
   *(Replace `<username>` and `<password>` with your database user credentials)*.

---

## 🖥️ Step 2: Deploy the Backend (Web Service)

We will deploy the backend folder as a Render **Web Service**.

1. Log in to [Render](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select your repository: **pick-give_mern** (ngo-connect-v2).
4. Configure the Web Service settings:
   - **Name:** `pick-give-backend` (or any name you prefer)
   - **Environment:** `Node`
   - **Region:** Choose a region close to your target users (e.g., `Singapore` or `Oregon`).
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Advanced** and add the following **Environment Variables**:
   - `MONGODB_URI`: *Your MongoDB connection string from Step 1*
   - `PORT`: `10000` (Render will automatically route traffic here)
6. Click **Create Web Service**. 
7. Once deployed, Render will provide a public URL for your backend (e.g., `https://pick-give-backend.onrender.com`). **Copy this URL.**

---

## 🎨 Step 3: Deploy the Frontend (Static Site)

We will deploy the frontend folder as a Render **Static Site**.

1. On your Render dashboard, click **New +** -> **Static Site**.
2. Select your repository: **pick-give_mern** (ngo-connect-v2).
3. Configure the Static Site settings:
   - **Name:** `pick-give` (or any name you prefer)
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Click **Advanced** and add the following **Environment Variable**:
   - `VITE_API_URL`: *Your Backend Web Service URL from Step 2* (e.g., `https://pick-give-backend.onrender.com`)
5. Click **Create Static Site**.

---

## 🎉 Verification

Once both deployments are complete:
1. Open your Frontend URL (provided by Render).
2. The UI will load and communicate dynamically with your backend Web Service!
