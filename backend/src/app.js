require("dotenv").config();
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const routeIndex = require("./index");
const { errorHandler, notFoundHandler } = require("./utils/errorHandler");

const app = express();

// Trust proxy configuration
app.set("trust proxy", 1);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 20000,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// ===== 🌐 CORS Middleware Setup =====
const allowedOrigins = process.env.FRONTEND_URL_CORS?.split(",").map((origin) =>
  origin.trim(),
);

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
  }),
);

// ===== Middlewares =====
const allMiddlewares = [
  morgan(process.env.LOGGER_LEVEL === "development" ? "dev" : "combined"),
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*.cloudinary.com"],
        connectSrc: ["'self'"],
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: "same-origin" },
  }),
  limiter,
  cookieParser({
    secret: process.env.COOKIE_SECRET || process.env.ACCESS_TOKEN_SECRET,
  }),
  express.json({ limit: "1mb" }),
  express.urlencoded({ extended: true, limit: "1mb" }),
];

// Use middlewares for all other routes
app.use(allMiddlewares);

// Public folder for static contents
app.use(express.static(path.join(__dirname, "../public")));

// Base route or test route
app.get("/", (_, res) => {
  res.json({
    message: "Welcome to the Task_Managment sync API",
    status: "Success✅",
    server_status: `Working🆙`,
    restart_working: "true",
    server_time: `${new Date().toLocaleString()} ⌛`,
  });
});

// API Routes
// app.use("/api/v1/permission", routeIndex.permission.permissionRoutes);
// app.use("/api/v1/role", routeIndex.role.roleRoutes);
// app.use("/api/v1/auth", routeIndex.auth.authRoutes);
// app.use("/api/v1/user", routeIndex.users.userRoutes);
// app.use("/api/v1/employee", routeIndex.employee.employeeRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
