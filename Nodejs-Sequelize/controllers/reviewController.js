const db = require("../models");

// model
const Review = db.reviews;

//1 Add review
exports.addReview = async (req, res) => {
  let data = {
    rating: req.body.rating,
    description: req.body.description,
  };
  const review = await Review.create(data);
  res.status(200).json({
    data: review,
  });
};

// 2) Get All Reviews

exports.getAllReviews = async (req, res) => {
  const reviews = await Review.findAll({});
  res.status(200).json({
    data: reviews,
  });
};
