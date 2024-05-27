
const Listing = require("../models/listing"); 


module.exports.index = async (req, res) => { 
    const allListings = await Listing.find({})
    res.render ("listings/index.ejs", {allListings});
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async(req,res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path :"reviews",
        populate : {
            path : "author"
        }})
    .populate("owner");
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});
};



module.exports.createListing = async(req,res,next) => {
    //one method is that we extract all the variables like this 
    //another simpler way would be that we make below variables as a key for an object go check out new.js in form
    // let {title , description , image , price , country , location} = req.body;
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success" , "New Listing Created!");
        res.redirect("/listings");
    };



module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await  Listing.findById(id);
    if(!listing){
        req.flash("error" , " Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url; 
    originalImageUrl= originalImageUrl.replace("upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});

    // req.body.listing is a javascript object and by using 3 
    // dots we destructured it and now we can individually 
    // extract all inidvidual values jisko hum
    //apni nayi updated values mein pass krdenge

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        
        await Listing.findByIdAndUpdate(id , {image: {url, filename}});
    }
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
    //above we redirected it to show page only where we can see the updated profile
};



module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
};

