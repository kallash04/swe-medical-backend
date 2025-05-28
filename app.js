// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes/index");
const { pool } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./api.json");

const app = express();

// -- Global Middleware ------------------------------------------------------

// Enable CORS for all origins (customize as needed)
app.use(cors());

// Limit request body size to 15MB
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Parse URL-encoded bodies (e.g. form submissions)
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan("dev"));

// -- Health Check ------------------------------------------------------------

app.get("/", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

// -- Serve Swagger UI -------------------------------------------------------
// Serves the Swagger UI at http://<host>:<port>/api-docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

// Serve raw JSON at /swagger.json
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// -- Mount Routes ------------------------------------------------------------

routes(app);

// -- Error Handler (must come last) -----------------------------------------

app.use(errorHandler);

// -- Start Server ------------------------------------------------------------

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// Optional: handle graceful shutdown
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received. Closing HTTP server.");
  app.close(() => {
    console.log("HTTP server closed.");
    pool.end(() => {
      console.log("Postgres pool has ended.");
      process.exit(0);
    });
  });
});

module.exports = app;
