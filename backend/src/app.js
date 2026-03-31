const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { corsOptions } = require("./config/cors");
const apiRoutes = require("./routes/api");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
