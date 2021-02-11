const fs = require('fs');
const path = require('path');

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const usersRouter = require("./routes/users-routes");
const keys = require("./utils/keys");

const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  const error = new HttpError("Page not found", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path, (err) =>{ 
      console.log(err);
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iczlc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(keys.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
console.log(`Server is running on PORT: ${keys.PORT}`);
