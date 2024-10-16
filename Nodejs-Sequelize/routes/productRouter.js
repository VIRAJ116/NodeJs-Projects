const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");

const router = require("express").Router();

// use routers
router.post("/addProduct", productController.addProduct);
router.get("/allProducts", productController.getAllProducts);
router.get("/published", productController.getPublishedProduct);

// Review url and Controller

router.post("/addReview", reviewController.addReview);
router.get("/allReviews", reviewController.getAllReviews);

// get product reviews
router.get('/getProductReviews', productController.getProductReviews)

router.get("/:id", productController.getOneProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
