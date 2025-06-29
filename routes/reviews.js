const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { isLoggedin, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const {validateReview} = require("../middleware.js");


// Reviews
// post 
router.post("",validateReview,isLoggedin,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedin,isAuthor,reviewController.destroyReview);

module.exports = router;