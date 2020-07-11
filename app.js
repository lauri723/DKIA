require("dotenv").config();
var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    cookieParser   = require("cookie-parser"),
    LocalStrategy  = require("passport-local"),
    expressSanitizer = require("express-sanitizer"),
    Blog           = require("./models/blog"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    session        = require("express-session"),
    methodOverride = require("method-override")

var commentRoutes  = require("./routes/comments"),
    blogRoutes     = require("./routes/blogs"),
    indexRoutes    = require("./routes/index")

mongoose.connect("mongodb://localhost/temp_dkia", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
app.use(cookieParser('secret'));

app.use(require("express-session")({
    secret: "I am really short",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes)


// app.listen(process.env.PORT, process.env.IP, () => {
//     console.log("The Server Has Started!");
//  }); 


app.listen(3000, function() { 
    console.log('Server listening on port 3000'); 
});
