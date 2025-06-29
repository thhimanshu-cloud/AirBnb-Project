const User = require("../models/user");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signUp = async (req,res)=>{
    try{
  let{username,email,password} = req.body;
    let newUser = new User({username,email});
    let currUser = await User.register(newUser,password);
console.log(currUser);
req.login(currUser,(err)=>{
    if(err){
        return next(err);
    }
   req.flash("success","new user registered");
res.redirect("/listings"); 
})
}
catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    }
  
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
req.flash("success","You are succesfullly logged in");
let redirectUrl = res.locals.redirectUrl;
if(redirectUrl){
res.redirect(res.locals.redirectUrl);
}
else{
    res.redirect("/listings");
}
}


module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!")
        res.redirect("/listings");
    })
}