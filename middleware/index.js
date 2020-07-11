var Blog = require("../models/blog");
var Comment = require("../models/comment");

module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/login');
    },

    checkUserBlog: function(req, res, next){
      Blog.findById(req.params.id, function(err, foundBlog){
        if(err || !foundBlog){
            console.log(err);
            res.redirect('/blogs');
        } else if(foundBlog.author.id.equals(req.user._id) || req.user.isAdmin){
            req.blog = foundBlog;
            next();
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
      });
    },

    checkUserComment: function(req, res, next){
      if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
          if(err || !foundComment){
              res.redirect('back');
          } else {
              if(foundComment.author.id.equals(req.user._id)){
                  next();
              } else {
                req.flash("error", "You don't have permission to do that")
                res.redirect("back");
            }
          }
      });
      } else {
        req.flash("You need to be logged in to do that")
        res.redirect("back");
      }
    },

      isAdmin: function(req, res, next) {
        if(req.user.isAdmin) {
          next();
        } else {
          res.redirect('back');
        }
      }
    }          
  
  