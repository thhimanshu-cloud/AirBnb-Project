if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

console.log(process.env);



const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended : true}));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const engine = require('ejs-mate');
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));
const listingRoute = require("./routes/listings.js");
const reviewRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
var flash = require('connect-flash');
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
 
let DB_URL = process.env.ATLAS_URL;

const store = MongoStore.create({
  mongoUrl : DB_URL,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
    secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expire:Date.now()+3*24*60*60*1000,
    maxAge: 3*24*60*60*1000,
    httpOnly:true,
  }
};

app.use(session(sessionOptions));
 app.use(flash());

 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

 app.get("/demoUser",async(req,res)=>{
  let fakeUser = new User({
    email : "student@gmai.com",
    username : "delta-student"
  });
   let newUser = await  User.register(fakeUser,"Hello World");
   res.send(newUser);
 })


 app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;

    next();
 })

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("",userRoute);



main()
.then(()=>{
    console.log("mongo connected successfully");
})
.catch(err => console.log(err));



async function main() {
  await mongoose.connect(DB_URL);
}

app.listen(8080,(req,res)=>{
    console.log('app is listening on 8080');
});

app.get("/",(req,res)=>{
    res.render("index.ejs);
})






app.use((err,req,res,next)=>{
    let {status=401,message="page not found"} = err;
    res.status(status).render("error.ejs",{message});
})
