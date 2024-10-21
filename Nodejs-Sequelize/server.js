const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const db = require("./db/models");
const httpServer = require("http").Server(app);
var corOptions = {
  origin: "*",
};
//* Sequelize Connection and Sync
db.sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.error("DB connection failed!", err.message);
  });
app.use(morgan("dev"));
//middlewares
app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// routers
const router = require("./routes/productRouter");
app.use("/api/products", router);

// testing api
app.get("/", (req, res) => {
  res.json({
    message: "Hello from api",
  });
});

// port
const PORT = 5000;

// server;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
