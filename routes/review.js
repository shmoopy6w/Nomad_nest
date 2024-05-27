const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//Post review Route
router.post(
    "/" ,
    isLoggedIn,
    validateReview ,
    //wrapAsync is used for basic error handling
    wrapAsync(reviewController.createReview));

//delete route for reviews
// $pull operator ka kya kaam hota hai mongoose mein?
// It removes from an existing array all instances of a value or
//  values that match a specified condition

router.delete("/:reviewId" , 
    isReviewAuthor , 
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;



// Reviews
//Post review Route
//an error that we encountered 
// Cannot read properties of null (reading 'reviews')
//ye isiliye hai kyunki initially in app.js
// app.use("/listings/:id/reviews" , reviews);
//we have :id here aur ye id yehi reh jaati hai 
//consoloe.log kro ton undefined aati hai
//kyunki ye app.js ke file mein hi rehta hai
//we wan ki wo reviews ki file mein bhi aaye
// There we use MERGE PARAMS
//USED SOMETHING LIKE BELOW
// router = express.Router({mergeParams : true});
//this preserves the  req.params values 
// from parent router
//isko hum router define krte time merge params 
//use krte hai like above




//so what is the use of express router?
//We had a pretty bulky code in app.js
//with the help of router we reudced it by 
//shifting and restructuring those files
//to routes folder
//In formal way:
// Express router is a way to organise your express Application
// such that ou primary app.js file does not
// become bloated
// const outer = express.router()
//code ko chote chote tukde mt baatne se
// code ko smjhana easy hota hai