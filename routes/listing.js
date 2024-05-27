const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");


const multer = require("multer"); 
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); 



//when we made this file we copied all the api from app.js which had app.post or app.get
//but now we removed app from evey api and we ae using router there


//Index Route
router.get("/" , wrapAsync(listingController.index));

//New Route
router.get("/new" ,isLoggedIn, listingController.renderNewForm);


//show route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/" , 
    isLoggedIn ,
    upload.single("listing[image]"),
    validateListing , 
    wrapAsync(listingController.createListing)
);

//edit Route
router.get("/:id/edit" ,
    isLoggedIn ,
    isOwner,
    wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id" , 
    isLoggedIn , 
    upload.single("listing[image]"),
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id" , 
isLoggedIn ,
isOwner,
wrapAsync(listingController.destroyListing));


module.exports = router;
//To up our styling game we will download a te,plate named EJS Mate
//But why? So many times we want the same navbar on different webpages of a website
//sometimes footer as well ..now we wont keep on writing the same code for every page..
//It would ne uncessarily extra code so we will be using ejs mate for that
//based on the concept of partials and includes in ejs
