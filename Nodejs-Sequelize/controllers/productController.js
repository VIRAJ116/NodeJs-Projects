const db = require("../db/models");

// create main Model

const Product = db.products;
const Review = db.reviews;

// 1. create product

exports.addProduct = async (req, res) => {
  try {
    let info = {
      title: req?.body?.title,
      price: req?.body?.price,
      description: req?.body?.description,
      published: req.body.published ? req.body.published : false,
    };

    // Try to create the product
    const product = await Product.create(info);

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    // Check if the error is a Sequelize unique constraint error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: "error",
        message: "Product with this title already exists.",
      });
    }

    // Handle other errors
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// 2) get all products

exports.getAllProducts = async (req, res) => {
  let products = await Product.findAll({
    attributes: ["id", "title", "price"],
  });
  res.status(200).send(products);
};

// 3) get single product

exports.getOneProduct = async (req, res) => {
  let id = req.params.id;
  let product = await Product.findOne({ where: { id: id } });
  res.status(200).send(product);
};

// 4) update product

exports.updateProduct = async (req, res) => {
  let id = req.params.id;
  const product = await Product.update(req.body, { where: { id } });
  res.status(200).send(product);
};

// 5) delete product by id

exports.deleteProduct = async (req, res) => {
  let id = req.params.id;
  await Product.destroy({ where: { id } });
  res.status(200).send("Product deleted!");
};

// 6) get published product

exports.getPublishedProduct = async (req, res) => {
  const products = await Product.findAll({ where: { published: true } });
  res.status(200).send(products);
};

// 7) connect one to many relation product and reviews

exports.getProductReviews = async (req, res) => {
  const data = await Product.findAll({
    include: [
      {
        model: Review,
        as: "review",
      },
    ],
    where: { id: req.params.productId },
  });
  res.status(200).json({
    data,
  });
};
