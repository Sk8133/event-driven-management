# Render & MongoDB Atlas Setup Guide

## Problem: MongoDB Connection Timeout on Render

When deploying to Render, you may get a connection timeout error like:
```
Error: querySrv ETIMEOUT _mongodb._tcp.event.eh2gszd.mongodb.net
```

This happens because MongoDB Atlas has IP whitelist restrictions.

## Solution: Whitelist Render IPs in MongoDB Atlas

### Option 1: Allow All IPs (Quick but Less Secure)
1. Go to [MongoDB Atlas Console](https://account.mongodb.com/account/login)
2. Select your cluster
3. Click **Network Access** in the left sidebar
4. Click **+ Add IP Address**
5. Enter `0.0.0.0/0` to allow all IPs
6. Click **Confirm**
7. Wait 2-3 minutes for the change to propagate

### Option 2: Allow Only Render's IP Range (More Secure)
1. Go to [MongoDB Atlas Console](https://account.mongodb.com/account/login)
2. Select your cluster
3. Click **Network Access**
4. Click **+ Add IP Address**
5. Enter one of Render's IP ranges:
   - `34.212.0.0/16` (US West)
   - `54.183.0.0/16` (US West)
   - Or check [Render's IP ranges](https://render.com/docs/static-outbound-ip)
6. Click **Confirm**

## Render Environment Variables

Set these environment variables in your Render service:

1. Go to your Render service dashboard
2. Click **Environment**
3. Add the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/dbname?appName=event
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SENDGRID_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=your_verified_sender_email@gmail.com
```

**Note:** Uses SendGrid SMTP which is highly reliable on cloud platforms like Render. Get your API key from SendGrid dashboard.

4. Click **Save**
5. Render will automatically restart your service

## Verify Connection

After setting up, check the Render logs:
```
MongoDB connected: cluster0-shard-00-01.xxxxx.mongodb.net
Server running on http://localhost:5000
```

## Troubleshooting

- **Still timing out?** Wait 5-10 minutes after adding IP addresses - DNS propagation takes time
- **Connection refused?** Check your `MONGO_URI` is correct and database user has correct password
- **Check Render logs** for detailed error messages during startup
