# Complete Deployment Guide: Node.js + React + MongoDB + Nginx + PM2

## **Prerequisites**
- Ubuntu/Debian server with root access
- Server IP: `YOUR_SERVER_IP`
- Backend port: `3002`
- Frontend: React build served by Nginx
- Database: MongoDB

---

## **1. Install Dependencies**

```bash
# Update system
sudo apt update

# Install Node.js, npm, Nginx, MongoDB
sudo apt install -y nodejs npm nginx mongodb

# Install PM2 globally
sudo npm install -g pm2
```

---

## **2. Start & Enable MongoDB**

```bash
# Start MongoDB
sudo systemctl start mongodb

# Enable auto-start on boot
sudo systemctl enable mongodb

# Check status
sudo systemctl status mongodb
```

---

## **3. Install Project Dependencies**

```bash
# Backend dependencies
cd /path/to/Final_Product/server
npm install

# Frontend dependencies
cd ../frontend
npm install
```

---

## **4. Environment Configuration**

### **Backend Environment (`server/.env`)**
```env
PORT=3002
HOST=0.0.0.0
MONGODB_URI=mongodb://localhost:27017/your_database_name
# Add other backend environment variables
```

### **Frontend Environment (`frontend/.env`)**
```env
REACT_APP_API_URL=/api
# Add other frontend environment variables
```

---

## **5. Code Updates**

### **Backend Listen Address (`server/index.js`)**
```javascript
app.listen(3002, '0.0.0.0', () => {
  console.log('Server running on port 3002');
});
```

### **Frontend API URLs**
- Search all files in `frontend/src/` for hardcoded API URLs
- Replace `http://localhost:3002` or `127.0.0.1:3002` with `/api`
- Example:
  ```javascript
  // Before
  fetch('http://localhost:3002/api/users')
  
  // After
  fetch('/api/users')
  // or
  fetch(`${process.env.REACT_APP_API_URL}/users`)
  ```

---

## **6. Build Frontend**

```bash
cd /path/to/Final_Product/frontend
npm run build
```

---

## **7. Start Backend with PM2**

```bash
cd /path/to/Final_Product/server
pm2 start index.js --name final-product-backend
pm2 save
pm2 startup
# Follow the instructions printed by pm2 startup
pm2 save
```

---

## **8. Configure Nginx**

### **Create Nginx Config**
```bash
sudo nano /etc/nginx/sites-available/final_product
```

### **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;

    root /path/to/Final_Product/frontend/build;
    index index.html index.htm;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **Enable Nginx Config**
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/final_product /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Remove default config (optional)
sudo rm /etc/nginx/sites-enabled/default

# Reload Nginx
sudo systemctl reload nginx

# Enable auto-start
sudo systemctl enable nginx
```

---

## **9. Configure Firewall**

```bash
# Allow HTTP traffic
sudo ufw allow 80

# Allow SSH (if not already allowed)
sudo ufw allow 22

# Enable firewall (if not enabled)
sudo ufw enable
```

---

## **10. Test Deployment**

### **Check All Services**
```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check MongoDB status
sudo systemctl status mongodb

# Check ports
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3002
sudo netstat -tlnp | grep :27017
```

### **Access Application**
- **Local Network:** `http://YOUR_SERVER_IP`
- **Public Network:** `http://YOUR_PUBLIC_IP` (if public IP available)

---

## **11. Monitoring & Logs**

### **View Logs**
```bash
# Backend logs
pm2 logs final-product-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongodb.log
```

### **Restart Services**
```bash
# Restart backend
pm2 restart final-product-backend

# Restart Nginx
sudo systemctl restart nginx

# Restart MongoDB
sudo systemctl restart mongodb
```

---

## **12. File Structure Summary**

```
Final_Product/
├── server/
│   ├── index.js          # Backend entry point
│   ├── .env              # Backend environment variables
│   └── package.json
├── frontend/
│   ├── build/            # Built React app (served by Nginx)
│   ├── .env              # Frontend environment variables
│   └── package.json
└── nginx config: /etc/nginx/sites-available/final_product
```

---

## **13. Complete Status Check**

| Service | Port | Status | Auto-start |
|---------|------|--------|------------|
| **Backend (PM2)** | 3002 | ✅ Running | ✅ Enabled |
| **Frontend (Nginx)** | 80 | ✅ Running | ✅ Enabled |
| **MongoDB** | 27017 | ✅ Running | ✅ Enabled |
| **Firewall** | 80, 22 | ✅ Open | ✅ Enabled |

---

## **14. Troubleshooting**

### **Common Issues**
1. **Port already in use:** `sudo lsof -i :3002` or `sudo lsof -i :80`
2. **Permission denied:** Check file permissions and ownership
3. **MongoDB connection failed:** Check MongoDB status and connection string
4. **Nginx 502 error:** Check if backend is running on port 3002

### **Reset Everything**
```bash
# Stop all services
pm2 stop all
pm2 delete all
sudo systemctl stop nginx
sudo systemctl stop mongodb

# Then follow the guide from step 1
```

---

## **✅ Deployment Complete!**

Your application is now:
- ✅ **24/7 accessible** via `http://YOUR_SERVER_IP`
- ✅ **Auto-restart** on server reboot
- ✅ **Scalable** with PM2 process management
- ✅ **Secure** with Nginx reverse proxy
- ✅ **Monitored** with comprehensive logging

**Access your application at: `http://YOUR_SERVER_IP`**
