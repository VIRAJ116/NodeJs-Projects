const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const db = require("./db/models");
const httpServer = require("http").Server(app);

var corOptions = {
  origin: "*",
};

//* App Route Versions
const V1Routes = "/api/v1";

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

// App Routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    res.status(500).json({ error: `${err}` });
    common.throwException(err);
  });
};

// routers
const wrapRoutesWithAsyncHandler = (router) => {
  router.stack.forEach((layer) => {
    if (layer.handle && layer.handle.stack) {
      // Iterate over the nested layers
      layer.handle.stack.forEach((innerLayer) => {
        if (innerLayer.handle && innerLayer.handle.stack) {
          innerLayer.handle.stack.forEach((subInnerLayer) => {
            subInnerLayer.route.stack.forEach((deepLayer) => {
              if (isFunctionAsync(deepLayer.handle)) {
                // Pass only async functions to async handler
                deepLayer.handle = asyncHandler(deepLayer.handle);
              }
            });
          });
        }
      });
    }
  });
  return router;
};

app.use(V1Routes, wrapRoutesWithAsyncHandler(require("./routes_controller")));

// testing api
app.get("/", (req, res) => {
  res.json({
    message: "Hello from api",
  });
});

// port
const PORT = 5000;

// //* Server
app.use((req, res, next) => {
  req.APINotFound = true;
  return res.status(404).json({
    error: "Not Found",
    message: `EndPoint not available: ${req.method} ${
      req.originalUrl?.split("?")[0]
    }`,
  });
});

// server;
httpServer.listen(PORT, function () {
  // eslint-disable-next-line no-console
  console.log("Magic happens on localhost:" + PORT);
});
