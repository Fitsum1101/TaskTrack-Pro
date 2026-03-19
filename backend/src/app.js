require('dotenv').config();
const cors = require('cors');
const express = require('express');

const routeIndex = require('./index');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

const app = express();

// Trust proxy configuration
app.set('trust proxy', 1);

app.use(
  cors({
    origin: true,
    // origin: function (origin, callback) {
    //   if (!origin) return callback(null, true);

    //   // Allow any Chrome extension origin
    //   if (origin.startsWith("chrome-extension://")) {
    //     return callback(null, true);
    //   }

    //   if (allowedOrigins.includes(origin)) {
    //     return callback(null, true);
    //   } else {
    //     return callback(new Error("Not allowed by CORS"));
    //   }
    // },
    credentials: true,
  })
);

// Base route or test route
app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to the Task_Managment sync API',
    status: 'Success✅',
    server_status: 'Working🆙',
    restart_working: 'true',
    server_time: `${new Date().toLocaleString()} ⌛`,
  });
});

// API Routes
app.use('/api/v1/auth', routeIndex.auth.authRoutes);
// app.use("/api/v1/companies", routeIndex.companies.companyRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
