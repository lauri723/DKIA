var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Blog = require("../models/blog"),
    Comment = require("../models/comment"),
    middleware = require("../middleware"),
    { isLoggedIn, checkUserComment, isAdmin } = middleware

//Comments New
router.get("/new", isLoggedIn, function(req, res){
    console.log(req.params.id);
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {blog: blog});
        }
    })
});



router.post("/",isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                blog.comments.push(comment);
                blog.save();
                console.log(comment);
                res.redirect('/blogs/' + blog._id);
           }
        });
       }
   });
});

router.post("/:comment_id/like", isLoggedIn, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
            return res.redirect("/blogs" + req.params.id);
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundComment.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundComment.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundComment.likes.push(req.user);
        }

        foundComment.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/blogs" + req.params.id);
            }
            return res.redirect("/blogs/" + req.params.id);
        });
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function (err, foundComment){
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
        }
    });   
});

// COMMENT UPDATE
router.put("/:comment_id", function (req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", function (req, res){
    // find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;
