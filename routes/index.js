var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User = require("../models/user")

router.get("/", function (req, res) {
    res.render("index");
});

router.get("/diamonds", function (req, res){
     res.render("diamonds");
});

router.get("/gemstones", function (req, res){
 res.render("gemstones");
});

router.get("/jewelry", function (req, res){
 res.render("jewelry");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("registerAgain");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/blogs"); 
        });
    });
});

router.get("/adminRegister", function(req, res){
    res.render("adminRegister"); 
 });
 
 //handle sign up logic
 router.post("/adminRegister", function(req, res){
     var newUser = new User({username: req.body.username});
     if(req.body.adminCode === process.env.ADMIN_CODE) {
         newUser.isAdmin = true;
             console.log("ADMIN");
       }
     User.register(newUser, req.body.password, function(err, user){
         if(err){
             return res.render("register");
         }
         passport.authenticate("local")(req, res, function(){
            res.redirect("/blogs"); 
         });
     });
 });

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/blogs");
});


module.exports = router;
