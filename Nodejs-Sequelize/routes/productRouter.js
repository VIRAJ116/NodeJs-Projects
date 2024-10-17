const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");

const router = require("express").Router();

// use routers
router.post("/addProduct", productController.addProduct);
router.get("/allProducts", productController.getAllProducts);
router.get("/published", productController.getPublishedProduct);

// Review url and Controller

// Route to create a review
router.post("/:productId/addReview", (req, res) => {
  req.body.productId = req.params.productId; // Ensure productId is set
  reviewController.addReview(req, res); // Call the controller to create review
});
router.get("/allReviews", reviewController.getAllReviews);

// get product reviews
router.get("/:productId/getProductReviews", productController.getProductReviews);

router.get("/:id", productController.getOneProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
