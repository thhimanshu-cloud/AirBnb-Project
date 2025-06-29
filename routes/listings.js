const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const {validateListing} = require("../middleware.js");
var Router = require('router');
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


router
.route("/")
.get(wrapAsync(listingController.index))
.post(validateListing,upload.single('listing[image]'),isLoggedin,wrapAsync (listingController.createListing));



// New Route
router.get("/new",isLoggedin,listingController.newListing);

router
.route("/:id")
    .get(listingController.showListing)
    .put(upload.single('listing[image]'),validateListing,isLoggedin,isOwner,wrapAsync(listingController.updateListing))
    .delete(isLoggedin,isOwner,listingController.deleteListing); 


//Edit Route
router.get("/:id/edit",isLoggedin,listingController.editListing);


 


module.exports = router;