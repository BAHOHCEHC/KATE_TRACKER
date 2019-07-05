const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

// const analyticsRoutes = require('./routes/analytics')
// const orderRoutes = require('./routes/order')
// const positionRoutes = require("./routes/position");
const authRoutes = require("./routes/auth");
const clientsRoutes = require("./routes/clients");
const taskRoutes = require("./routes/task");
const keys = require("./config/keys");
const app = express();

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected."))
  .catch(error => console.log(error));
	
// использование стратегий доступа
app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/task", taskRoutes);
// app.use("/api/position", positionRoutes);
// app.use('/api/analytics', analyticsRoutes)
// app.use('/api/order', orderRoutes)

module.exports = app;
