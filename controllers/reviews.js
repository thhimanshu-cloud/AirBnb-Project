const Review = require("../models/reviews");
const Listing = require("../models/listing");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   console.log(newReview);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   req.flash("success","New Review added");
   res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
   let{id,reviewId} = req.params;
 await Review.findByIdAndDelete(reviewId);
 await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
 req.flash("success","review deleted");
 res.redirect(`/listings/${id}`);
}
