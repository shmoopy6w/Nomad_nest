const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.get("/signup" , userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/verify" , userController.renderVerifyForm);    

router.post("/verify" , async(req,res) => {
    const {code, email} = req.body;
    console.log(code, email);
    const user = await User.findOne({email: email});
    console.log(user);
    if(user.code === code) {
        await User.findOneAndUpdate({email: email}, {status: true})
        req.login(user , async(err) => {
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to Nomad Nest");
            res.redirect("/listings");
        })
    } else {
        req.flash("error", "Incorrect Code Please Create a new Account");
        await User.findOneAndDelete({email: email});
        res.redirect("/signup");
    }
})

router.get("/login" , userController.renderLoginForm);

router.post("/login" , async(req,res,next) => {
    const {username} = req.body;
    const user = await User.findOne({username: username});
    if(user.status === null || !user.status) {
        req.flash("error", "Verification failed Please Create a new Account");
        await User.findOneAndDelete({username: username});
        res.redirect("/signup");
    }
    next();
} ,
    saveRedirectUrl,
    passport.authenticate("local" , {
        failureRedirect : "/login",
        failureFlash : true ,
    }),
    userController.login
);

router.get("/logout" , userController.logout);

module.exports = router;