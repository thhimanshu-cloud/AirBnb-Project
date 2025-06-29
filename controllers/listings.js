const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("index.ejs",{allListings});
};

module.exports.newListing = async(req,res)=>{
    res.render("new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
     path:"reviews",
    populate:{
        path:"author"
    },
}).populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error","listing does not exists");
        res.redirect("/listings");
    }
     res.render("show.ejs",{listing});
}

module.exports.createListing = async(req,res,next)=>{
  let response = await  geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
  
  

    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
 let listing = req.body.listing;
 let url = req.file.path;
 let filename = req.file.filename;
 console.log(`${url} , ${filename}`);
    console.log(listing);
  let newList = new Listing(listing);
  newList.image.url = url;
  newList.image.filename = filename;
  newList.owner = req.user._id;
  newList.geometry = response.body.features[0].geometry;
  console.log(req.user);
   await newList.save();
   console.log(newList);
   req.flash("success","new listing created");
    res.redirect("/listings"); 
}

module.exports.editListing = async(req,res)=>{
let {id} = req.params;
let listing = await Listing.findById(id);
console.log(listing);
req.flash("success","Listing Edited");
res.render("edit.ejs",{listing})
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
  let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file !== "undefined"){
 let url = req.file.path;
 let filename = req.file.filename;
 listing.image.url = url;
 listing.image.filename = filename;
 await listing.save();
  }
   req.flash("success","Listing Updated");
   res.redirect("/listings");
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
 let del =  await Listing.findByIdAndDelete(id);
 console.log(del);
 req.flash("success","Listing deleted");
 res.redirect("/listings");
};