require("dotenv").config();

const userRouter = require("./routes/UserRouter");
const quizRouter = require("./routes/QuizRouter");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONT_END_URL }));
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.get("/", (req, res) => {
  res.send("hello world");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT);
    console.log("mongo db connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(cookieParser())
app.use((req, res, next) => {
  const authHeader = req.headers.cookie;
  if (authHeader) {
    req.headers.authorization = authHeader.substring(4);
  }
  next();
});
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.FRONT_END_URL);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use("/api/user", userRouter);
app.use("/api/quiz", quizRouter);

