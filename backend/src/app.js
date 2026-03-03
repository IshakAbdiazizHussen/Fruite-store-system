const express = require("express");
const cors = require("cors");

const { corsOptions } = require("./config/cors");
const apiRoutes = require("./routes/api");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
