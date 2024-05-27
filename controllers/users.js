//take it one step at a time
const sendEmail = require("../mailer");
const User = require("../models/user");
module.exports.renderSignupForm = (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res) => {
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);

        function generateOTP(length) {
            const digits = '0123456789';
            let otp = '';
            for (let i = 0; i < length; i++) {
                otp += digits[Math.floor(Math.random() * 10)];
            }
            return otp;
        }
        const otp = generateOTP(6);
        await User.findByIdAndUpdate(registeredUser._id, {code:otp});
        sendEmail(email, otp );
        res.render("users/verify.ejs" , {email});
    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};

module.exports.renderVerifyForm = (req,res) => {
    const {email} = req.body;
    res.render("users/verify.ejs", {email});
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) => {
    req.flash("success" , "Welcome Back to Nomad Nest!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    }); 
};
