var express = require("express"),
    router  = express.Router(),
    Blog = require("../models/blog"),
    middleware = require("../middleware"),
    { isLoggedIn, checkUserBlog, checkUserComment, isAdmin,} = middleware

// INDEX ROUTE
router.get("/", isLoggedIn, function (req, res) {
    Blog.find({}).sort({created: -1}).exec(function (err, allBlogs) {
        if(err) {
            console.log("ERROR!");
        } else {
           res.render("blogs/index", {blog: allBlogs});
        }
    });
});

// NEW ROUTE
router.get("/new", isAdmin, function (req, res) {
    res.render("blogs/new");
});

// CREATE ROUTE
router.post("/", isAdmin, function (req, res) {
    req.body.blog = req.sanitize(req.body.blog);
    var title = req.body.title;
    var image = req.body.image;
    var body = req.body.body;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBlog = {title: title, image: image, body: body, author: author}


    Blog.create(newBlog, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated)
            res.redirect("/blogs");
        }
    });
});


// SHOW ROUTE
router.get("/:id", function (req, res) {
    Blog.findById(req.params.id).populate("comments likes").exec(function (err, foundBlog) {
       if (err) {
            console.log(err);
       } else {
           console.log(foundBlog);
           res.render("blogs/show", {blog: foundBlog});
       }
    });
});

router.post("/:id/like", isLoggedIn, function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
            return res.redirect("/blogs");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundBlog.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundBlog.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundBlog.likes.push(req.user);
        }

        foundBlog.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/blogs");
            }
            return res.redirect("/blogs/" + foundBlog._id);
        });
    });
});

// EDIT ROUTE
router.get("/:id/edit", isAdmin, function (req, res) {
   Blog.findById(req.params.id, function(err, foundBlog) {
       if(err) {
           console.log(err);
       } else {
           res.render("blogs/edit", {blog: foundBlog});
       }
   });
});

// UPDATE ROUTE
router.put("/:id", isAdmin, function(req, res) {
    // req.body.blog = req.sanitize(req.body.blog);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect("back");
        } else {
         res.redirect("/blogs/" + req.params.id);
        }
    });
 });


// DESTROY ROUTE
router.delete("/:id", isAdmin, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
    });
 });
 


module.exports = router;