# 📦 Warehouse Delivery Tracking App

This project is a **backend service** for managing a warehouse, tracking deliveries, and monitoring product distribution to stores.  
It provides APIs for products, deliveries, stores, and analytics.

---

## 🚀 Features
- Manage products dynamically (scales from 4 to 1000+).
- Track warehouse stock levels in real-time.
- Assign products to delivery trucks daily.
- Track deliveries per store (owner, location, received products).
- Record what each delivery driver sold vs what remains in the truck.
- Generate analytics for sales and stock history.
- Visualize data for insights (best-selling products, trends).

---

## 🏗 Architecture

 .
├──  config
│   └──  database.js
├──  controllers
├──  middlewares
├──  models
├──  package-lock.json
├──  package.json
├──  README.md
├──  routes
├──  server.js
└──  utils


---

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (via Mongoose)  
- **Security**: Helmet, CORS, Cookie-parser  
- **Logging**: Morgan  
- **Environment**: dotenv  

---

## 📊 Future Analytics
- Which products are selling most frequently.
- Sales per store and per delivery driver.
- Warehouse vs. in-truck vs. sold product balances.
- Visualization via charting (e.g., Chart.js, Recharts, D3.js).

---

## 📌 Getting Started

### 1. Clone Repo
```bash
git clone ....
cd warehouse-backend

npm install

npm run dev