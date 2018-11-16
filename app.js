var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    // Use campground schema from /models/campground.js file 
    Campground  = require("./models/campground"),
    // Will clear every data from DB. (error driven code)
    seedDB      = require("./seeds");

// remove data from db
seedDB();

// use yelp_camp db if exists, if not, it will create yelp_camp db.
// mongoose.connect("mongodb://localhost/yelp_camp");

// use mLab db instead of local mongodb
mongoose.connect("mongodb://admin:admin123@ds149144.mlab.com:49144/wdbc1_yelp_camp"); 

// 
app.set("view engine", "ejs");
// set body parser
app.use(bodyParser.urlencoded({extended: true}));


// use campground schema
// var Campground = require("./models/campground");

// TEST db, add one data
// Campground.create(
//   {
//     name: "Mountain Goat's Rest",
//     image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807_1280.jpg",
//     description: "This is a huge granite hill. No bathrooms, no water. Beautiful granite!"
//   }, function(err, campground){
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("NEWLY CREATED CAMPGROUND: ");
//       console.log(campground);
//     }
//   });

// dummy data for campgrounds
// var campgrounds = [
//   {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
//   {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
//   {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807_1280.jpg"},
//   {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
//   {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
//   {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807_1280.jpg"}
// ];

 
// ============================================================================
// ROUTES
// ============================================================================

// root ROUTE
app.get("/", function(req, res){
  res.render("landing");
});

// list all campgrounds
app.get("/campgrounds", function(req, res){
  // pass campgrounds data to list all campgrounds on campgrounds.ejs
  // res.render("campgrounds", {campgrounds: campgrounds});

  // Get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

// save newly added campground
app.post("/campgrounds", function(req, res){
  // get data from new campground form and add to campgrounds db
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  // make name and image variables as object
  var newCampground = {name: name, image: image, description: desc};
  // and push newCampground to campgrounds array
  // campgrounds.push(newCampground);

  // Create new campground and save to db
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err)
    } else {
      // redirect back to campgrounds page which by default will go to /campgrounds app.get ROUTE
      res.redirect("/campgrounds");
    }
  });  
});

// add new campground
app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

// shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
  // find the campground with the provided ID
  // and populate with comments
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  // Campground.findById(req.params.id, function(err, foundCampground){  
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      // render show template with that campground
      // res.send("THIS WILL BE THE SHOW PAGE SOON!");
      res.render("show", {campground: foundCampground});
    }
  });
});



// ============================================================================
// START SERVER
// ============================================================================
app.listen(3000, function(){
  console.log("Yelpcamp server has started...");
});