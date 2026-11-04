require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { sequelize, initializeDatabase } = require('./config/db');

// import models to register schemas
require('./models');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// health check for the setup screen
app.get('/api/health', async (req, res) => {
  let database = 'down';
  try {
    await sequelize.authenticate();
    database = 'up';
  } catch (err) {
    console.error('health check db error:', err.message);
  }
  res.json({ status: 'ok', database, time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'route not found: ' + req.method + ' ' + req.originalUrl });
});

// express knows this is an error handler because of the 4 arguments
app.use((err, req, res, next) => {
  console.error('unhandled error:', err);
  res.status(500).json({ message: 'something went wrong on the server' });
});

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();
  } catch (err) {
    const code = (err.original && err.original.code) || err.code;
    console.error('database connection failed:', code || err.message);

    if (code === 'ER_BAD_DB_ERROR') {
      console.error("database does not exist yet, run this once: CREATE DATABASE stockflow;");
    } else if (code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('wrong DB_USER or DB_PASSWORD in backend/.env');
    } else if (code === 'ECONNREFUSED') {
      console.error('mysql is not running, start it in xampp control panel');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('stockflow api running on http://localhost:' + PORT);
  });
};

startServer();
