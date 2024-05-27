const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
require('dotenv').config();

//from routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const profileRouter = require("./routes/profile.js");

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json()); 
// const mongo_url = "mongodb://127.0.0.1:27017/nomad_nest";

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
    console.log("connected to Db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main()
{
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname , "public")));

// app.get("/" , (req,res)=>{
//     res.send("Hi , I am root");
// });
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600, 
});

store.on("error" , () => {
    console.log("Error in Mongo Session Store" , err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave :  false,
    saveUnitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
        //why do we put httpOnly to true?
        //  To prevent cross scripting attacks

    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //user ki info store krana serialize
passport.deserializeUser(User.deserializeUser()); //uss info ko unstore krwana deserialize
/*
a web app needs to ability to identify users as they browse form page to page.
This series of requests and responses , each associated with the same use
, known as a session.
*/
app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//the common path is /listings
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/profile", profileRouter);
app.use("/" , userRouter);

app.all("*" , (req,res, next) =>{
    next(new ExpressError(404 , "Page not found!"));
});

app.use((err , req , res , next ) =>{
    let {statusCode = 500 , message ="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs" ,{ message});
});


const PORT = process.env.PORT || 8080 ;

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
});


