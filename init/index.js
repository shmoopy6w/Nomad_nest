const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/nomad_nest";

main()
    .then(() => {
    console.log("connected to Db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main()
{
    await mongoose.connect(mongo_url);
}

const initDB = async () => 
{
    await Listing.deleteMany({});
    //initData array ko access karenge then apply map function on it
    //map will add a new property for each individual object
    initData.data = initData.data.map((obj) => ({...obj , owner : "665371e30f89acf3ac3f1147" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();
