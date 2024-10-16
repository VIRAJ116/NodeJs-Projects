const express = require("express");
const cors = require("cors");

const app = express();

var corOptions = {
  origin: "*",
};

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
const PORT = process.env.PORT || 5000;

// server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
